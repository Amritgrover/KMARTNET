const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

// Find showCustOrders
const target = 'showCustOrders&&S.jsxs(S.Fragment';
const pos = code.indexOf(target);
if (pos !== -1) {
  console.log(`Found ${target} at index ${pos}`);
  // Let's find the closing of this modal
  // The structure is showCustOrders&&S.jsxs(S.Fragment,{children:[S.jsx(xr,...),S.jsxs("div",...)]})
  // Let's print out the next 1500 chars to see where the S.Fragment ends
  console.log(code.substring(pos, pos + 1800));
} else {
  console.log('Not found');
}
