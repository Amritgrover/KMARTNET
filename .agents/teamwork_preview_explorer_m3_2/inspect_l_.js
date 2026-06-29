const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

// Find function l_()
const target = 'function l_()';
const pos = code.indexOf(target);
if (pos !== -1) {
  console.log(`Found l_() at index ${pos}`);
  // Let's write out the next 15000 characters to a temporary file in our agents folder
  const chunk = code.substring(pos, pos + 15000);
  fs.writeFileSync(path.resolve(__dirname, 'l_function.js'), chunk, 'utf8');
  console.log('Saved 15000 characters from l_() to l_function.js');
} else {
  console.log('l_() not found');
}
