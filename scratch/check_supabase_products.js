const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://kmfekxzkbgneqwhukgbh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgxNTc1OCwiZXhwIjoyMDk2MzkxNzU4fQ.AqoLdTgNGrsC1eCmKriAV1K8cPeRny4ORaT26V4Gexc'
);

async function test() {
  const { data, error } = await supabase.from('products').select('id,name,brand,cat').neq('brand', '').limit(10);
  if (error) {
    console.error('Error fetching products:', error);
  } else {
    console.log('Products with brand:', JSON.stringify(data, null, 2));
  }
}

test();
