const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

const startPos = code.indexOf('function l_()');
if (startPos !== -1) {
  // Let's find "return" after some distance, or find the start of return
  // We can search for the first return S.jsx or return S.jsxs in l_
  let pos = startPos;
  let found = [];
  while ((pos = code.indexOf('return ', pos)) !== -1) {
    if (pos > startPos + 10000) { // return is usually towards the end of state setup
      found.push(pos);
    }
    pos += 7;
    if (found.length > 5) break;
  }
  found.forEach((p, idx) => {
    console.log(`Return candidate ${idx} at pos ${p}:`);
    console.log(code.substring(p - 100, p + 500));
    console.log('------------------');
  });
}
