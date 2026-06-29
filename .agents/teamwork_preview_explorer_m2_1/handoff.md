# Handoff Report — Milestone 2: Card & Image Updates (R1)

## 1. Observation

All analysis and verification was performed on the client bundles located in `dist/assets/`.

### 1.1 Product Mapper `yl`
* **File Paths**: `dist/assets/index-DYXXu0wA.js` and `dist/assets/index-D0CI6L84.js` (identical SHA-256 hash).
* **Location**: Index offset ~403723.
* **Verbatim Code**:
  ```javascript
  yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],brand:r.brand??""})
  ```
  *(Observation: `image_url` property from DB is not currently mapped).*

### 1.2 Customer Product Card `t_`
* **Location**: Function `t_` begins at index offset `408615` and spans to `415299`.
* **Card Padding**: Inside `t_` return, the wrapper container style is:
  ```javascript
  style:{background:C.card,borderRadius:13,padding:14,border:`1.5px solid ${a>0?C.green:C.border}`,boxShadow:a>0?`0 0 0 3px ${C.greenBg}`:"0 1px 6px rgba(0,0,0,0.06)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",flexDirection:"column",gap:0}
  ```
* **Category Emoji Rendering**:
  ```javascript
  S.jsx("div",{style:{width:38,height:38,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10,flexShrink:0},children:$r(r.cat)})
  ```
* **Tier Pricing Rendering**:
  ```javascript
  hasTiers&&S.jsx("div",{style:{fontSize:11,color:C.accent,fontWeight:700,marginTop:2,marginBottom:4},children:`1–${r.tier2_min_qty-1} ${r.unit||"pcs"}: ₹${basePrice} | ${r.tier2_min_qty}+ ${r.unit||"pcs"}: ₹${r.tier2_price}`})
  ```

### 1.3 Salesman Product Card `n_` & Components
* **Salesman Card Emoji Rendering (Index ~425950)**:
  ```javascript
  S.jsx("div",{\n                style:{width:36,height:36,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0},\n                children:$r(r.cat)\n              })
  ```
* **Batch Modal Header Emoji Rendering (Index ~429554)**:
  ```javascript
  S.jsx("div",{\n                        style:{width:36,height:36,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20},\n                        children:$r(r.cat)\n                      })
  ```
* **Product Detail View Header Emoji Rendering (Index ~433290)**:
  ```javascript
  S.jsx("div",{style:{fontSize:28,background:C.bg,borderRadius:10,width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:$r(r.cat)})
  ```

---

## 2. Logic Chain

1. **Mapping `image_url`**: Adding `image_url: r.image_url ?? ""` to the mapper function `yl` (Observation 1.1) makes the `image_url` property available in all product objects rendered throughout the client app.
2. **Displaying Product Image/Fallback**:
   * We define a mapping of standard fallback stock/Unsplash image URLs for the core categories:
     * **Staples**: `https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=120&q=80`
     * **Biscuits**: `https://images.unsplash.com/photo-1558961317-5f241202db89?auto=format&fit=crop&w=120&q=80`
     * **Beverages**: `https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=120&q=80`
     * **Snacks**: `https://images.unsplash.com/photo-1599490659223-9372241688b6?auto=format&fit=crop&w=120&q=80`
   * In each product card, we extract the clean category using the existing helper function: `const cleanCat = getCleanCat(r.cat).trim();`.
   * We check if the product has a real `image_url` (from DB) or a fallback image URL. If so, we render a custom `<img>` element styled to match the dimensions of the card icon. If neither is available, we fall back to the category emoji (Observation 1.2, 1.3).
3. **Tier Pricing Disclosure**: Wrapping the original tier pricing line in an HTML `<details>` and `<summary>` element hides it behind a premium disclosure panel (with chevron indicator `▼`) without risking state conflicts.
4. **Hiding browser-native disclosure arrows**: Appending standard CSS properties to `dist/assets/index-BiACt3m9.css` removes native browser details markers.
5. **Increasing card padding and margins**: Modifying the card wrapper style inside `t_` (Observation 1.2) to use `padding: 18` and `margin: 6` increases card spacing.

---

## 3. Caveats

