const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

// We know that editingOrder && S.jsxs("div", { ... }) is near the end
const target = 'editingOrder && S.jsxs("div",';
const pos = code.lastIndexOf(target);
if (pos !== -1) {
  console.log(`Found editingOrder at index ${pos}`);
  // Let's print everything from pos to the end of the file
  console.log(code.substring(pos));
} else {
  console.log('Not found');
}
