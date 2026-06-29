const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

const target = 'showCustProfile&&';
const pos = code.indexOf(target);
if (pos !== -1) {
  console.log(`Found showCustProfile&& at index ${pos}`);
  console.log(code.substring(pos, pos + 2500));
} else {
  console.log('showCustProfile&& not found');
}
