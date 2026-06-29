const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

const target = 'showCustOrders&&S.jsxs(S.Fragment';
const pos = code.indexOf(target);
if (pos !== -1) {
  console.log(code.substring(pos + 2200, pos + 3200));
} else {
  console.log('Not found');
}
