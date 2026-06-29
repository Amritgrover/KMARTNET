const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = 490000; // Search within Admin component area
  const terms = ['warning', 'stock', 'low', 'out of', 'chart'];
  terms.forEach(term => {
    let idx = pos;
    console.log(`=== Matches for term: ${term} ===`);
    while ((idx = content.indexOf(term, idx)) !== -1) {
      console.log(`Found at index ${idx}:`);
      console.log(content.substring(idx - 100, idx + 200));
      console.log('---');
      idx += term.length;
    }
  });
}
