const fs = require('fs');
const path = require('path');
const vm = require('vm');

const files = [
  'c:\\Users\\Amritpal Singh\\Downloads\\kmartnet\\kmartnet\\dist\\assets\\index-DYXXu0wA.js',
  'c:\\Users\\Amritpal Singh\\Downloads\\kmartnet\\kmartnet\\dist\\assets\\index-D0CI6L84.js'
];

function extractFunction(content, name) {
  const startIndex = content.indexOf(`function ${name}(`);
  if (startIndex === -1) {
    return null;
  }
  
  let braceCount = 0;
  let inString = false;
  let stringChar = '';
  let i = startIndex;
  
  while (i < content.length && content[i] !== '{') {
    i++;
  }
  
  if (i >= content.length) return null;
  
  braceCount = 1;
  i++;
  
  while (i < content.length && braceCount > 0) {
    const char = content[i];
    if (inString) {
      if (char === stringChar && content[i - 1] !== '\\') {
        inString = false;
      }
    } else if (char === "'" || char === '"' || char === '`') {
      inString = true;
      stringChar = char;
    } else if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
    }
    i++;
  }
  
  return content.substring(startIndex, i);
}

function extractYl(content) {
  const match = content.match(/yl=r=>\(\{id:r\.id,.*?\}\)/);
  return match ? `const ${match[0]}` : null;
}

// Global test variables
let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    console.log(`  ❌ FAIL: ${message}`);
  }
}

