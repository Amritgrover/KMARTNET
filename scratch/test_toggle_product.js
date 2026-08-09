const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kmfekxzkbgneqwhukgbh.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgxNTc1OCwiZXhwIjoyMDk2MzkxNzU4fQ.AqoLdTgNGrsC1eCmKriAV1K8cPeRny4ORaT26V4Gexc';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const checkVis = (p) => {
  if (!p) return false;
  if (p.is_visible === true) return true;
  if (p.is_visible === false) return false;
  let notesObj = null;
  if (p.notes) {
    if (typeof p.notes === 'string') {
      try { notesObj = JSON.parse(p.notes); } catch(e) {}
    } else if (typeof p.notes === 'object') {
      notesObj = p.notes;
    }
  }
  if (notesObj) {
    if (notesObj.is_visible === true || notesObj.is_visible === 'true' || notesObj.is_visible === 1) return true;
    if (notesObj.is_visible === false || notesObj.is_visible === 'false' || notesObj.is_visible === 0) return false;
  }
  if (p.note === 'visible' || p.note === 'true' || p.note === '1') return true;
  return false;
};

async function testToggle() {
  const { data: products } = await supabase.from('products').select('id, name, notes').limit(1);
  const sample = products[0];
  console.log('Sample product before toggle:', sample.name, 'checkVis:', checkVis(sample));

  // Toggle to true
  let notesObj = typeof sample.notes === 'string' ? JSON.parse(sample.notes) : sample.notes;
  notesObj.is_visible = true;
  await supabase.from('products').update({ notes: JSON.stringify(notesObj) }).eq('id', sample.id);

  const { data: afterTrue } = await supabase.from('products').select('id, name, notes').eq('id', sample.id).single();
  console.log('Sample product after toggle TRUE:', afterTrue.name, 'checkVis:', checkVis(afterTrue));

  // Toggle back to false
  notesObj.is_visible = false;
  await supabase.from('products').update({ notes: JSON.stringify(notesObj) }).eq('id', sample.id);

  const { data: afterFalse } = await supabase.from('products').select('id, name, notes').eq('id', sample.id).single();
  console.log('Sample product after toggle FALSE:', afterFalse.name, 'checkVis:', checkVis(afterFalse));
}

testToggle().catch(console.error);
