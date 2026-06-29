# Handoff Report — Card & Image Updates (Milestone 2)

## 1. Observation

Direct observations and findings in the assets:

### A. Product DB Mapper `yl`
* **File Paths**: `dist/assets/index-DYXXu0wA.js` (and duplicate `dist/assets/index-D0CI6L84.js`)
* **Location**: Line 52, index ~402263
* **Verbatim Code**:
  ```javascript
  yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],brand:r.brand??""})
  ```
* **Analysis**: The `image_url` property from DB is currently not mapped.

### B. Customer Product Card `t_`
* **File Paths**: `dist/assets/index-DYXXu0wA.js` (and duplicate `dist/assets/index-D0CI6L84.js`)
* **Location**: Line 52, index ~408615
* **Verbatim Code (Emoji Container)**:
  ```javascript
  S.jsx("div",{style:{width:38,height:38,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10,flexShrink:0},children:$r(r.cat)})
  ```
* **Verbatim Code (Tier Pricing Display)**:
  ```javascript
  hasTiers&&S.jsx("div",{style:{fontSize:11,color:C.accent,fontWeight:700,marginTop:2,marginBottom:4},children:`1–${r.tier2_min_qty-1} ${r.unit||"pcs"}: ₹${basePrice} | ${r.tier2_min_qty}+ ${r.unit||"pcs"}: ₹${r.tier2_price}`})
  ```
* **Verbatim Code (Card Padding)**:
  ```javascript
  style:{background:C.card,borderRadius:13,padding:14,border:`1.5px solid ${a>0?C.green:C.border}`,boxShadow:a>0?`0 0 0 3px ${C.greenBg}`:"0 1px 6px rgba(0,0,0,0.06)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",flexDirection:"column",gap:0}
  ```

### C. Salesman Product Card `n_`
* **File Paths**: `dist/assets/index-DYXXu0wA.js` (and duplicate `dist/assets/index-D0CI6L84.js`)
* **Location**: Line 52, index ~424340
* **Verbatim Code (Main Card Emoji Container)**:
  ```javascript
  S.jsx("div",{style:{width:36,height:36,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0},children:$r(r.cat)})
  ```
* **Verbatim Code (Expanded Modal Emoji Container, index ~429554)**:
  ```javascript
  S.jsx("div",{style:{width:36,height:36,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20},children:$r(r.cat)})
  ```

### D. Admin Product Card `a_`
* **File Paths**: `dist/assets/index-DYXXu0wA.js` (and duplicate `dist/assets/index-D0CI6L84.js`)
* **Location**: Line 52, index ~432381
* **Verbatim Code (Emoji Container, index ~433290)**:
  ```javascript
  S.jsx("div",{style:{fontSize:28,background:C.bg,borderRadius:10,width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:$r(r.cat)})
  ```

### E. Catalog Card Container
* **File Paths**: `dist/assets/index-DYXXu0wA.js` (and duplicate `dist/assets/index-D0CI6L84.js`)
* **Location**: Line 52, index ~486500
* **Verbatim Code (Grid Container Style)**:
  ```javascript
  style:r==="customer"?{gap:12}:{display:"flex",flexDirection:"column",gap:12,width:"100%"},
  ```

### F. Global Stylesheet
* **File Path**: `dist/assets/index-BiACt3m9.css`
* **Verbatim Code (Tailwind + Mobile additions)**:
  ```css
  /* Custom Mobile Responsiveness Additions */
  .product-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
  }
  ```

---

## 2. Logic Chain

