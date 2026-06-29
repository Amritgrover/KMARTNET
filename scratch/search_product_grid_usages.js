const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = 0;
  while ((pos = content.indexOf('product-grid', pos)) !== -1) {
    console.log(`Found 'product-grid' at index ${pos}:`);
    console.log(content.substring(pos - 150, pos + 250));
    console.log('--------------------');
    pos += 12;
  }
}