* **Service Worker Cache**: Bumping the Service Worker cache revisions is scheduled for Milestone 6. However, for changes to take effect immediately in clients, `dist/sw.js` must update the revision string of `assets/index-DYXXu0wA.js` from `"salesman_batches_v19"` to `"card_updates_v1"` (or similar) and `assets/index-BiACt3m9.css` from `"responsive_v3"` to `"card_updates_v1"`.

---

## 4. Conclusion & Recommended Changes

Apply the following replacements to `dist/assets/index-DYXXu0wA.js` and `dist/assets/index-D0CI6L84.js`:

### Change 1: Product Mapper `yl`
* **Search**:
  ```javascript
  yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],brand:r.brand??""})
  ```
* **Replace**:
  ```javascript
  yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],brand:r.brand??"",image_url:r.image_url??""})
  ```

### Change 2: Customer Card Padding & Margin inside `t_`
* **Search**:
  ```javascript
  style:{background:C.card,borderRadius:13,padding:14,border:`1.5px solid ${a>0?C.green:C.border}`,boxShadow:a>0?`0 0 0 3px ${C.greenBg}`:"0 1px 6px rgba(0,0,0,0.06)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",flexDirection:"column",gap:0}
  ```
* **Replace**:
  ```javascript
  style:{background:C.card,borderRadius:13,padding:18,margin:6,border:`1.5px solid ${a>0?C.green:C.border}`,boxShadow:a>0?`0 0 0 3px ${C.greenBg}`:"0 1px 6px rgba(0,0,0,0.06)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",flexDirection:"column",gap:0}
  ```

### Change 3: Image / Fallback Emoji inside Customer Card `t_`
* **Search**:
  ```javascript
  S.jsx("div",{style:{width:38,height:38,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10,flexShrink:0},children:$r(r.cat)})
  ```
* **Replace**:
  ```javascript
  (()=> {
    const fallbackImgs = {
      Staples: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=120&q=80",
      Biscuits: "https://images.unsplash.com/photo-1558961317-5f241202db89?auto=format&fit=crop&w=120&q=80",
      Beverages: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=120&q=80",
      Snacks: "https://images.unsplash.com/photo-1599490659223-9372241688b6?auto=format&fit=crop&w=120&q=80"
    };
    const cleanCat = getCleanCat(r.cat).trim();
    const productImg = r.image_url || fallbackImgs[cleanCat];
    return productImg ? S.jsx("img", { src: productImg, alt: r.name, style: { width: 38, height: 38, borderRadius: 10, objectFit: "cover", marginBottom: 10, flexShrink: 0 } }) : S.jsx("div", { style: { width: 38, height: 38, borderRadius: 10, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10, flexShrink: 0 }, children: $r(r.cat) })
  })()
  ```

### Change 4: Disclosure Panel inside Customer Card `t_`
* **Search**:
  ```javascript
  hasTiers&&S.jsx("div",{style:{fontSize:11,color:C.accent,fontWeight:700,marginTop:2,marginBottom:4},children:`1–${r.tier2_min_qty-1} ${r.unit||"pcs"}: ₹${basePrice} | ${r.tier2_min_qty}+ ${r.unit||"pcs"}: ₹${r.tier2_price}`})
  ```
* **Replace**:
  ```javascript
  hasTiers&&S.jsxs("details",{style:{marginTop:2,marginBottom:4,cursor:"pointer"},children:[S.jsxs("summary",{style:{fontSize:11,color:C.accent,fontWeight:700,display:"flex",alignItems:"center",gap:4,outline:"none",userSelect:"none"},children:[S.jsx("span",{children:"🏷️ View Tier Pricing"}),S.jsx("span",{style:{fontSize:8},children:"▼"})]}),S.jsx("div",{style:{fontSize:11,color:C.accent,fontWeight:700,marginTop:4,padding:"6px 10px",background:C.accentLight,borderRadius:6},children:`1–${r.tier2_min_qty-1} ${r.unit||"pcs"}: ₹${basePrice} | ${r.tier2_min_qty}+ ${r.unit||"pcs"}: ₹${r.tier2_price}`})]})
  ```

