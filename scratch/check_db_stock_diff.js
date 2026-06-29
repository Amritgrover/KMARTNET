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
  
  console.log('Mismatched stocks in Database:');
  let count = 0;
  products.forEach(p => {
    const batchSum = (p.product_batches || []).reduce((sum, b) => sum + b.stock, 0);
    if (p.stock !== batchSum) {
      console.log(`Product: ${p.name} (ID: ${p.id})`);
      console.log(`  - products.stock: ${p.stock}`);
      console.log(`  - Sum of product_batches.stock: ${batchSum}`);
      console.log(`  - Batches details:`, p.product_batches.map(b => `${b.batch || 'no-name'}(bch:${b.bchcode}): stock=${b.stock}`));
      count++;
    }
  });
  if (count === 0) {
    console.log('None! Database is perfectly in sync.');
  }
}

check();
