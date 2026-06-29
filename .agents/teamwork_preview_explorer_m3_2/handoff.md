# Handoff Report — Mobile Nav & Scroll UX (R2)

## 1. Observation
- Target minified JavaScript bundles and CSS stylesheet verified to exist in the workspace:
  - `dist/assets/index-DYXXu0wA.js`
  - `dist/assets/index-D0CI6L84.js`
  - `dist/assets/index-BiACt3m9.css`
- Verified by comparing file contents that `index-DYXXu0wA.js` and `index-D0CI6L84.js` are currently 100% identical.
- Located key variables and states in `index-DYXXu0wA.js`:
  - `r` tracks the user role (`"customer"`, `"salesman"`, `"admin"`).
  - `cust` tracks the active customer object (or `null` if not logged in).
  - `selectedSalesman` tracks the active salesman object (or `null` if not logged in).
  - `salesmanTab` tracks active salesman screen state (`"catalogue"` or `"orders"`).
  - `X` tracks Customer/Salesman Cart Modal visibility.
  - `showCustOrders` and `showCustProfile` track customer order and profile modal visibility.
  - `Ot` tracks the total cart quantity.
  - `f` and `y` track Customer search input query and setter.
- Located component `i_` at index `441523` rendering the category filter pills:
  - `function i_({categories:r,active:a,onChange:s}){return S.jsx("div",{style:{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none",WebkitOverflowScrolling:"touch"},children:r.map(l=>S.jsx("button",{onClick:()=>s(l),style:{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${a===l?C.primary:C.border}`,background:a===l?C.primary:"#fff",color:a===l?"#fff":C.muted,fontSize:12.5,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Outfit', sans-serif",transition:"all 0.15s",flexShrink:0},children:[$r(l)?$r(l)+" ":"",getCleanCat(l)]},l))})}`
- Found calls to `i_` at index `484097` (catalogue view) and `500693` (admin panel).

## 2. Logic Chain
- Injecting `const [showSalesmanProfile, setShowSalesmanProfile] = ge.useState(!1);` immediately after the declaration of `salesmanTab` enables toggling salesman profile views via state.
- Rendering a `showSalesmanProfile` modal drawer in salesman view right after `showCustOrders` modal mimics customer profile styling and handles logout.
- Modifying the signature of `i_` to accept a `products` prop enables computing items-per-category count.
- Wrapping the category pill list in a relative parent container `div` and appending an absolute overlay `div` styled with a linear-gradient fade overlay from `transparent` to `C.bg` on the right side provides the scrollable overflow indicator.
- Modifying active button styles inside `i_` to render with variable size, padding, weight, and `boxShadow` makes the active category pill visually distinct.
- Appending the `mobile-bottom-nav` layout at the end of the root layout's children array in `l_` injects the bar across customer and salesman catalog views.
- Applying CSS classes and media queries in `index-BiACt3m9.css` ensures the navigation bar stays responsive (only visible on `< 768px`) and styles active states, badges, and icons cleanly.

## 3. Caveats
- Checked that both JS files are currently identical; if they diverge in subsequent milestones, patches must be applied carefully to matching target coordinates.
- Assumed standard browser behavior for DOM search inputs when tapping the mobile "Search" tab.

## 4. Conclusion
Milestone 3 requirements (Mobile Nav & Category Scroll UX) are fully investigated and mapped. The proposed code insertions hook cleanly into the existing React bundle structure, React states, and global CSS.

## 5. Verification Method
### Manual Verification Steps
- Build/refresh client app and toggle dev tools viewport width to `< 768px`.
- Verify the mobile bottom navigation bar anchors to the bottom with 4 tabs for Customer (Home, Search, Cart, Profile) and 4 tabs for Salesman (Catalogue, Cart, Orders, Profile).
- Tap each tab and verify it correctly switches views or opens modals, highlighting the active state. Verify the badge count matches items in cart.
- Inspect the category filter pill bar and verify the gradient fade overlay is visible on the right edge.
- Tap different categories and verify the active pill is larger, bolder, and shows product count.

