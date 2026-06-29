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
  console.log(`\n=== Patching yl Mapper in File: ${file} ===`);

  const target = 'yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],product_batches:r.product_batches??[]})';
  const replacement = 'yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],brand:r.brand??""})';

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully patched yl mapper!');
  } else {
    console.log('Target string not found in file!');
  }
});