### Change 5: Image / Fallback Emoji inside Salesman Card `n_`
* **Search**:
  ```javascript
  S.jsx("div",{\n                style:{width:36,height:36,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0},\n                children:$r(r.cat)\n              })
  ```
* **Replace**:
  ```javascript
  (()=> {
    const fallbackImgs = {
      Staples: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=120&q=80",
      Biscuits: "https://images.unsplash.com/photo-1558961317-5f241202db89?auto=format&fit=crop&w=120&q=80",
      Beverages: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=120&q=80",
      Snacks: "https://images.unsplash.com/photo-1599490659223-9372241688b6?auto=format&fit=crop&w=120&q=80"
    };
    const cleanCat = getCleanCat(r.cat).trim();
    const productImg = r.image_url || fallbackImgs[cleanCat];
    return productImg ? S.jsx("img", { src: productImg, alt: r.name, style: { width: 36, height: 36, borderRadius: 10, objectFit: "cover", flexShrink: 0 } }) : S.jsx("div", { style: { width: 36, height: 36, borderRadius: 10, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }, children: $r(r.cat) })
  })()
  ```

### Change 6: Image / Fallback Emoji inside Salesman Card Batch Modal Header
* **Search**:
  ```javascript
  S.jsx("div",{\n                        style:{width:36,height:36,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20},\n                        children:$r(r.cat)\n                      })
  ```
* **Replace**:
  ```javascript
  (()=> {
    const fallbackImgs = {
      Staples: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=120&q=80",
      Biscuits: "https://images.unsplash.com/photo-1558961317-5f241202db89?auto=format&fit=crop&w=120&q=80",
      Beverages: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=120&q=80",
      Snacks: "https://images.unsplash.com/photo-1599490659223-9372241688b6?auto=format&fit=crop&w=120&q=80"
    };
    const cleanCat = getCleanCat(r.cat).trim();
    const productImg = r.image_url || fallbackImgs[cleanCat];
    return productImg ? S.jsx("img", { src: productImg, alt: r.name, style: { width: 36, height: 36, borderRadius: 10, objectFit: "cover" } }) : S.jsx("div", { style: { width: 36, height: 36, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }, children: $r(r.cat) })
  })()
  ```

### Change 7: Image / Fallback Emoji inside Product Detail view Header
* **Search**:
  ```javascript
  S.jsx("div",{style:{fontSize:28,background:C.bg,borderRadius:10,width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:$r(r.cat)})
  ```
* **Replace**:
  ```javascript
  (()=> {
    const fallbackImgs = {
      Staples: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=120&q=80",
      Biscuits: "https://images.unsplash.com/photo-1558961317-5f241202db89?auto=format&fit=crop&w=120&q=80",
      Beverages: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=120&q=80",
      Snacks: "https://images.unsplash.com/photo-1599490659223-9372241688b6?auto=format&fit=crop&w=120&q=80"
    };
    const cleanCat = getCleanCat(r.cat).trim();
    const productImg = r.image_url || fallbackImgs[cleanCat];
    return productImg ? S.jsx("img", { src: productImg, alt: r.name, style: { width: 48, height: 48, borderRadius: 10, objectFit: "cover", flexShrink: 0 } }) : S.jsx("div", { style: { fontSize: 28, background: C.bg, borderRadius: 10, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: $r(r.cat) })
  })()
  ```

### Change 8: Append custom CSS styling to `dist/assets/index-BiACt3m9.css`
Append the following CSS rule to clean up the details/summary styling:
```css
/* Custom details/summary style for Tier Pricing Disclosure */
details summary::-webkit-details-marker {
  display: none !important;
}
details summary {
  list-style: none !important;
}
details summary:focus {
  outline: none;
}
```

---

## 5. Verification Method

To verify these findings and apply changes programmatically:
1. Run the test patch verification script:
   `node scratch/test_patch_apply.js`
   *(This script loads the original asset, applies the replacements in memory, and asserts that they were applied uniquely and successfully without conflicts).*
2. Execute the automation change script to apply the changes to the assets:
   `node .agents/teamwork_preview_explorer_m2_1/apply_m2_changes.js`
