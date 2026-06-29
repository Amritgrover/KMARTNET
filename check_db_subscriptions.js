const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kmfekxzkbgneqwhukgbh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgxNTc1OCwiZXhwIjoyMDk2MzkxNzU4fQ.AqoLdTgNGrsC1eCmKriAV1K8cPeRny4ORaT26V4Gexc'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  console.log('Querying pwa_push_subscriptions table...');
  const { data, error } = await supabase
    .from('pwa_push_subscriptions')
    .select('*');

  if (error) {
    console.error('Error fetching subscriptions:', error);
  } else {
    console.log(`Found ${data.length} subscription(s):`);
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
