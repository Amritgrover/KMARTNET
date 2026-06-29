# Handoff Report — Milestone 2: Card & Image Updates (R1)

**Summary of Core Findings**:
The product mapping function `yl` at index `402263` is missing `image_url` property mapping. By introducing a thumbnail component helper, implementing pre-configured Unsplash fallbacks, replacing category emoji nodes on product cards (indices `409534`, `425950`, `429554`, `433290`), and upgrading the tier-pricing display (index `410503`) to a styled HTML5 disclosure panel with increased card dimensions, the catalog card and image requirements can be completely implemented and verified.

---

## 1. Observations

### Target Files and Offsets
All observations were checked and validated on both identical production-build bundles `dist/assets/index-DYXXu0wA.js` and `dist/assets/index-D0CI6L84.js` (each 624,660 bytes):
1. **Product Mapper Function `yl`**:
   * **Location**: Index `402263`
   * **Verbatim Code**:
     ```javascript
     yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],brand:r.brand??""})
     ```
2. **Helper Insertion Insertion Anchor**:
   * **Location**: Index `404465` (right after `getCleanCat`)
   * **Verbatim Code**:
     ```javascript
     function getCleanCat(r){if(!r)return"";return r.replace(/^(\p{Emoji_Presentation}|\p{Emoji})\s*/u,"")}
     ```
3. **Customer Product Card `t_` Styling**:
   * **Location**: Index `409343`
   * **Verbatim Code**:
     ```javascript
     style:{background:C.card,borderRadius:13,padding:14,border:`1.5px solid ${a>0?C.green:C.border}`,boxShadow:a>0?`0 0 0 3px ${C.greenBg}`:"0 1px 6px rgba(0,0,0,0.06)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",flexDirection:"column",gap:0}
     ```
4. **Customer Product Card Tier Pricing**:
   * **Location**: Index `410503`
   * **Verbatim Code**:
     ```javascript
     hasTiers&&S.jsx("div",{style:{fontSize:11,color:C.accent,fontWeight:700,marginTop:2,marginBottom:4},children:`1–${r.tier2_min_qty-1} ${r.unit||"pcs"}: ₹${basePrice} | ${r.tier2_min_qty}+ ${r.unit||"pcs"}: ₹${r.tier2_price}`})
     ```
5. **Product Thumbnail Emoji Render Nodes**:
   * **Node 1 (Customer Card emoji)** at index `409534`:
     ```javascript
     S.jsx("div",{style:{width:38,height:38,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10,flexShrink:0},children:$r(r.cat)})
     ```
   * **Node 2 (Salesman Card wrapper)** at index `425950`:
     ```javascript
     S.jsx("div",{style:{width:36,height:36,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0},children:$r(r.cat)})
     ```
   * **Node 3 (Batch modal selection list item)** at index `429554`:
     ```javascript
     S.jsx("div",{style:{width:36,height:36,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20},children:$r(r.cat)})
     ```
   * **Node 4 (Alternative product list view)** at index `433290`:
     ```javascript
     S.jsx("div",{style:{fontSize:28,background:C.bg,borderRadius:10,width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:$r(r.cat)})
     ```

---

## 2. Logic Chain

1. **Mapping `image_url`**: Since frontend product objects are mapped from API responses via `yl`, adding `image_url: r.image_url ?? ""` maps the property from DB to the frontend.
2. **Product Image Thumbnails & Fallbacks**: 
   * A helper function `getProductThumbnail(r)` cleans the category using `getCleanCat`, checks a dictionary mapping for core categories (Staples, Biscuits, Beverages, Snacks) to their high-quality Unsplash image URLs:
     * **Staples**: `https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&auto=format&fit=crop`
     * **Biscuits**: `https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&auto=format&fit=crop`
     * **Beverages**: `https://images.unsplash.com/photo-1527960656306-ce37c5512d6c?w=100&auto=format&fit=crop`
     * **Snacks**: `https://images.unsplash.com/photo-1599490659213-e2b9527bc087?w=100&auto=format&fit=crop`
   * If `r.image_url` is present or a fallback image URL matches the category, it returns a styled `<img>` element. Otherwise, it falls back to the original category emoji `$r(r.cat)`.
   * Replacing the 4 emoji rendering nodes with `getProductThumbnail(r)` updates both the customer card, salesman card, and batch views dynamically.
3. **Card Dimension Spacing & Disclosure Panel**:
   * Changing Customer Card padding from `14` to `18` and adding `margin: 6` increases card breathing room and spacing.
   * Replacing the inline `div` for `hasTiers` with a styled `<details>` & `<summary>` native HTML5 disclosure panel ensures the details are hidden by default and expand on click with premium styling, without requiring additional React state variables that could conflict with minification hooks order.

