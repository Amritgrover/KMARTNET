const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kmfekxzkbgneqwhukgbh.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgxNTc1OCwiZXhwIjoyMDk2MzkxNzU4fQ.AqoLdTgNGrsC1eCmKriAV1K8cPeRny4ORaT26V4Gexc';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  console.log('Fetching all products from Supabase...');
  const { data: products, error: fetchErr } = await supabase
    .from('products')
    .select('id, notes');

  if (fetchErr) throw fetchErr;

  console.log(`Setting is_visible: false for all ${products.length} products...`);

  const chunkSize = 20;
  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (p) => {
      let notesObj = {};
      if (p.notes) {
        try { notesObj = typeof p.notes === 'string' ? JSON.parse(p.notes) : p.notes; } catch(e) {}
      }
      notesObj.is_visible = false;
      
      const { error: updateErr } = await supabase
        .from('products')
        .update({ notes: JSON.stringify(notesObj) })
        .eq('id', p.id);

      if (updateErr) console.error(`Error updating product id ${p.id}:`, updateErr.message);
    }));
  }

  console.log('🎉 All products are now set to hidden (is_visible: false)!');
}

main().catch(console.error);
