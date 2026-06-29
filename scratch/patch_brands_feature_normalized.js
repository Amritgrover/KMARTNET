const fs = require('fs');

const files = [
  'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js',
  'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-D0CI6L84.js'
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`${file} does not exist.`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');
  console.log(`\n=== Patching File (Normalized): ${file} ===`);

  // Normalize CRLF to LF
  content = content.replace(/\r\n/g, '\n');

  // 1. State declarations
  const targetState = 'const [selectedSalesmanFilter, setSelectedSalesmanFilter] = ge.useState("all");';
  const replacementState = 'const [selectedSalesmanFilter, setSelectedSalesmanFilter] = ge.useState("all");const [selectedBrand, setSelectedBrand] = ge.useState("All");const [customBrands, setCustomBrands] = ge.useState(()=>{const defaults=["Reckitt Benckiser","Marico","McVitie\'s"];const stored=localStorage.getItem("kmart_custom_brands");if(stored){try{const parsed=JSON.parse(stored);if(Array.isArray(parsed)){return Array.from(new Set(parsed.map(x=>x.trim()).filter(Boolean)));}}catch(e){}}return defaults;});const [newBrandName, setNewBrandName] = ge.useState("");const [showNewBrandInput, setShowNewBrandInput] = ge.useState(!1);const [brandToDelete, setBrandToDelete] = ge.useState(null);';
  
  if (content.includes(targetState)) {
    content = content.replace(targetState, replacementState);
    console.log('Patch 1 (States): Success');
  } else {
    console.log('Patch 1 (States): Target not found!');
  }

  // 2. V state declaration
  const targetV = 'const [V, ae] = ge.useState({name:"",cat:"",unit:"",mrp:"",tp:"",cp:"",cs:"",customer_price:"",tier2_min_qty:"",tier2_price:"",desc:""});';
  const replacementV = 'const [V, ae] = ge.useState({name:"",cat:"",brand:"",unit:"",mrp:"",tp:"",cp:"",cs:"",customer_price:"",tier2_min_qty:"",tier2_price:"",desc:""});';
  if (content.includes(targetV)) {
    content = content.replace(targetV, replacementV);
    console.log('Patch 2 (V state): Success');
  } else {
    console.log('Patch 2 (V state): Target not found!');
  }

  // 3. Pe/Ue definitions
  const targetPeUe = 'Pe=ge.useMemo(()=>["All",...Array.from(new Set(s.map(j=>j.cat)))],[s]),\n  Ue=ge.useMemo(()=>s.filter(j=>(g==="All"||j.cat===g)&&(j.name.toLowerCase().includes(f.toLowerCase())||j.cat.toLowerCase().includes(f.toLowerCase())||(j.desc??"").toLowerCase().includes(f.toLowerCase()))),[s,f,g]),';
  const replacementPeUe = 'Pe=ge.useMemo(()=>["All",...Array.from(new Set(s.map(j=>j.cat)))],[s]),dbBrands=ge.useMemo(()=>["All",...Array.from(new Set(s.map(j=>j.brand).filter(Boolean)))],[s]),Ue=ge.useMemo(()=>s.filter(j=>(g==="All"||j.cat===g)&&(selectedBrand==="All"||j.brand===selectedBrand)&&(j.name.toLowerCase().includes(f.toLowerCase())||j.cat.toLowerCase().includes(f.toLowerCase())||(j.desc??"").toLowerCase().includes(f.toLowerCase()))),[s,f,g,selectedBrand]),';
  if (content.includes(targetPeUe)) {
    content = content.replace(targetPeUe, replacementPeUe);
    console.log('Patch 3 (Pe/Ue): Success');
  } else {
    console.log('Patch 3 (Pe/Ue): Target not found!');
  }

  // 4. Category selector rendering and Brand selector UI injection
  const targetCategorySelector = '(r!=="salesman"||salesmanTab==="catalogue")&&S.jsx("div",{style:{marginBottom:12},children:S.jsx(i_,{categories:Pe,active:g,onChange:m})}),';
  const replacementCategorySelector = '(r!=="salesman"||salesmanTab==="catalogue")&&S.jsx("div",{style:{marginBottom:12},children:S.jsx(i_,{categories:Pe,active:g,onChange:l=>{m(l),setSelectedBrand("All")}})}),\n          (r!=="salesman"||salesmanTab==="catalogue")&&S.jsxs("div", {\n            style: { marginTop: 10, marginBottom: 12 },\n            children: [\n              S.jsx("div", {\n                style: { fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 },\n                children: "SHOP BY BRAND"\n              }),\n              S.jsx("div", {\n                style: { display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" },\n                children: dbBrands.map(b => S.jsx("button", {\n                  onClick: () => {\n                    setSelectedBrand(b);\n                    m("All");\n                  },\n                  style: {\n                    padding: "6px 14px",\n                    borderRadius: 20,\n                    border: selectedBrand === b ? "2px solid #000" : `1.5px solid \${C.border}`,\n                    background: selectedBrand === b ? "#000" : "#fff",\n                    color: selectedBrand === b ? "#fff" : C.muted,\n                    fontSize: 12,\n                    fontWeight: selectedBrand === b ? 700 : 500,\n                    cursor: "pointer",\n                    whiteSpace: "nowrap",\n                    fontFamily: "\'Outfit\', sans-serif",\n                    transition: "all 0.15s",\n                    flexShrink: 0\n                  },\n                  children: b\n                }, b))\n              })\n            ]\n          }),';

  if (content.includes(targetCategorySelector)) {
    content = content.replace(targetCategorySelector, replacementCategorySelector);
    console.log('Patch 4 (Category & Brand UI Selector): Success');
  } else {
    console.log('Patch 4 (Category & Brand UI Selector): Target not found!');
  }

  // 5. Kr metadata array
  const targetKr = 'Kr=[["Product Name *","name","e.g. Tata Salt","text"],["Category *","cat","e.g. Staples","text"],["Unit / Pack Size *","unit","e.g. 1 kg","text"],';
  const replacementKr = 'Kr=[["Product Name *","name","e.g. Tata Salt","text"],["Category *","cat","e.g. Staples","text"],["Brand","brand","e.g. Marico","text"],["Unit / Pack Size *","unit","e.g. 1 kg","text"],';
  if (content.includes(targetKr)) {
    content = content.replace(targetKr, replacementKr);
    console.log('Patch 5 (Kr array): Success');
  } else {
    console.log('Patch 5 (Kr array): Target not found!');
  }

  // 6. Form Handlers (kl, jl, gt)
  // kl:
  const targetKl = 'kl=()=>{\n    we(null),ae({name:"",cat:"",unit:"",mrp:"",tp:"",cp:"",cs:"",customer_price:"",tier2_min_qty:"",tier2_price:"",desc:"",vision_product_id:""}),G(!0)\n  },';
  const replacementKl = 'kl=()=>{\n    we(null),ae({name:"",cat:"",brand:"",unit:"",mrp:"",tp:"",cp:"",cs:"",customer_price:"",tier2_min_qty:"",tier2_price:"",desc:"",vision_product_id:""}),G(!0)\n  },';
  if (content.includes(targetKl)) {
    content = content.replace(targetKl, replacementKl);
    console.log('Patch 6a (kl handler): Success');
  } else {
    console.log('Patch 6a (kl handler): Target not found!');
  }

  // jl:
  const targetJl = 'jl=j=>{\n    we(j),ae({name:j.name,cat:j.cat,unit:j.unit,mrp:String(j.mrp),tp:String(j.tp),cp:String(j.cp??""),cs:String(j.cs??""),customer_price:String(j.customer_price??""),tier2_min_qty:String(j.tier2_min_qty??""),tier2_price:String(j.tier2_price??""),desc:j.desc??"",vision_product_id:String(j.vision_product_id??"")}),G(!0)\n  },';
  const replacementJl = 'jl=j=>{\n    we(j),ae({name:j.name,cat:j.cat,brand:j.brand??"",unit:j.unit,mrp:String(j.mrp),tp:String(j.tp),cp:String(j.cp??""),cs:String(j.cs??""),customer_price:String(j.customer_price??""),tier2_min_qty:String(j.tier2_min_qty??""),tier2_price:String(j.tier2_price??""),desc:j.desc??"",vision_product_id:String(j.vision_product_id??"")}),G(!0)\n  },';
  if (content.includes(targetJl)) {
    content = content.replace(targetJl, replacementJl);
    console.log('Patch 6b (jl handler): Success');
  } else {
    console.log('Patch 6b (jl handler): Target not found!');
  }

  // gt:
  const targetGt = 'gt=async()=>{\n    if(!V.name.trim()||!V.cat.trim()||!V.unit.trim()||!V.tp)return;\n    const j={name:V.name,cat:(()=>{const c=V.cat.trim();const d={Staples:"🌾","Edible Oils":"🫙","Home Care":"🧹",Dairy:"🧈",Biscuits:"🍪","Instant Food":"🍜","Personal Care":"🧴",Beverages:"🧃",Snacks:"🍿"};if(d[c])return c;const e=$r(c);if(e&&!c.startsWith(e))return e+" "+c;return c})(),\n      unit:V.unit,';
  const replacementGt = 'gt=async()=>{\n    if(!V.name.trim()||!V.cat.trim()||!V.unit.trim()||!V.tp)return;\n    const j={name:V.name,cat:(()=>{const c=V.cat.trim();const d={Staples:"🌾","Edible Oils":"🫙","Home Care":"🧹",Dairy:"🧈",Biscuits:"🍪","Instant Food":"🍜","Personal Care":"🧴",Beverages:"🧃",Snacks:"🍿"};if(d[c])return c;const e=$r(c);if(e&&!c.startsWith(e))return e+" "+c;return c})(),\n      brand:V.brand?V.brand.trim():"",\n      unit:V.unit,';
  if (content.includes(targetGt)) {
    content = content.replace(targetGt, replacementGt);
    console.log('Patch 6c (gt handler): Success');
  } else {
    console.log('Patch 6c (gt handler): Target not found!');
  }

  // 7. Quick Brand Pick UI Component insertion
  const targetQuickCatsEnd = 'S.jsx("button",{\n                          onClick:(e)=>{\n                            e.stopPropagation();\n                            setCatToDelete(j);\n                          },\n                          style:{background:"transparent",border:"none",color:C.red,fontSize:13,fontWeight:800,cursor:"pointer",padding:"0 2px",marginLeft:2},\n                          children:"×"\n                        })\n                      ]\n                    },j))\n                  })\n                ]\n              }),\n              S.jsx("button",{\n                onClick:gt,';

  const brandPickUI = `S.jsx("button",{\n                          onClick:(e)=>{\n                            e.stopPropagation();\n                            setCatToDelete(j);\n                          },\n                          style:{background:"transparent",border:"none",color:C.red,fontSize:13,fontWeight:800,cursor:"pointer",padding:"0 2px",marginLeft:2},\n                          children:"×"\n                        })\n                      ]\n                    },j))\n                  })\n                ]\n              }),\n              S.jsxs("div",{\n                style:{marginBottom:16},\n                children:[\n                  brandToDelete&&S.jsxs("div",{\n                    style:{background:"#FEF2F2",border:\`1px solid \${C.red}33\`,borderRadius:10,padding:"10px 12px",marginBottom:12},\n                    children:[\n                      S.jsx("div",{\n                        style:{fontSize:12,fontWeight:600,color:C.red,marginBottom:8},\n                        children:\`Remove "\${brandToDelete}" from quick picks?\`\n                      }),\n                      S.jsxs("div",{\n                        style:{display:"flex",gap:10},\n                        children:[\n                          S.jsx("button",{\n                            onClick:()=>{\n                              const newBrands=customBrands.filter(x=>x!==brandToDelete);\n                              setCustomBrands(newBrands);\n                              localStorage.setItem("kmart_custom_brands",JSON.stringify(newBrands));\n                              setBrandToDelete(null);\n                              ye(\`Removed "\${brandToDelete}"!\`);\n                            },\n                            style:{background:C.red,color:"#fff",border:"none",borderRadius:6,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit', sans-serif"},\n                            children:"Yes, Remove"\n                          }),\n                          S.jsx("button",{\n                            onClick:()=>setBrandToDelete(null),\n                            style:{background:"transparent",border:"none",color:C.muted,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'Outfit', sans-serif"},\n                            children:"Cancel"\n                          })\n                        ]\n                      })\n                    ]\n                  }),\n                  !showNewBrandInput?S.jsxs("div",{\n                    style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7},\n                    children:[\n                      S.jsx("div",{\n                        style:{fontSize:11.5,color:C.muted,fontWeight:600},\n                        children:"Quick Brand Pick:"\n                      }),\n                      S.jsx("button",{\n                        onClick:()=>setShowNewBrandInput(!0),\n                        style:{background:"transparent",border:"none",color:C.primary,fontSize:11.5,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit', sans-serif"},\n                        children:"+ Add New"\n                      })\n                    ]\n                  }):S.jsxs("div",{\n                    style:{display:"flex",gap:8,alignItems:"center",marginBottom:7},\n                    children:[\n                      S.jsx("input",{\n                        value:newBrandName,\n                        onChange:e=>setNewBrandName(e.target.value),\n                        placeholder:"Brand name...",\n                        style:{...pl,flex:1,padding:"6px 10px",fontSize:12.5},\n                        autoFocus:!0\n                      }),\n                      S.jsx("button",{\n                        onClick:()=>{\n                          if(newBrandName.trim()){\n                            const cleaned=newBrandName.trim();\n                            if(!customBrands.includes(cleaned)){\n                              const newBrands=[...customBrands,cleaned];\n                              setCustomBrands(newBrands);\n                              localStorage.setItem("kmart_custom_brands",JSON.stringify(newBrands));\n                              ye(\`Brand "\${cleaned}" added!\`);\n                            }else{\n                              ye("Brand already exists.");\n                            }\n                          }\n                          setNewBrandName(""),setShowNewBrandInput(!1)\n                        },\n                        style:{background:C.primary,color:"#fff",border:"none",borderRadius:6,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit', sans-serif"},\n                        children:"Add"\n                      }),\n                      S.jsx("button",{\n                        onClick:()=>(setNewBrandName(""),setShowNewBrandInput(!1)),\n                        style:{background:"transparent",border:"none",color:C.muted,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'Outfit', sans-serif"},\n                        children:"Cancel"\n                      })\n                    ]\n                  }),\n                  S.jsx("div",{\n                    style:{display:"flex",flexWrap:"wrap",gap:6},\n                    children:customBrands.map(j=>S.jsxs("span",{\n                      style:{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:14,border:\`1.5px solid \${V.brand===j?C.primary:C.border}\`,background:V.brand===j?C.primaryLight:"#fff",color:V.brand===j?C.primary:C.muted,fontSize:11.5,fontWeight:500},\n                      children:[\n                        S.jsx("span",{\n                          onClick:()=>ae(J=>({...J,brand:j})),\n                          style:{cursor:"pointer",fontFamily:"'Outfit', sans-serif"},\n                          children:j\n                        }),\n                        S.jsx("button",{\n                          onClick:(e)=>{\n                            e.stopPropagation();\n                            setBrandToDelete(j);\n                          },\n                          style:{background:"transparent",border:"none",color:C.red,fontSize:13,fontWeight:800,cursor:"pointer",padding:"0 2px",marginLeft:2},\n                          children:"×"\n                        })\n                      ]\n                    },j))\n                  })\n                ]\n              }),\n              S.jsx("button",{\n                onClick:gt,`;

  if (content.includes(targetQuickCatsEnd)) {
    content = content.replace(targetQuickCatsEnd, brandPickUI);
    console.log('Patch 7 (Quick Brand Pick UI): Success');
  } else {
    console.log('Patch 7 (Quick Brand Pick UI): Target not found!');
  }

  // Write content back
  fs.writeFileSync(file, content, 'utf8');
});