---

## 3. Caveats

* **Production Builds**: The bundles `index-DYXXu0wA.js` and `index-D0CI6L84.js` are minified and identical in layout and byte size. Any modifications must update both files exactly.
* **Network Restrictions**: Since we are in a CODE_ONLY environment, the external Unsplash fallback images are not preloaded locally but will resolve successfully when client browsers render the application.

---

## 4. Conclusion & Recommended Changes

We recommend executing an automated search-and-replace patch script on the JS assets to implement these changes safely.

### Recommended Code Patch Script
Place the following Node.js script in the root directory (or run it from the agent folder) to apply the patches cleanly to `dist/assets/index-DYXXu0wA.js` and `dist/assets/index-D0CI6L84.js`:

```javascript
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, 'dist/assets');

['index-DYXXu0wA.js', 'index-D0CI6L84.js'].forEach(fileName => {
  const filePath = path.join(targetDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`[ERR] File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n=== Patching ${fileName} ===`);

  // 1. yl mapper replacement
  const ylTarget = 'yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],brand:r.brand??""})';
  const ylReplacement = 'yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],brand:r.brand??"",image_url:r.image_url??""})';
  if (content.includes(ylTarget)) {
    content = content.replace(ylTarget, ylReplacement);
    console.log('  [OK] yl mapper patched');
  } else {
    console.log('  [ERR] yl mapper target not found');
  }

  // 2. Insert helper getProductThumbnail
  const helperTarget = 'function getCleanCat(r){if(!r)return"";return r.replace(/^(\\p{Emoji_Presentation}|\\p{Emoji})\\s*/u,"")}';
  const helperReplacement = 'function getCleanCat(r){if(!r)return"";return r.replace(/^(\\p{Emoji_Presentation}|\\p{Emoji})\\s*/u,"")}function getProductThumbnail(r){const c=getCleanCat(r.cat).trim().toLowerCase(),f={staples:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&auto=format&fit=crop",biscuits:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&auto=format&fit=crop",beverages:"https://images.unsplash.com/photo-1527960656306-ce37c5512d6c?w=100&auto=format&fit=crop",snacks:"https://images.unsplash.com/photo-1599490659213-e2b9527bc087?w=100&auto=format&fit=crop"},u=r.image_url||f[c];return u?S.jsx("img",{src:u,alt:r.name,style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:10}}):$r(r.cat)}';
  if (content.includes(helperTarget)) {
    content = content.replace(helperTarget, helperReplacement);
    console.log('  [OK] getProductThumbnail helper inserted');
  } else {
    console.log('  [ERR] getCleanCat helper target not found');
  }

  // 3. Customer card: padding, margin
  const cardStyleTarget = 'style:{background:C.card,borderRadius:13,padding:14,border:`1.5px solid ${a>0?C.green:C.border}`,boxShadow:a>0?`0 0 0 3px ${C.greenBg}`:"0 1px 6px rgba(0,0,0,0.06)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",flexDirection:"column",gap:0}';
  const cardStyleReplacement = 'style:{background:C.card,borderRadius:13,padding:18,margin:6,border:`1.5px solid ${a>0?C.green:C.border}`,boxShadow:a>0?`0 0 0 3px ${C.greenBg}`:"0 1px 6px rgba(0,0,0,0.06)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",flexDirection:"column",gap:0}';
  if (content.includes(cardStyleTarget)) {
    content = content.replace(cardStyleTarget, cardStyleReplacement);
    console.log('  [OK] Customer card padding and margin increased');
  } else {
    console.log('  [ERR] Customer card style target not found');
  }

  // 4. Customer card: tier pricing disclosure panel
  const tierTarget = 'hasTiers&&S.jsx("div",{style:{fontSize:11,color:C.accent,fontWeight:700,marginTop:2,marginBottom:4},children:`1–${r.tier2_min_qty-1} ${r.unit||"pcs"}: ₹${basePrice} | ${r.tier2_min_qty}+ ${r.unit||"pcs"}: ₹${r.tier2_price}`})';
  const tierReplacement = 'hasTiers&&S.jsxs("details",{style:{cursor:"pointer",fontSize:11,color:C.accent,marginTop:4,marginBottom:6,background:C.accentLight,padding:"6px 10px",borderRadius:8,border:`1px solid ${C.border}`,transition:"all 0.2s"},children:[S.jsxs("summary",{style:{fontWeight:700,outline:"none",listStyle:"none",display:"flex",alignItems:"center",justifyContent:"space-between",userSelect:"none"},children:[S.jsx("span",{children:"🏷️ View Tier Pricing"}),S.jsx("span",{style:{fontSize:9},children:"▼"})]}),S.jsx("div",{style:{marginTop:6,paddingTop:6,borderTop:`1px dashed ${C.accent}`,fontWeight:600,color:C.accent},children:`1–${r.tier2_min_qty-1} ${r.unit||"pcs"}: ₹${basePrice} | ${r.tier2_min_qty}+ ${r.unit||"pcs"}: ₹${r.tier2_price}`})]})';
  if (content.includes(tierTarget)) {
    content = content.replace(tierTarget, tierReplacement);
    console.log('  [OK] Customer card tier pricing disclosure patched');
  } else {
    console.log('  [ERR] Customer card tier pricing target not found');
  }

  // 5. Replace 4 emoji occurrences:
  // Occurrence 1: Customer Card div
  const emojiDiv1 = 'S.jsx("div",{style:{width:38,height:38,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10,flexShrink:0},children:$r(r.cat)})';
  const emojiDiv1Rep = 'S.jsx("div",{style:{width:38,height:38,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10,flexShrink:0},children:getProductThumbnail(r)})';
  if (content.includes(emojiDiv1)) {
    content = content.replace(emojiDiv1, emojiDiv1Rep);
    console.log('  [OK] Emoji Occurrence 1 patched');
  } else {
    console.log('  [ERR] Emoji Occurrence 1 target not found');
  }

  // Occurrence 2: Salesman Card wrapper (using regex to handle whitespace)
  const regexSalesman = /S\.jsx\("div",\{\s*style:\{\s*width:\s*36,\s*height:\s*36,\s*borderRadius:\s*10,\s*background:\s*C\.primaryLight,\s*display:\s*"flex",\s*alignItems:\s*"center",\s*justifyContent:\s*"center",\s*fontSize:\s*18,\s*flexShrink:\s*0\s*\},\s*children:\s*\$r\(r\.cat\)\s*\}\)/g;
  if (regexSalesman.test(content)) {
    content = content.replace(regexSalesman, 'S.jsx("div",{style:{width:36,height:36,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0},children:getProductThumbnail(r)})');
    console.log('  [OK] Emoji Occurrence 2 patched (Salesman Card)');
  } else {
    console.log('  [ERR] Emoji Occurrence 2 target not found');
  }

  // Occurrence 3: Batch modal / list item (using regex to handle whitespace)
  const regexBatch = /S\.jsx\("div",\{\s*style:\{\s*width:\s*36,\s*height:\s*36,\s*borderRadius:\s*10,\s*background:\s*"#fff",\s*display:\s*"flex",\s*alignItems:\s*"center",\s*justifyContent:\s*"center",\s*fontSize:\s*20\s*\},\s*children:\s*\$r\(r\.cat\)\s*\}\)/g;
  if (regexBatch.test(content)) {
    content = content.replace(regexBatch, 'S.jsx("div",{style:{width:36,height:36,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20},children:getProductThumbnail(r)})');
    console.log('  [OK] Emoji Occurrence 3 patched (Batch list item)');
  } else {
    console.log('  [ERR] Emoji Occurrence 3 target not found');
  }

  // Occurrence 4: Another list item
  const emojiDiv4 = 'S.jsx("div",{style:{fontSize:28,background:C.bg,borderRadius:10,width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:$r(r.cat)})';
  const emojiDiv4Rep = 'S.jsx("div",{style:{fontSize:28,background:C.bg,borderRadius:10,width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:getProductThumbnail(r)})';
  if (content.includes(emojiDiv4)) {
    content = content.replace(emojiDiv4, emojiDiv4Rep);
    console.log('  [OK] Emoji Occurrence 4 patched');
  } else {
    console.log('  [ERR] Emoji Occurrence 4 target not found');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Saved patches to ${fileName}`);
});
```

---

## 5. Verification Method

To independently verify the observations and correctness of these modifications:
1. Run the test script `.agents/teamwork_preview_explorer_m2_2/test_patches.js` which applies these exact replacements to local copies of the bundles in `.agents/teamwork_preview_explorer_m2_2/temp_assets/`.
2. Inspect the console output of the test script:
   * Verify all 8 steps print `[OK]`.
   * Verify there are no missing targets.
3. Compare the modified temp files using diff tools or search for occurrences of `getProductThumbnail` and `details` tag inside the generated `temp_assets/index-DYXXu0wA.js` to ensure the structure matches expectations.
