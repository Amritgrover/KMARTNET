const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://kmfekxzkbgneqwhukgbh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgxNTc1OCwiZXhwIjoyMDk2MzkxNzU4fQ.AqoLdTgNGrsC1eCmKriAV1K8cPeRny4ORaT26V4Gexc'
);

async function check() {
  const { data: products, error: pErr } = await supabase.from('products').select('id, name, stock, product_batches(*)');
  if (pErr) {
    console.error(pErr);
    return;
  }
  
  products.forEach(p => {
    const batches = p.product_batches || [];
    if (batches.length > 1) {
      console.log(`Product with multiple batches: ${p.name} (ID: ${p.id}), global stock: ${p.stock}`);
      batches.forEach(b => {
        console.log(`  - Batch: ${b.batch}(bch:${b.bchcode}), stock: ${b.stock}, mrp: ${b.mrp}`);
      });
    }
  });
}

check();
