const fs = require('fs');

const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let idx = 0;
  while ((idx = content.indexOf('customCats', idx)) !== -1) {
    console.log(`Found 'customCats' at index ${idx}:`);
    console.log(content.substring(idx - 100, idx + 250));
    console.log('--------------------');
    idx += 10;
  }
}
