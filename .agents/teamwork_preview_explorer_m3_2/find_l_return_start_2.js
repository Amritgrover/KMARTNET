const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

// Scan for return S.jsxs("div" or return S.jsx("div" starting from 460000
let pos = 460000;
const targets = ['return S.jsxs("div"', 'return S.jsx("div"', 'return S.jsxs(', 'return S.jsx('];
targets.forEach(t => {
  let idx = pos;
  while ((idx = code.indexOf(t, idx)) !== -1) {
    console.log(`Found ${t} at index ${idx}:`);
    console.log(code.substring(idx - 100, idx + 400));
    console.log('------------------------------------');
    idx += t.length;
  }
});
