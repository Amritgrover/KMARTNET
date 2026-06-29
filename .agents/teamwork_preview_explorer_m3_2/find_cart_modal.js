const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

// Search for where X is used in rendering
let pos = 0;
const term = 'X&&';
while ((pos = code.indexOf(term, pos)) !== -1) {
  console.log(`Found X&& at index ${pos}:`);
  console.log(code.substring(pos - 100, pos + 350));
  console.log('---');
  pos += term.length;
}