### Automated Syntax Validation
```powershell
node -c "dist/assets/index-DYXXu0wA.js"
node -c "dist/assets/index-D0CI6L84.js"
```

---

## Proposed Changes Details

### 1. Declare Salesman Profile State
**Target Files**: `dist/assets/index-DYXXu0wA.js`, `dist/assets/index-D0CI6L84.js`
**Target Index**: ~449660
```javascript
// BEFORE
const [salesmanTab, setSalesmanTab] = ge.useState("catalogue");

// AFTER
const [salesmanTab, setSalesmanTab] = ge.useState("catalogue");const [showSalesmanProfile, setShowSalesmanProfile] = ge.useState(!1);
```

### 2. Category Filter UX & Product Counts Component
**Target Files**: `dist/assets/index-DYXXu0wA.js`, `dist/assets/index-D0CI6L84.js`
**Target Index**: ~441523
```javascript
// BEFORE
function i_({categories:r,active:a,onChange:s}){return S.jsx("div",{style:{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none",WebkitOverflowScrolling:"touch"},children:r.map(l=>S.jsx("button",{onClick:()=>s(l),style:{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${a===l?C.primary:C.border}`,background:a===l?C.primary:"#fff",color:a===l?"#fff":C.muted,fontSize:12.5,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Outfit', sans-serif",transition:"all 0.15s",flexShrink:0},children:[$r(l)?$r(l)+" ":"",getCleanCat(l)]},l))})}

