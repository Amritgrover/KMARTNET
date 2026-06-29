const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

// Find all occurrences of ie&&S.jsx(s_,{msg:ie}),
let pos = 0;
let count = 0;
while ((pos = code.indexOf('ie&&S.jsx(s_,{msg:ie}),', pos)) !== -1) {
  count++;
  console.log(`Found occurrence ${count} at index ${pos}`);
  pos += 'ie&&S.jsx(s_,{msg:ie}),'.length;
}
console.log('Total occurrences:', count);
