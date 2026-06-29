const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

// Find calls to i_
let idx = 0;
const terms = ['jsx(i_', 'jsxs(i_'];
terms.forEach(term => {
  let pos = 0;
  while ((pos = code.indexOf(term, pos)) !== -1) {
    console.log(`Found ${term} at index ${pos}:`);
    console.log(code.substring(pos - 150, pos + 250));
    console.log('---');
    pos += term.length;
  }
});
