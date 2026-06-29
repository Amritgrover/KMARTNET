const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js');
const content = fs.readFileSync(filePath, 'utf8');

const targets = [
  'yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],brand:r.brand??""})',
  'function getCleanCat(r){if(!r)return"";return r.replace(/^(\\p{Emoji_Presentation}|\\p{Emoji})\\s*/u,"")}',
  'S.jsx("div",{style:{width:38,height:38,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10,flexShrink:0},children:$r(r.cat)})',
  'S.jsx("div",{style:{width:36,height:36,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0},children:$r(r.cat)})',
  'S.jsx("div",{style:{width:36,height:36,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20},children:$r(r.cat)})',
  'S.jsx("div",{style:{fontSize:28,background:C.bg,borderRadius:10,width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:$r(r.cat)})'
];

targets.forEach((target, idx) => {
  const normalized = target.replace(/\\/g, ''); // adjust backslashes
  // try direct indexOf
  let count = 0;
  let pos = content.indexOf(target);
  if (pos === -1) {
    pos = content.indexOf(normalized);
  }
  if (pos !== -1) {
    count = 1;
    let nextPos = content.indexOf(target, pos + 1);
    if (nextPos === -1) {
      nextPos = content.indexOf(normalized, pos + 1);
    }
    while (nextPos !== -1) {
      count++;
      nextPos = content.indexOf(target, nextPos + 1);
    }
  }
  console.log(`Target [${idx}] count: ${count}, found at: ${pos}`);
});
