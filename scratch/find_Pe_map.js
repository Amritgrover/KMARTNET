const fs = require('fs');

const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let idx = 0;
  while ((idx = content.indexOf('Pe.map', idx)) !== -1) {
    console.log(`Found 'Pe.map' at index ${idx}:`);
    console.log(content.substring(idx - 200, idx + 600));
    console.log('--------------------');
    idx += 6;
  }
}
