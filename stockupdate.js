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
    // 1. Fetch stock from Vision database
    const result = await pool.request().query(`
      SELECT ITCODE, BALANCE FROM STOCKUPDATE WHERE BALANCE >= 0
    `);

    if (!result.recordset || result.recordset.length === 0) {
      log('ℹ️ No stock data found in STOCKUPDATE table.');
      return;
    }

    // 2. Format database rows
    const stocksData = result.recordset.map(row => ({
      vision_product_id: row.ITCODE,
      stock: Math.max(0, Math.floor(row.BALANCE)) // Ensure non-negative integers
    }));

    log(`Retrieved ${stocksData.length} records from Vision. Syncing to Supabase...`);

    // 3. Attempt RPC Bulk Update
    const { error: rpcError } = await supabase.rpc('update_product_stocks', { p_stocks: stocksData });

    if (rpcError) {
      // Check if function does not exist (PGRST202 or similar status/message)
      const fnNotExist = rpcError.code === 'PGRST202' || 
                         rpcError.message.includes('does not exist') ||
                         rpcError.message.includes('function');
      
      if (fnNotExist) {
        log(`💡 Info: Custom function 'update_product_stocks' not found in Supabase.`);
        log(`   For 50x faster syncing, run the bulk update SQL in your Supabase SQL Editor.`);
        
        // Run fallback row-by-row sync
        const success = await fallbackRowByRowSync(stocksData);
        if (success) {
          log(`✅ Stock sync completed successfully using fallback mode.`);
        }
      } else if (rpcError.message.includes('stock') || rpcError.code === 'PGRST204') {
        log(`🛑 Database Error: The 'stock' column is missing from your 'products' table in Supabase.`);
        log(`   Please run this in your Supabase SQL Editor: ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0;`);
      } else {
        throw rpcError;
      }
    } else {
      log(`📦 Stock synced successfully! — ${stocksData.length} items updated (Bulk RPC mode).`);
    }

  } catch (err) {
    log(`❌ Error during stock sync: ${err.message}`);
  }
}

// Connect to SQL Server and start interval
log('🚀 KMART Stock Sync daemon starting...');
sql.connect(CONFIG.sqlServer).then(pool => {
  log('✅ SQL Server connected successfully.');

  // Run immediately on start
  syncStock(pool);

  // Poll every 15 minutes
  setInterval(() => syncStock(pool), CONFIG.syncIntervalMs);
}).catch(err => {
  log(`❌ SQL Server connection failed: ${err.message}`);
  process.exit(1);
});
