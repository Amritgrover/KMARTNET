const fs = require('fs');

const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let idx = content.indexOf('activeBatches = (r.product_batches');
  if (idx !== -1) {
    console.log(JSON.stringify(content.substring(idx - 150, idx + 600)));
  }
}


