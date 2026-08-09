const fs = require('fs');

const file1 = 'dist/assets/index-DYXXu0wA.js';
const file2 = 'dist/assets/index-D0CI6L84.js';

let c1 = fs.readFileSync(file1, 'utf8');
const oldYl1 = `yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,packsize:r.packsize??1,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],image_url:r.image_url??"",brand:r.brand??""})`;
const newYl1 = `yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,packsize:r.packsize??1,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",note:r.note??"",notes:r.notes??"",is_visible:r.is_visible,vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],image_url:r.image_url??"",brand:r.brand??""})`;

if (c1.includes(oldYl1)) {
  c1 = c1.replace(oldYl1, newYl1);
  fs.writeFileSync(file1, c1, 'utf8');
  console.log(`✅ Fixed yl in ${file1}`);
} else {
  console.log(`❌ oldYl1 not found in ${file1}`);
}

let c2 = fs.readFileSync(file2, 'utf8');
const oldYl2 = `yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],image_url:r.image_url??"",brand:r.brand??""})`;
const newYl2 = `yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",note:r.note??"",notes:r.notes??"",is_visible:r.is_visible,vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],image_url:r.image_url??"",brand:r.brand??""})`;

if (c2.includes(oldYl2)) {
  c2 = c2.replace(oldYl2, newYl2);
  fs.writeFileSync(file2, c2, 'utf8');
  console.log(`✅ Fixed yl in ${file2}`);
} else {
  console.log(`❌ oldYl2 not found in ${file2}`);
}