// AFTER
function i_({categories:r,active:a,onChange:s,products:p=[]}){return S.jsxs("div",{style:{position:"relative",width:"100%"},children:[S.jsx("div",{style:{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none",WebkitOverflowScrolling:"touch"},children:r.map(l=>S.jsx("button",{onClick:()=>s(l),style:{padding:a===l?"8px 16px":"6px 14px",borderRadius:20,border:`1.5px solid ${a===l?C.primary:C.border}`,background:a===l?C.primary:"#fff",color:a===l?"#fff":C.muted,fontSize:a===l?13.5:12.5,fontWeight:a===l?700:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Outfit', sans-serif",transition:"all 0.15s",flexShrink:0,boxShadow:a===l?"0 4px 8px rgba(20,83,45,0.2)":"none"},children:[$r(l)?$r(l)+" ":"",getCleanCat(l)+(p.length?" ("+(l==="All"?p.length:p.filter(x=>x.cat===l).length)+")":"")]},l))}),S.jsx("div",{style:{position:"absolute",top:0,right:0,bottom:4,width:40,background:`linear-gradient(to right, transparent, ${C.bg})`,pointerEvents:"none"}})]})}
```

### 3. Update Category Filter Component Calls
**Target Files**: `dist/assets/index-DYXXu0wA.js`, `dist/assets/index-D0CI6L84.js`
**Call 1 (Catalogue, ~index 484097)**:
```javascript
// BEFORE
S.jsx(i_,{categories:Pe,active:g,onChange:l=>{m(l),setSelectedBrand("All")}})

// AFTER
S.jsx(i_,{categories:Pe,active:g,onChange:l=>{m(l),setSelectedBrand("All")},products:s})
```
**Call 2 (Admin Panel, ~index 500693)**:
```javascript
// BEFORE
S.jsx(i_,{categories:Pe,active:adminCatFilter,onChange:setAdminCatFilter})

// AFTER
S.jsx(i_,{categories:Pe,active:adminCatFilter,onChange:setAdminCatFilter,products:s})
```

### 4. Salesman Profile Modal Injection
**Target Files**: `dist/assets/index-DYXXu0wA.js`, `dist/assets/index-D0CI6L84.js`
**Target Index**: ~604642
```javascript
// BEFORE
ie&&S.jsx(s_,{msg:ie}),

// AFTER
ie&&S.jsx(s_,{msg:ie}),showSalesmanProfile&&S.jsxs(S.Fragment,{children:[S.jsx(xr,{zIndex:110,onClick:()=>setShowSalesmanProfile(!1)}),S.jsxs("div",{style:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderRadius:"20px 20px 0 0",zIndex:120,padding:"20px 20px 36px",maxHeight:"82vh",overflowY:"auto",boxShadow:"0 -8px 32px rgba(0,0,0,0.18)",fontFamily:"'Outfit', sans-serif"},children:[S.jsx("div",{style:{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 18px"}}),S.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20},children:[S.jsx("div",{style:{fontSize:17,fontWeight:800,color:C.text},children:"Salesman Profile"}),S.jsx("button",{onClick:()=>setShowSalesmanProfile(!1),style:{border:"none",background:C.bg,borderRadius:8,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.muted},children:ct.close})]}),S.jsxs("div",{style:{background:C.bg,borderRadius:12,padding:16,marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"},children:[S.jsxs("div",{children:[S.jsx("div",{style:{fontSize:18,fontWeight:800,color:C.text},children:selectedSalesman?selectedSalesman.name:"Salesman"}),S.jsxs("div",{style:{fontSize:12.5,color:C.muted,marginTop:4},children:["Beat: ",selectedSalesman?selectedSalesman.beat:"N/A"]})]}),S.jsx("button",{onClick:()=>{localStorage.removeItem("kmart_salesman");setSlAuth(!1);setSelectedSalesman(null);setShowSalesmanProfile(!1);ye("Salesman logged out.")},style:{background:C.redBg,color:C.red,border:"none",borderRadius:8,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer"},children:"Logout"})]})]})]}),
```

### 5. Append Mobile Bottom Navigation Layout to Main Root Component
**Target Files**: `dist/assets/index-DYXXu0wA.js`, `dist/assets/index-D0CI6L84.js`
**Target Index**: ~609600 (near the end of `l_` return)
```javascript
// BEFORE
                      S.jsx("button", {
                        onClick: () => setEditingOrder(null),
                        style: { flex: 1, padding: "10px 0", background: C.bg, color: C.muted, border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
                        children: "Cancel"
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

// AFTER
                      S.jsx("button", {
                        onClick: () => setEditingOrder(null),
                        style: { flex: 1, padding: "10px 0", background: C.bg, color: C.muted, border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
                        children: "Cancel"
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),
      ((r === "customer" && cust) || (r === "salesman" && selectedSalesman)) && S.jsxs("div", {
        className: "mobile-bottom-nav",
        children: [
          r === "customer" && S.jsxs(S.Fragment, {
            children: [
              S.jsxs("button", {
                className: `mobile-bottom-nav-item ${(!X && !showCustOrders && !showCustProfile && f === "") ? "active" : ""}`,
                onClick: () => { $(!1); setShowCustOrders(!1); setShowCustProfile(!1); y(""); },
                children: [
                  S.jsx("span", { className: "mobile-bottom-nav-icon", children: "🏠" }),
                  S.jsx("span", { children: "Home" })
                ]
              }),
              S.jsxs("button", {
                className: `mobile-bottom-nav-item ${(!X && !showCustOrders && !showCustProfile && f !== "") ? "active" : ""}`,
                onClick: () => {
                  $(!1);
                  setShowCustOrders(!1);
                  setShowCustProfile(!1);
                  setTimeout(() => {
                    const inp = document.querySelector('input[placeholder*="Search"]');
                    if (inp) {
                      inp.focus();
                      window.scrollTo({ top: inp.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
                    }
                  }, 100);
                },
                children: [
                  S.jsx("span", { className: "mobile-bottom-nav-icon", children: "🔍" }),
                  S.jsx("span", { children: "Search" })
                ]
              }),
              S.jsxs("button", {
                className: `mobile-bottom-nav-item ${X ? "active" : ""}`,
                onClick: () => { $(!0); },
                children: [
                  S.jsx("span", { className: "mobile-bottom-nav-icon", children: "🛒" }),
                  S.jsx("span", { children: "Cart" }),
                  Ot > 0 && S.jsx("span", { className: "mobile-bottom-nav-badge", children: Ot })
                ]
              }),
              S.jsxs("button", {
                className: `mobile-bottom-nav-item ${showCustProfile ? "active" : ""}`,
                onClick: () => { $(!1); setShowCustOrders(!1); setShowCustProfile(!0); },
                children: [
                  S.jsx("span", { className: "mobile-bottom-nav-icon", children: "👤" }),
                  S.jsx("span", { children: "Profile" })
                ]
              })
            ]
          }),
          r === "salesman" && S.jsxs(S.Fragment, {
            children: [
              S.jsxs("button", {
                className: `mobile-bottom-nav-item ${(salesmanTab === "catalogue" && !X && !showSalesmanProfile) ? "active" : ""}`,
                onClick: () => { setSalesmanTab("catalogue"); $(!1); setShowSalesmanProfile(!1); },
                children: [
                  S.jsx("span", { className: "mobile-bottom-nav-icon", children: "📋" }),
                  S.jsx("span", { children: "Catalogue" })
                ]
              }),
              S.jsxs("button", {
                className: `mobile-bottom-nav-item ${X ? "active" : ""}`,
                onClick: () => { $(!0); },
                children: [
                  S.jsx("span", { className: "mobile-bottom-nav-icon", children: "🛒" }),
                  S.jsx("span", { children: "Cart" }),
                  Ot > 0 && S.jsx("span", { className: "mobile-bottom-nav-badge", children: Ot })
                ]
              }),
              S.jsxs("button", {
                className: `mobile-bottom-nav-item ${(salesmanTab === "orders" && !X && !showSalesmanProfile) ? "active" : ""}`,
                onClick: () => { setSalesmanTab("orders"); $(!1); setShowSalesmanProfile(!1); },
                children: [
                  S.jsx("span", { className: "mobile-bottom-nav-icon", children: "📦" }),
                  S.jsx("span", { children: "Orders" })
                ]
              }),
              S.jsxs("button", {
                className: `mobile-bottom-nav-item ${showSalesmanProfile ? "active" : ""}`,
                onClick: () => { $(!1); setShowSalesmanProfile(!0); },
                children: [
                  S.jsx("span", { className: "mobile-bottom-nav-icon", children: "👤" }),
                  S.jsx("span", { children: "Profile" })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}
```

### 6. Stylesheet Additions
**Target File**: `dist/assets/index-BiACt3m9.css`
**Target Location**: Append to end of file
```css
/* Mobile Bottom Navigation Bar Styles */
@media (min-width: 768px) {
  .mobile-bottom-nav {
    display: none !important;
  }
}

.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 64px;
  background: #ffffff;
  border-top: 1px solid #e4e1d9;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
}

.mobile-bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #71717a;
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  flex: 1;
  height: 100%;
  position: relative;
  transition: all 0.2s ease;
}

.mobile-bottom-nav-item.active {
  color: #14532D;
  font-weight: 700;
}

.mobile-bottom-nav-icon {
  font-size: 20px;
  margin-bottom: 2px;
  transition: transform 0.2s ease;
}

.mobile-bottom-nav-item.active .mobile-bottom-nav-icon {
  transform: scale(1.1);
}

.mobile-bottom-nav-badge {
  position: absolute;
  top: 4px;
  right: 50%;
  transform: translateX(12px);
  background: #DC2626;
  color: #ffffff;
  font-size: 9px;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 10px;
  min-width: 12px;
  text-align: center;
  box-shadow: 0 0 0 2px #ffffff;
}
```
