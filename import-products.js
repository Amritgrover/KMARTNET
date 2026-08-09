// ============================================================
// KMART → Vision Product Import Script
// Reads active items from Vision SQL Server and imports into Supabase
// ============================================================

const sql = require('mssql');
const { createClient } = require('@supabase/supabase-js');

const CONFIG = {
  sqlServer: {
    server: 'localhost',
    database: 'D:\\VISIONSQL\\DATA\\C001\\C00103\\WINDATA.MDF',
    user: 'sa',
    password: 'kmart@123',
    requestTimeout: 60000,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      trustedConnection: true,
    },
  },
  supabase: {
    url: 'https://kmfekxzkbgneqwhukgbh.supabase.co',
    serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgxNTc1OCwiZXhwIjoyMDk2MzkxNzU4fQ.AqoLdTgNGrsC1eCmKriAV1K8cPeRny4ORaT26V4Gexc',
  }
};

const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.serviceRoleKey);

function log(msg) {
  console.log(`[Product Import] [${new Date().toLocaleString('en-IN')}] ${msg}`);
}

async function runImport() {
  log('Starting Vision product import process...');
  let pool;

  try {
    pool = await sql.connect(CONFIG.sqlServer);
    log('✅ SQL Server connected.');

    // 1. Fetch active Vision items
    const visResult = await pool.request().query(`
      SELECT 
        ITCODE, ITNAME, MRP, PACK1, PRICERET, NCPAGST, SGST, CGST, UNIT, GCODE
      FROM item
      WHERE ITCODE > 0 AND ITNAME IS NOT NULL AND LTRIM(RTRIM(ITNAME)) != ''
      ORDER BY ITCODE
    `);

    const visItems = visResult.recordset || [];
    log(`Retrieved ${visItems.length} active items from Vision.`);

    if (visItems.length === 0) {
      log('No items found in Vision.');
      return;
    }

    // 2. Fetch latest active batch pricing from Batch_master
    const batchResult = await pool.request().query(`
      SELECT 
        ITCODE, BCHCODE, BATCH, MRP, PRICERET, NCPAGST
      FROM Batch_master
      WHERE ITCODE > 0
    `);

    const batchMap = new Map();
    (batchResult.recordset || []).forEach(b => {
      if (!batchMap.has(b.ITCODE)) {
        batchMap.set(b.ITCODE, []);
      }
      batchMap.get(b.ITCODE).push(b);
    });

    // 3. Fetch existing Supabase products to preserve metadata and vision_product_id mappings
    const { data: existingProds, error: sbErr } = await supabase
      .from('products')
      .select('*');

    if (sbErr) throw sbErr;

    const existingMapByVisionId = new Map();
    const existingMapByName = new Map();

    (existingProds || []).forEach(p => {
      if (p.vision_product_id) {
        existingMapByVisionId.set(Number(p.vision_product_id), p);
      }
      if (p.name) {
        existingMapByName.set(p.name.trim().toLowerCase(), p);
      }
    });

    log(`Found ${existingProds.length} existing products in Supabase.`);

    let insertedCount = 0;
    let updatedCount = 0;
    const recordsToUpsert = [];

    for (const vItem of visItems) {
      const itcode = Number(vItem.ITCODE);
      const name = (vItem.ITNAME || '').trim();
      const caseSize = Number(vItem.PACK1) || 1;
      const unit = (vItem.UNIT || 'PCS').trim().toUpperCase() || 'PCS';

      // Determine active batch pricing if present
      const batches = batchMap.get(itcode) || [];
      const activeBatch = batches.sort((a, b) => (b.BCHCODE || 0) - (a.BCHCODE || 0))[0];

      const mrp = activeBatch && parseFloat(activeBatch.MRP) > 0 ? parseFloat(activeBatch.MRP) : (parseFloat(vItem.MRP) || 0);
      const tp = activeBatch && parseFloat(activeBatch.PRICERET) > 0 ? parseFloat(activeBatch.PRICERET) : (parseFloat(vItem.PRICERET) || 0);
      const cp = activeBatch && parseFloat(activeBatch.NCPAGST) > 0 ? parseFloat(activeBatch.NCPAGST) : (parseFloat(vItem.NCPAGST) || 0);

      // Check existing mapping
      const existing = existingMapByVisionId.get(itcode) || existingMapByName.get(name.toLowerCase());

      if (existing) {
        // Prepare update object
        let notesObj = {};
        if (existing.notes) {
          try { notesObj = JSON.parse(existing.notes); } catch (e) {}
        }

        recordsToUpsert.push({
          id: existing.id,
          name: existing.name || name,
          vision_product_id: itcode,
          mrp: mrp > 0 ? mrp : (existing.mrp || 0),
          tp: tp > 0 ? tp : (existing.tp || 0),
          cp: cp > 0 ? cp : (existing.cp || 0),
          cs: caseSize,
          packsize: caseSize,
          unit: existing.unit || unit,
          notes: JSON.stringify({
            ...notesObj,
            cp: cp > 0 ? cp : (notesObj.cp || existing.cp || 0),
            cs: String(caseSize),
            is_visible: notesObj.is_visible !== undefined ? notesObj.is_visible : true
          })
        });
        updatedCount++;
      } else {
        // Insert new imported product (hidden by default: is_visible = false)
        recordsToUpsert.push({
          name: name,
          vision_product_id: itcode,
          mrp: mrp,
          tp: tp,
          cp: cp,
          cs: caseSize,
          packsize: caseSize,
          unit: unit,
          cat: 'General',
          brand: 'Vision',
          notes: JSON.stringify({
            cp: cp,
            cs: String(caseSize),
            customer_price: tp,
            tier2_min_qty: 0,
            tier2_price: 0,
            note: '',
            is_visible: false // Hidden until enabled by Admin in Vision Products tab
          })
        });
        insertedCount++;
      }
    }

    const updatesToPerform = recordsToUpsert.filter(r => r.id !== undefined);
    const insertsToPerform = recordsToUpsert.filter(r => r.id === undefined);

    log(`Processing ${updatesToPerform.length} updates and ${insertsToPerform.length} new inserts...`);

    // 1. Perform Updates for existing products using .update()
    const updateChunkSize = 10;
    for (let i = 0; i < updatesToPerform.length; i += updateChunkSize) {
      const chunk = updatesToPerform.slice(i, i + updateChunkSize);
      await Promise.all(chunk.map(async (item) => {
        const { id, ...updateFields } = item;
        const { error: updErr } = await supabase
          .from('products')
          .update(updateFields)
          .eq('id', id);

        if (updErr) {
          log(`❌ Update failed for product id ${id} (${item.name}): ${updErr.message}`);
        }
      }));
    }

    // 2. Perform Inserts for new products using .insert()
    const insertChunkSize = 50;
    for (let i = 0; i < insertsToPerform.length; i += insertChunkSize) {
      const chunk = insertsToPerform.slice(i, i + insertChunkSize);
      const { error: insertErr } = await supabase
        .from('products')
        .insert(chunk);

      if (insertErr) {
        log(`❌ Insert chunk ${i / insertChunkSize + 1} failed: ${insertErr.message}`);
      }
    }

    log(`🎉 Success! Import finished. Processed ${recordsToUpsert.length} items (${insertsToPerform.length} newly added, ${updatesToPerform.length} updated).`);

  } catch (err) {
    log(`❌ Import error: ${err.message}`);
  } finally {
    if (pool) await pool.close();
  }
}

if (require.main === module) {
  runImport();
}

module.exports = { runImport };
