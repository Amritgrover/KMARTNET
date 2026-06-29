const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

// Search for the declaration of C, which usually has properties like card, green, greenBg, accent, border, primary
const match = code.match(/const C=\{[^\}]+primary[^\}]+\}/);
if (match) {
  console.log('Found C definition:', match[0]);
} else {
  // Let's do a wider search
  let idx = 0;
  const terms = ['const C={', 'var C={', 'C={'];
  terms.forEach(term => {
    let pos = 0;
    while ((pos = code.indexOf(term, pos)) !== -1) {
      console.log(`Found ${term} at index ${pos}:`);
      console.log(code.substring(pos, pos + 500));
      console.log('---');
      pos += term.length;
    }
  });
}
