const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MTU3NTgsImV4cCI6MjA5NjM5MTc1OH0.MwuoEcgzKq8I9KIHh1GswHPcwE87o4gEtUpuJE7_Tio";

async function checkSchema() {
  // 1. Get one product
  const prodRes = await fetch(`https://kmfekxzkbgneqwhukgbh.supabase.co/rest/v1/products?select=*&limit=1`, {
    headers: { "apikey": apiKey, "Authorization": `Bearer ${apiKey}` }
  });
  const prods = await prodRes.json();
  console.log("=== PRODUCT COLUMNS ===");
  if (prods.length > 0) {
    console.log(Object.keys(prods[0]));
    console.log("Sample product:", prods[0]);
  } else {
    console.log("No products found.");
  }

  // 2. Get one customer
  const custRes = await fetch(`https://kmfekxzkbgneqwhukgbh.supabase.co/rest/v1/customers?select=*&limit=1`, {
    headers: { "apikey": apiKey, "Authorization": `Bearer ${apiKey}` }
  });
  const custs = await custRes.json();
  console.log("=== CUSTOMER COLUMNS ===");
  if (custs.length > 0) {
    console.log(Object.keys(custs[0]));
    console.log("Sample customer:", custs[0]);
  } else {
    console.log("No customers found.");
  }

  // 3. Get one order_item
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

checkSchema();
