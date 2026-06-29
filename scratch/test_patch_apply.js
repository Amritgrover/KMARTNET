const fs = require('fs');
const path = require('path');

const srcFile = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
const tempFile = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/.agents/teamwork_preview_explorer_m2_1/temp_test.js';

if (!fs.existsSync(srcFile)) {
  console.error('Source file not found');
  process.exit(1);
}

let content = fs.readFileSync(srcFile, 'utf8');

const replacements = [
  {
    name: '1. Mapper yl',
    search: 'yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],brand:r.brand??""})',
    replace: 'yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],brand:r.brand??"",image_url:r.image_url??""})',
    check: 'image_url:r.image_url??""'
  },
  {
    name: '2. Card Padding & Margin in t_',
    search: 'style:{background:C.card,borderRadius:13,padding:14,border:`1.5px solid ${a>0?C.green:C.border}`,boxShadow:a>0?`0 0 0 3px ${C.greenBg}`:"0 1px 6px rgba(0,0,0,0.06)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",flexDirection:"column",gap:0}',
    replace: 'style:{background:C.card,borderRadius:13,padding:18,margin:6,border:`1.5px solid ${a>0?C.green:C.border}`,boxShadow:a>0?`0 0 0 3px ${C.greenBg}`:"0 1px 6px rgba(0,0,0,0.06)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",flexDirection:"column",gap:0}',
    check: 'padding:18,margin:6'
  },
  {
    name: '3. Image/Emoji Fallback in t_',
    search: 'S.jsx("div",{style:{width:38,height:38,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10,flexShrink:0},children:$r(r.cat)})',
    replace: '(()=>{const fallbackImgs={Staples:"https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=120&q=80",Biscuits:"https://images.unsplash.com/photo-1558961317-5f241202db89?auto=format&fit=crop&w=120&q=80",Beverages:"https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=120&q=80",Snacks:"https://images.unsplash.com/photo-1599490659223-9372241688b6?auto=format&fit=crop&w=120&q=80"};const cleanCat=getCleanCat(r.cat).trim();const productImg=r.image_url||fallbackImgs[cleanCat];return productImg?S.jsx("img",{src:productImg,alt:r.name,style:{width:38,height:38,borderRadius:10,objectFit:"cover",marginBottom:10,flexShrink:0}}):S.jsx("div",{style:{width:38,height:38,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10,flexShrink:0},children:$r(r.cat)})})()',
    check: 'fallbackImgs={Staples:"https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=120&q=80"'
  },
  {
    name: '4. Disclosure Panel in t_',
    search: 'hasTiers&&S.jsx("div",{style:{fontSize:11,color:C.accent,fontWeight:700,marginTop:2,marginBottom:4},children:`1–${r.tier2_min_qty-1} ${r.unit||"pcs"}: ₹${basePrice} | ${r.tier2_min_qty}+ ${r.unit||"pcs"}: ₹${r.tier2_price}`})',
    replace: 'hasTiers&&S.jsxs("details",{style:{marginTop:2,marginBottom:4,cursor:"pointer"},children:[S.jsxs("summary",{style:{fontSize:11,color:C.accent,fontWeight:700,display:"flex",alignItems:"center",gap:4,outline:"none",userSelect:"none"},children:[S.jsx("span",{children:"🏷️ View Tier Pricing"}),S.jsx("span",{style:{fontSize:8},children:"▼"})]}),S.jsx("div",{style:{fontSize:11,color:C.accent,fontWeight:700,marginTop:4,padding:"6px 10px",background:C.accentLight,borderRadius:6},children:`1–${r.tier2_min_qty-1} ${r.unit||"pcs"}: ₹${basePrice} | ${r.tier2_min_qty}+ ${r.unit||"pcs"}: ₹${r.tier2_price}`})]})',
    check: 'S.jsxs("details",{style:{marginTop:2,marginBottom:4,cursor:"pointer"}'
  },
  {
    name: '5. Image/Emoji Fallback in n_',
    search: 'S.jsx("div",{\n                style:{width:36,height:36,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0},\n                children:$r(r.cat)\n              })',
    replace: '(()=>{const fallbackImgs={Staples:"https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=120&q=80",Biscuits:"https://images.unsplash.com/photo-1558961317-5f241202db89?auto=format&fit=crop&w=120&q=80",Beverages:"https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=120&q=80",Snacks:"https://images.unsplash.com/photo-1599490659223-9372241688b6?auto=format&fit=crop&w=120&q=80"};const cleanCat=getCleanCat(r.cat).trim();const productImg=r.image_url||fallbackImgs[cleanCat];return productImg?S.jsx("img",{src:productImg,alt:r.name,style:{width:36,height:36,borderRadius:10,objectFit:"cover",flexShrink:0}}):S.jsx("div",{\n                style:{width:36,height:36,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0},\n                children:$r(r.cat)\n              })})()',
    check: 'fallbackImgs={Staples:"https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=120&q=80"'
  },
  {
    name: '6. Image/Emoji Fallback in batch modal header',
    search: 'S.jsx("div",{\n                        style:{width:36,height:36,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20},\n                        children:$r(r.cat)\n                      })',
    replace: '(()=>{const fallbackImgs={Staples:"https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=120&q=80",Biscuits:"https://images.unsplash.com/photo-1558961317-5f241202db89?auto=format&fit=crop&w=120&q=80",Beverages:"https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=120&q=80",Snacks:"https://images.unsplash.com/photo-1599490659223-9372241688b6?auto=format&fit=crop&w=120&q=80"};const cleanCat=getCleanCat(r.cat).trim();const productImg=r.image_url||fallbackImgs[cleanCat];return productImg?S.jsx("img",{src:productImg,alt:r.name,style:{width:36,height:36,borderRadius:10,objectFit:"cover"}}):S.jsx("div",{\n                        style:{width:36,height:36,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20},\n                        children:$r(r.cat)\n                      })})()',
    check: 'fallbackImgs={Staples:"https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=120&q=80"'
  },
  {
    name: '7. Image/Emoji Fallback in product detail header',
    search: 'S.jsx("div",{style:{fontSize:28,background:C.bg,borderRadius:10,width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:$r(r.cat)})',
    replace: '(()=>{const fallbackImgs={Staples:"https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=120&q=80",Biscuits:"https://images.unsplash.com/photo-1558961317-5f241202db89?auto=format&fit=crop&w=120&q=80",Beverages:"https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=120&q=80",Snacks:"https://images.unsplash.com/photo-1599490659223-9372241688b6?auto=format&fit=crop&w=120&q=80"};const cleanCat=getCleanCat(r.cat).trim();const productImg=r.image_url||fallbackImgs[cleanCat];return productImg?S.jsx("img",{src:productImg,alt:r.name,style:{width:48,height:48,borderRadius:10,objectFit:"cover",flexShrink:0}}):S.jsx("div",{style:{fontSize:28,background:C.bg,borderRadius:10,width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:$r(r.cat)})})()',
    check: 'fallbackImgs={Staples:"https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=120&q=80"'
  }
];

let allPassed = true;

replacements.forEach(r => {
  const countBefore = content.split(r.search).length - 1;
  console.log(`Replacement "${r.name}": found ${countBefore} occurrences before patch`);
  if (countBefore === 0) {
    console.error(`ERROR: Target for "${r.name}" not found!`);
    allPassed = false;
  } else {
    // Apply replacement
    content = content.replace(r.search, r.replace);
    // Verify patch by checking if unique replacement string exists
    if (!content.includes(r.check)) {
      console.error(`ERROR: Verification string "${r.check}" not found after replacement!`);
      allPassed = false;
    }
  }
});

if (allPassed) {
  console.log('SUCCESS: All replacements verified successfully on memory content.');
  fs.writeFileSync(tempFile, content);
  console.log('Saved temporary patched file to:', tempFile);
  // Verify length changes slightly
  console.log('Original length:', fs.readFileSync(srcFile).length);
  console.log('Patched length:', fs.readFileSync(tempFile).length);
  // Cleanup
  fs.unlinkSync(tempFile);
  console.log('Cleaned up temporary file');
} else {
  console.error('FAILED: One or more replacements failed validation.');
}
