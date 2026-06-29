const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

// Search for salesmanTab rendering logic
let pos = 0;
const term = 'salesmanTab';
while ((pos = code.indexOf(term, pos)) !== -1) {
  console.log(`Found salesmanTab at index ${pos}:`);
  console.log(code.substring(pos - 100, pos + 300));
  console.log('---');
  pos += term.length;
}