for (const file of files) {
  console.log(`\n==================================================`);
  console.log(`TEST RUN FOR: ${path.basename(file)}`);
  console.log(`==================================================`);
  
  if (!fs.existsSync(file)) {
    console.error(`File ${file} does not exist!`);
    continue;
  }
  
  const content = fs.readFileSync(file, 'utf8');
  
  const ylCode = extractYl(content);
  const getCleanCatCode = extractFunction(content, 'getCleanCat');
  const getProductThumbnailCode = extractFunction(content, 'getProductThumbnail');
  const rCode = extractFunction(content, '$r');
  
  if (!ylCode || !getCleanCatCode || !getProductThumbnailCode || !rCode) {
    console.error("Failed to extract one or more functions!");
    console.error(`ylCode: ${!!ylCode}, getCleanCat: ${!!getCleanCatCode}, getProductThumbnail: ${!!getProductThumbnailCode}, $r: ${!!rCode}`);
    continue;
  }
  
  // Construct the execution sandbox
  const sandbox = {
    S: {
      jsx: (type, props) => ({ $$typeof: Symbol.for('react.element'), type, props }),
      jsxs: (type, props) => ({ $$typeof: Symbol.for('react.element'), type, props, isJsxs: true }),
      Fragment: Symbol.for('react.fragment')
    },
    localStorage: {
      storage: {},
      getItem(key) {
        return this.storage[key] || null;
      },
      setItem(key, value) {
        this.storage[key] = String(value);
      }
    },
    console: console
  };
  
  const scriptCode = `
    ${ylCode};
    ${getCleanCatCode};
    ${rCode};
    ${getProductThumbnailCode};
    
    // Export functions to sandbox
    globalThis.yl = yl;
    globalThis.getCleanCat = getCleanCat;
    globalThis.$r = $r;
    globalThis.getProductThumbnail = getProductThumbnail;
  `;
  
  const context = vm.createContext(sandbox);
  try {
    vm.runInContext(scriptCode, context);
  } catch (err) {
    console.error("Compilation error in sandboxed script:", err);
    continue;
  }
  
  const { yl, getCleanCat, $r, getProductThumbnail } = sandbox;
  
  // --- TEST yl MAPPER ---
  console.log("\n--- Testing yl product mapper ---");
  
  const p1 = {
    id: 42,
    name: "Aashirvaad Atta",
    cat: "Staples",
    unit: "5 kg",
    mrp: 260,
    tp: 245,
    cp: 230,
    cs: "4 bags",
    customer_price: 240,
    tier2_min_qty: 10,
    tier2_price: 235,
    note: "High quality wheat flour",
    vision_product_id: "VIS-101",
    stock: 50,
    product_batches: [{ bchcode: "B1", stock: 50 }],
    brand: "Aashirvaad",
    image_url: "https://images.unsplash.com/photo-atta"
  };
  
  const mapped1 = yl(p1);
  assert(mapped1.id === 42, "yl maps id correctly");
  assert(mapped1.name === "Aashirvaad Atta", "yl maps name correctly");
  assert(mapped1.image_url === "https://images.unsplash.com/photo-atta", "yl maps image_url correctly when provided");
  
  const p2 = {
    id: 43,
    name: "Tata Salt",
    cat: "Staples",
    unit: "1 kg",
    mrp: 24,
    tp: 21,
    note: "Iodized salt",
    vision_product_id: "VIS-102"
  };
  
  const mapped2 = yl(p2);
  assert(mapped2.image_url === "", "yl maps image_url to default empty string when missing");
  assert(mapped2.brand === "", "yl maps brand to default empty string when missing");
  assert(mapped2.cp === 0, "yl maps cp to default 0 when missing");
  
  // --- TESTING getCleanCat ---
  console.log("\n--- Testing getCleanCat helper ---");
  assert(getCleanCat("🌾 Staples") === "Staples", "getCleanCat strips leading emoji from category");
  assert(getCleanCat("Biscuits") === "Biscuits", "getCleanCat returns category unchanged when no emoji is present");
  assert(getCleanCat("") === "", "getCleanCat handles empty category");
  assert(getCleanCat(null) === "", "getCleanCat handles null category");
  
  // --- TESTING $r emoji fallback ---
  console.log("\n--- Testing $r emoji fallback ---");
  assert($r("Staples") === "🌾", "$r returns wheat emoji for Staples");
  assert($r("Dairy") === "🧈", "$r returns butter emoji for Dairy");
  assert($r("Biscuits") === "🍪", "$r returns cookie emoji for Biscuits");
  assert($r("Beverages") === "🧃", "$r returns beverage box emoji for Beverages");
  assert($r("Snacks") === "🍿", "$r returns popcorn emoji for Snacks");
  assert($r("🌾 Staples") === "🌾", "$r extracts emoji from category name starting with emoji");
  assert($r("🍕 Pizza") === "🍕", "$r extracts pizza emoji from category name starting with emoji");
  
  // Test localstorage custom emoji fallback
  sandbox.localStorage.setItem("kmart_custom_category_emojis", JSON.stringify({ "Spices": "🌶️" }));
  assert($r("Spices") === "🌶️", "$r falls back to custom emoji from localStorage");
  
  // --- TESTING getProductThumbnail ---
  console.log("\n--- Testing getProductThumbnail fallback/rendering logic ---");
  
  // Category Staples without image_url
  const thumbStaples = getProductThumbnail({ cat: "Staples", name: "Aashirvaad Atta", image_url: null });
  assert(thumbStaples.type === 'img', "getProductThumbnail for Staples returns img element");
  assert(thumbStaples.props.src.startsWith("https://images.unsplash.com/photo-1586201375761-83865001e31c"), "Staples returns correct Unsplash photo");
  assert(thumbStaples.props.alt === "Aashirvaad Atta", "img element has correct alt attribute");
  
  // Category Biscuits without image_url
  const thumbBiscuits = getProductThumbnail({ cat: "Biscuits", name: "Parle-G", image_url: "" });
  assert(thumbBiscuits.type === 'img', "getProductThumbnail for Biscuits returns img element");
  assert(thumbBiscuits.props.src.startsWith("https://images.unsplash.com/photo-1558961363-fa8fdf82db35"), "Biscuits returns correct Unsplash photo");
  
  // Category Beverages with leading emoji
  const thumbBev = getProductThumbnail({ cat: "🧃 Beverages", name: "Frooti", image_url: "" });
  assert(thumbBev.type === 'img', "getProductThumbnail for '🧃 Beverages' returns img element");
  assert(thumbBev.props.src.startsWith("https://images.unsplash.com/photo-1527960656306-ce37c5512d6c"), "Beverages returns correct Unsplash photo even with leading emoji");
  
  // Category Snacks without image_url
  const thumbSnacks = getProductThumbnail({ cat: "Snacks", name: "Lays", image_url: "" });
  assert(thumbSnacks.type === 'img', "getProductThumbnail for Snacks returns img element");
  assert(thumbSnacks.props.src.startsWith("https://images.unsplash.com/photo-1599490659213-e2b9527bc087"), "Snacks returns correct Unsplash photo");
  
  // Category Dairy (non-matching) -> falls back to emoji
  const thumbDairy = getProductThumbnail({ cat: "Dairy", name: "Amul Butter", image_url: "" });
  assert(thumbDairy === "🧈", "Dairy category falls back to emoji string ('🧈')");
  
  // Category Spices (custom fallback) -> falls back to custom emoji
  const thumbSpices = getProductThumbnail({ cat: "Spices", name: "Haldi", image_url: "" });
  assert(thumbSpices === "🌶️", "Spices category falls back to custom emoji ('🌶️')");
  
  // Any category with explicit image_url
  const thumbCustomUrl = getProductThumbnail({ cat: "Dairy", name: "Amul Butter", image_url: "https://mycdn.com/butter.png" });
  assert(thumbCustomUrl.type === 'img', "Dairy with image_url returns img element");
  assert(thumbCustomUrl.props.src === "https://mycdn.com/butter.png", "img element has correct explicit src");
  
  // --- VERIFY DETAILS/SUMMARY STRUCTURE AND STYLING ---
  console.log("\n--- Verifying Details & Summary Structure and Styling ---");
  
  const detailsRegex = /details",\{style:(\{cursor:"pointer",fontSize:11,color:\w+\.accent,marginTop:4,marginBottom:6,background:\w+\.accentLight,padding:"6px 10px",borderRadius:8,border:\x601px solid \$\{\w+\.border\}\x60,transition:"all 0.2s"\})/;
  const summaryRegex = /summary",\{style:(\{fontWeight:700,outline:"none",listStyle:"none",display:"flex",alignItems:"center",justifyContent:"space-between",userSelect:"none"\})/;
  
  const detailsMatch = content.match(detailsRegex);
  const summaryMatch = content.match(summaryRegex);
  
  assert(!!detailsMatch, "details element exists and has correct styles (increased padding/margin: marginTop:4, marginBottom:6, padding:'6px 10px')");
  if (detailsMatch) {
    console.log(`  [Details Style]: ${detailsMatch[1]}`);
  }
  
  assert(!!summaryMatch, "summary element exists and has correct styles (flex row alignment, bold, listStyle: none, outline: none)");
  if (summaryMatch) {
    console.log(`  [Summary Style]: ${summaryMatch[1]}`);
  }
}

console.log(`\n==================================================`);
console.log(`SUMMARY: ${passedTests} / ${totalTests} ASSERTIONS PASSED`);
console.log(`==================================================`);

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
}
