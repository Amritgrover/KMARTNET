const { createClient } = require('@supabase/supabase-js');
const webpush = require('web-push');

// 1. Configure Supabase Credentials
// Replace with your actual project URL and Service Role Key (service role key is required to bypass RLS policies for updates)
const SUPABASE_URL = 'https://kmfekxzkbgneqwhukgbh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgxNTc1OCwiZXhwIjoyMDk2MzkxNzU4fQ.AqoLdTgNGrsC1eCmKriAV1K8cPeRny4ORaT26V4Gexc';

if (SUPABASE_KEY === 'YOUR_SUPABASE_SERVICE_ROLE_KEY') {
  console.warn('WARNING: Please replace "YOUR_SUPABASE_SERVICE_ROLE_KEY" with your actual Supabase Service Role Key to enable notification processing.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Configure VAPID Credentials
const publicVapidKey = 'BF_1iPLa7YMuLTyHTd7aRyw1L-vu4Q-TdHHDY-f4_q2Kx4xgtMn7LfRO8QUGIJgxqj583NsZI440xS63BtYnnzs';
const privateVapidKey = 'LJUkiCGSKDVemrlqDFdAaXMRLJFG0dC2ZTH0v--ZdJU';

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  publicVapidKey,
  privateVapidKey
);

console.log('============================================================');
console.log('🚀 PWA Web Push Notification Realtime Worker Started...');
console.log('Listening for new insertions in the pwa_notifications table...');
console.log('============================================================');

// 3. Setup Realtime Listener
const channel = supabase
  .channel('pwa_notifications_queue')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'pwa_notifications',
      filter: 'status=eq.pending'
    },
    async (payload) => {
      const { id, user_role, user_id, title, body, url, image_url } = payload.new;
      console.log(`\n[NEW] Notification #${id} received for ${user_role} (ID: ${user_id}): "${title}" -> "${body}"${image_url ? ' [IMG: ' + image_url + ']' : ''}`);

      // Fetch the subscription
      const { data, error } = await supabase
        .from('pwa_push_subscriptions')
        .select('subscription')
        .eq('user_role', user_role)
        .eq('user_id', user_id)
        .maybeSingle();

      if (error) {
        console.error(`[-] DB error fetching subscription:`, error);
        await updateStatus(id, 'failed', `Database error: ${error.message}`);
        return;
      }

      if (!data || !data.subscription) {
        console.warn(`[-] No active subscription found for ${user_role} (ID: ${user_id})`);
        await updateStatus(id, 'failed', 'No active subscription registered for this user.');
        return;
      }

      // Send push notification
      const pushData = {
        title: title,
        body: body,
        url: url || '/'
      };
      if (image_url) {
        pushData.image = image_url;
      }
      const pushPayload = JSON.stringify(pushData);

      try {
        const result = await webpush.sendNotification(data.subscription, pushPayload);
        console.log(`[+] Notification #${id} sent successfully. Push service response: ${result.statusCode}`);
        await updateStatus(id, 'sent');
      } catch (pushErr) {
        console.error(`[-] Push service failed for Notification #${id}:`, pushErr);
        await updateStatus(id, 'failed', pushErr.message || String(pushErr));
      }
    }
  )
  .subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('Subscription channel active. Realtime engine connected.');
    }
  });

// Helper function to update status
async function updateStatus(id, status, errorMessage = null) {
  const updates = { status };
  if (errorMessage) {
    updates.error_message = errorMessage;
  }
  const { error } = await supabase
    .from('pwa_notifications')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error(`[-] Failed to update status for Notification #${id}:`, error);
  }
}
