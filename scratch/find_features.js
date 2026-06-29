const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

const targets = {
  "Product Images (R1)": [
    "image_url",
    "images.unsplash.com",
    "fallback",
    "emoji"
  ],
  "Simplified Info Density (R1)": [
    "disclosure",
    "details",
    "summary",
    "tier",
    "showTiers"
  ],
  "Bottom Navigation (R2)": [
    "bottom-nav",
    "Home/Catalogue",
    "Catalogue",
    "Orders",
    "Profile",
    "viewport",
    "768"
  ],
  "Category Scroll Indicator (R2)": [
    "scroll",
    "gradient",
    "pill",
    "overflow",
    "count"
  ],
  "Skeleton Loading (R3)": [
    "skeleton",
    "shimmer",
    "loading",
    "animate-pulse"
  ],
  "Success Micro-interactions (R3)": [
    "fly-to-cart",
    "checkmark",
    "added",
    "animation"
  ],
  "Cart Badge (R4)": [
    "badge",
    "red",
    "count"
  ],
  "FAB (R4)": [
    "FAB",
    "floating",
    "pulse",
    "cart"
  ],
  "PIN Pad Animations (R4)": [
    "shake",
    "keypad",
    "pin",
    "dots"
  ],
  "Search Autocomplete (R6)": [
    "autocomplete",
    "recent",
    "clear",
    "✕"
  ],
  "Connectivity & Offline (R6)": [
    "offline",
    "online",
    "cached",
    "dot"
  ],
  "Admin Insights (R7)": [
    "pie",
    "bar",
    "stock",
    "chart",
    "sparkline",
    "low stock"
  ]
};

for (const [feature, terms] of Object.entries(targets)) {
  console.log(`\n=== Feature: ${feature} ===`);
  for (const term of terms) {
    let count = 0;
    let idx = -1;
    const indices = [];
    while (true) {
      idx = code.indexOf(term, idx + 1);
      if (idx === -1) break;
      count++;
      if (indices.length < 3) {
        indices.push(idx);
      }
    }
    console.log(`  Term "${term}": ${count} matches. First few indices: ${indices.join(', ')}`);
    if (indices.length > 0) {
      const first = indices[0];
      const start = Math.max(0, first - 60);
      const end = Math.min(code.length, first + term.length + 60);
      console.log(`    Snippet: ... ${code.slice(start, end).replace(/\n/g, ' ')} ...`);
    }
  }
}
