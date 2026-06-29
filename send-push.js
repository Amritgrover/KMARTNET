const { createClient } = require('@supabase/supabase-js');
const webpush = require('web-push');

// 1. Set your Supabase URL & Service Role Key (or API key)
const SUPABASE_URL = 'https://kmfekxzkbgneqwhukgbh.supabase.co';
const SUPABASE_KEY = 'YOUR_SUPABASE_SERVICE_ROLE_OR_ANON_KEY'; // Replace this with your key

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Configure VAPID Keys
const publicVapidKey = 'BF_1iPLa7YMuLTyHTd7aRyw1L-vu4Q-TdHHDY-f4_q2Kx4xgtMn7LfRO8QUGIJgxqj583NsZI440xS63BtYnnzs';
const privateVapidKey = 'LJUkiCGSKDVemrlqDFdAaXMRLJFG0dC2ZTH0v--ZdJU';

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  publicVapidKey,
  privateVapidKey
);

// 3. Define function to send push
async function sendPushNotification(userRole, userId, title, body, url = '/') {
  console.log(`Fetching subscription for ${userRole} (ID: ${userId})...`);
  
  const { data, error } = await supabase
    .from('pwa_push_subscriptions')
    .select('subscription')
    .eq('user_role', userRole)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Database error:', error);
    return;
  }

  if (!data || !data.subscription) {
    console.error(`No active push subscription found for ${userRole} (ID: ${userId}).`);
    return;
  }

  const payload = JSON.stringify({
    title: title,
    body: body,
    url: url
  });

  console.log('Sending push notification...');
  try {
    const result = await webpush.sendNotification(data.subscription, payload);
    console.log('SUCCESS! Notification sent. Status code:', result.statusCode);
  } catch (err) {
    console.error('Failed to send push notification:', err);
  }
}

// Example Usage (uncomment below to run locally):
// const testRole = 'delivery_person'; // or 'salesman'
// const testUserId = 1; // Replace with an actual user ID
// sendPushNotification(testRole, testUserId, 'New Trip Assigned!', 'You have 5 stops to deliver today.', '/delivery');

module.exports = { sendPushNotification };
