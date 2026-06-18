const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MTU3NTgsImV4cCI6MjA5NjM5MTc1OH0.MwuoEcgzKq8I9KIHh1GswHPcwE87o4gEtUpuJE7_Tio";

async function getSchema() {
  const res = await fetch(`https://kmfekxzkbgneqwhukgbh.supabase.co/rest/v1/`, {
    headers: { "apikey": apiKey, "Authorization": `Bearer ${apiKey}` }
  });
  const openapi = await res.json();
  
  console.log("=== ORDERS DEFINITION ===");
  if (openapi.definitions && openapi.definitions.orders) {
    console.log(Object.keys(openapi.definitions.orders.properties));
  } else {
    console.log("No orders definition.");
  }

  console.log("=== ORDER_ITEMS DEFINITION ===");
  if (openapi.definitions && openapi.definitions.order_items) {
    console.log(Object.keys(openapi.definitions.order_items.properties));
  } else {
    console.log("No order_items definition.");
  }
}

getSchema();
