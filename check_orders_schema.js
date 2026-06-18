const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MTU3NTgsImV4cCI6MjA5NjM5MTc1OH0.MwuoEcgzKq8I9KIHh1GswHPcwE87o4gEtUpuJE7_Tio";

async function checkOrdersSchema() {
  // 1. Get orders schema
  const ordRes = await fetch(`https://kmfekxzkbgneqwhukgbh.supabase.co/rest/v1/orders?select=*&limit=1`, {
    headers: { "apikey": apiKey, "Authorization": `Bearer ${apiKey}` }
  });
  const ords = await ordRes.json();
  console.log("=== ORDER COLUMNS ===");
  if (ords.length > 0) {
    console.log(Object.keys(ords[0]));
    console.log("Sample order:", ords[0]);
  } else {
    console.log("No orders found.");
  }

  // 2. Get order_items schema
  const itemRes = await fetch(`https://kmfekxzkbgneqwhukgbh.supabase.co/rest/v1/order_items?select=*&limit=1`, {
    headers: { "apikey": apiKey, "Authorization": `Bearer ${apiKey}` }
  });
  const items = await itemRes.json();
  console.log("=== ORDER_ITEM COLUMNS ===");
  if (items.length > 0) {
    console.log(Object.keys(items[0]));
    console.log("Sample item:", items[0]);
  } else {
    console.log("No order items found.");
  }
}

checkOrdersSchema();
