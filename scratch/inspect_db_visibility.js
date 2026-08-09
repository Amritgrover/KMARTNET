const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kmfekxzkbgneqwhukgbh.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgxNTc1OCwiZXhwIjoyMDk2MzkxNzU4fQ.AqoLdTgNGrsC1eCmKriAV1K8cPeRny4ORaT26V4Gexc';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, vision_product_id, notes, note');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Total products in Supabase: ${products.length}`);
  
  let visibleCount = 0;
  let hiddenCount = 0;
  let noNotesCount = 0;

  const sampleVisible = [];
  const sampleHidden = [];

  products.forEach(p => {
    let isVis = true;
    if (p.is_visible === false) isVis = false;
    
    if (p.notes) {
      try {
        const parsed = typeof p.notes === 'string' ? JSON.parse(p.notes) : p.notes;
        if (parsed && parsed.is_visible === false) isVis = false;
        if (parsed && parsed.is_visible === true) isVis = true;
      } catch(e) {}
    } else {
      noNotesCount++;
    }

    if (p.note === 'hidden' || p.note === 'false') isVis = false;

    if (isVis) {
      visibleCount++;
      if (sampleVisible.length < 5) sampleVisible.push({ id: p.id, name: p.name, notes: p.notes, is_visible: p.is_visible });
    } else {
      hiddenCount++;
      if (sampleHidden.length < 5) sampleHidden.push({ id: p.id, name: p.name, notes: p.notes, is_visible: p.is_visible });
    }
  });

  console.log(`Visible Count: ${visibleCount}`);
  console.log(`Hidden Count: ${hiddenCount}`);
  console.log(`No Notes Count: ${noNotesCount}`);

  console.log('\nSample Visible Products:');
  console.table(sampleVisible);

  console.log('\nSample Hidden Products:');
  console.table(sampleHidden);
}

main().catch(console.error);