1. **Mapping `image_url`**: Adding `image_url:r.image_url??""` to the `yl` mapper definition ensures the product objects mapped from DB responses contain the `image_url` property for use in React components (Observation A).
2. **Displaying Product Image & Fallbacks**:
   - Define a fallback map for core categories: Staples, Biscuits, Beverages, Snacks:
     ```javascript
     const fallbacks = {
       Staples: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=120&q=80",
       Biscuits: "https://images.unsplash.com/photo-1558961312-50a49c93b3af?auto=format&fit=crop&w=120&q=80",
       Beverages: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=120&q=80",
       Snacks: "https://images.unsplash.com/photo-1599490659213-e2b9527bc087?auto=format&fit=crop&w=120&q=80"
     };
     ```
   - Resolve current image URL as `imgUrl = r.image_url || fallbacks[getCleanCat(r.cat).trim()]`.
   - Conditional rendering check: if `imgUrl` is present, render `S.jsx("img", {src: imgUrl, style: {...}})` with matching size, rounded corners, and `objectFit: "cover"`. If not, fall back to the category emoji `$r(r.cat)` inside the styling wrapper.
   - This replacement should be applied to `t_` (Observation B), `n_` (Observation C - main and modal), and `a_` (Observation D) for unified catalog visual design.
3. **Hiding Tier Pricing (Customer Cards)**:
   - Introduce local state to track disclosure panel status: `const [showTiers, setShowTiers] = ge.useState(false)`.
   - Hide the pricing text behind a button click. The button rotates a `▼` arrow depending on the open state:
     ```javascript
     hasTiers&&S.jsxs("div",{style:{marginTop:4,marginBottom:6},children:[S.jsxs("button",{onClick:()=>setShowTiers(!showTiers),style:{background:"none",border:"none",color:C.accent,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4,padding:0,fontFamily:"'Outfit', sans-serif"},children:["Bulk Pricing Info",S.jsx("span",{style:{display:"inline-block",transform:showTiers?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"},children:"▼"})]}),showTiers&&S.jsx("div",{style:{fontSize:10.5,color:C.accent,background:C.accentLight,padding:"6px 10px",borderRadius:6,marginTop:4,border:`1px solid ${C.border}`},children:`1–${r.tier2_min_qty-1} ${r.unit||"pcs"}: ₹${basePrice} | ${r.tier2_min_qty}+ ${r.unit||"pcs"}: ₹${r.tier2_price}`})]})
     ```
4. **Increasing Card Padding & Margins**:
   - Card Padding: Inside customer card `t_` (Observation B), change inline style from `padding:14` to `padding:18`.
   - Card Margins:
     - In `index-DYXXu0wA.js` catalog parent (Observation E), change container `gap:12` to `gap:16`.
     - In `index-BiACt3m9.css` (Observation F), override `.product-grid` gap to `16px !important`.

---

## 3. Caveats

* **Production Code Modification**: The files inside `dist/` must be edited carefully since they are minified. Ensure variable and component names are not broken.
* **Service Worker Cache**: If `dist/assets/index-DYXXu0wA.js`, `dist/assets/index-D0CI6L84.js`, and `dist/assets/index-BiACt3m9.css` are modified, their revision strings in `dist/sw.js` must be bumped to force browser clients to retrieve the updated assets.

---

## 4. Conclusion

Recommended changes are scoped to `dist/assets/index-DYXXu0wA.js`, `dist/assets/index-D0CI6L84.js`, and `dist/assets/index-BiACt3m9.css`. All targets, including product DB mapper `yl`, three views containing product cards (`t_`, `n_`, `a_`), card parent container, and CSS rules have been identified. Implementation is fully specified and ready to proceed.

---

## 5. Verification Method

1. **Verify Mapper `yl` modification**:
   Check if the mapped object has `image_url` mapped from DB object `r.image_url`.
2. **Verify Images**:
   Verify images are loaded in Customer, Salesman, and Admin views. For products belonging to Staples, Biscuits, Beverages, and Snacks with empty `image_url`, verify fallback Unsplash images load properly.
3. **Verify Pricing Disclosure**:
   Check customer view catalog. The text `1-x pcs: ₹y ...` should be hidden by default. Click "Bulk Pricing Info" to expand the details in a stylized box.
4. **Verify Padding/Margins**:
   Inspect elements to confirm padding is 18px and spacing/gap is 16px.
