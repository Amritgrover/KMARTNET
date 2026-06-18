// ============================================================
// KMART → Vision Stock Sync Script
// Runs on billing PC — polls stock from Vision and updates Supabase
// ============================================================

const sql = require('mssql');
const { createClient } = require('@supabase/supabase-js');

// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
  supabase: {
    url: 'https://kmfekxzkbgneqwhukgbh.supabase.co',
    serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgxNTc1OCwiZXhwIjoyMDk2MzkxNzU4fQ.AqoLdTgNGrsC1eCmKriAV1K8cPeRny4ORaT26V4Gexc',
  },
  sqlServer: {
    server: 'localhost',
    database: 'D:\\VISIONSQL\\DATA\\C001\\C00103\\WINDATA.MDF',
    user: 'sa',
    password: 'kmart@123',
    requestTimeout: 60000,
    connectionTimeout: 30000,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      trustedConnection: true,
    },
  },
  syncIntervalMs: 15 * 60 * 1000, // 15 minutes
};

const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.serviceRoleKey);

function log(msg) {
  console.log(`[Stock Sync] [${new Date().toLocaleString('en-IN')}] ${msg}`);
}

/**
 * Fallback function to update stocks row-by-row in concurrent chunks
 */
async function fallbackRowByRowSync(stocksData) {
  log(`⚠️ Running fallback row-by-row update for ${stocksData.length} items...`);
  
  const chunkSize = 10; // Process 10 items concurrently at a time to avoid overloading
  for (let i = 0; i < stocksData.length; i += chunkSize) {
    const chunk = stocksData.slice(i, i + chunkSize);
    const promises = chunk.map(async (item) => {
      try {
        const { error } = await supabase
          .from('products')
          .update({ stock: item.stock })
          .eq('vision_product_id', item.vision_product_id);

        if (error) {
          if (error.code === 'PGRST204' || error.message.includes('stock')) {
            throw new Error(`MISSING_COLUMN: ${error.message}`);
          }
          throw error;
        }
      } catch (err) {
        log(`❌ Failed to update vision_product_id ${item.vision_product_id}: ${err.message}`);
        return err;
      }
    });

    const results = await Promise.all(promises);
    
    // If we detect the stock column is missing, abort completely
    const columnMissingError = results.find(r => r && r.message && r.message.includes('MISSING_COLUMN'));
    if (columnMissingError) {
      log(`🛑 Sync aborted. Please add the 'stock' column to your Supabase 'products' table.`);
      log(`   SQL to run: ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0;`);
      return false;
    }
  }
  return true;
}

/**
 * Primary stock sync function
 */
async function syncStock(pool) {
  log('Starting stock sync...');
  try {
    // 1. Fetch products from Supabase
    const { data: dbProducts, error: prodErr } = await supabase
      .from('products')
      .select('id, vision_product_id');

    if (prodErr) throw prodErr;

    const prodMap = new Map();
    const productStockMap = new Map();
    dbProducts.forEach(p => {
      if (p.vision_product_id) {
        prodMap.set(p.vision_product_id, p.id);
      }
      productStockMap.set(p.id, 0); // Initialize stock to 0
    });

    // 2. Fetch stock and batch details from Vision database (Batch_master table)
    const result = await pool.request().query(`
      SELECT ITCODE, BCHCODE, BATCH, STOCKBAL, MRP FROM Batch_master WHERE ITCODE > 0
    `);

    if (!result.recordset || result.recordset.length === 0) {
      log('ℹ️ No stock/batch data found in Batch_master table.');
      return;
    }

    // 3. Format database rows for product_batches and determine main product properties
    const batchesData = [];
    const productMrpMap = new Map();

    dbProducts.forEach(p => {
      productMrpMap.set(p.id, null);
    });

    // Group batches by product id
    const batchesByProduct = new Map();
    result.recordset.forEach(row => {
      const productId = prodMap.get(row.ITCODE);
      if (productId) {
        if (!batchesByProduct.has(productId)) {
          batchesByProduct.set(productId, []);
        }
        batchesByProduct.get(productId).push(row);
      }
    });

    for (const [productId, rows] of batchesByProduct.entries()) {
      // Sort rows to select active batch MRP:
      // Prioritize rows with stock > 0, then by BCHCODE descending (latest batch)
      const sortedRows = [...rows].sort((a, b) => {
        const aStock = a.STOCKBAL > 0 ? 1 : 0;
        const bStock = b.STOCKBAL > 0 ? 1 : 0;
        if (aStock !== bStock) return bStock - aStock; // Positive stock first
        return b.BCHCODE - a.BCHCODE; // Higher BCHCODE first
      });

      const activeRow = sortedRows[0];
      if (activeRow) {
        productMrpMap.set(productId, parseFloat(activeRow.MRP) || 0);
      }

      rows.forEach(row => {
        const stock = Math.max(0, Math.floor(row.STOCKBAL));
        batchesData.push({
          product_id: productId,
          bchcode: row.BCHCODE,
          batch: row.BATCH || '',
          mrp: parseFloat(row.MRP) || 0,
          stock: stock
        });
        productStockMap.set(productId, productStockMap.get(productId) + stock);
      });
    }

    log(`Retrieved ${batchesData.length} active batch records from Vision.`);

    // 4. Upsert product_batches in Supabase
    const { error: upsertErr } = await supabase
      .from('product_batches')
      .upsert(batchesData, { onConflict: 'product_id,bchcode' });

    if (upsertErr) throw upsertErr;
    log('✅ Synchronized product batches to Supabase.');

    // 5. Update main product stock and MRP in Supabase (chunked updates to avoid identity column constraints)
    const productsUpdateData = Array.from(productStockMap.entries()).map(([id, stock]) => {
      const mrp = productMrpMap.get(id);
      const updateObj = { id, stock };
      if (mrp !== null && mrp !== undefined) {
        updateObj.mrp = mrp;
      }
      return updateObj;
    });

    log(`Syncing ${productsUpdateData.length} product stocks and MRPs to Supabase...`);
    const chunkSize = 20;
    for (let i = 0; i < productsUpdateData.length; i += chunkSize) {
      const chunk = productsUpdateData.slice(i, i + chunkSize);
      await Promise.all(chunk.map(async (item) => {
        const updatePayload = { stock: item.stock };
        if (item.mrp !== undefined) {
          updatePayload.mrp = item.mrp;
        }
        const { error } = await supabase
          .from('products')
          .update(updatePayload)
          .eq('id', item.id);
        if (error) {
          log(`❌ Failed to update product ID ${item.id}: ${error.message}`);
        }
      }));
    }
    log(`✅ Synchronized main product stocks and MRPs to Supabase.`);

  } catch (err) {
    log(`❌ Error during stock sync: ${err.message}`);
  }
}

// Connect to SQL Server and start interval
log('🚀 KMART Stock Sync daemon starting...');
sql.connect(CONFIG.sqlServer).then(pool => {
  log('✅ SQL Server connected successfully.');

  // Run once and close the connection
  syncStock(pool).then(() => {
    sql.close();
  });
}).catch(err => {
  log(`❌ SQL Server connection failed: ${err.message}`);
  process.exit(1);
});
