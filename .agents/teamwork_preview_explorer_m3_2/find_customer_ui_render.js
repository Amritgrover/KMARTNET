const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

// Search for where showCustOrders or showCustProfile is used in rendering
let pos = 0;
const terms = ['showCustOrders', 'showCustProfile', 'salesmanTab==='];
terms.forEach(term => {
  let idx = 0;
  console.log(`=== Matches for term: ${term} ===`);
  while ((idx = code.indexOf(term, idx)) !== -1) {
    console.log(`Found at index ${idx}:`);
    console.log(code.substring(idx - 150, idx + 350));
    console.log('---');
    idx += term.length;
  }
});
