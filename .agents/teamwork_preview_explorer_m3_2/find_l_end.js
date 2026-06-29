const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

// The main function l_ is very long. Let's find the return statement near the end.
// We know from keyword search and showCustOrders that showCustOrders is at index 601661.
// Let's print out the code from index 602000 to 608000.
const start = 602000;
const length = 6000;
if (code.length > start) {
  console.log('Writing chunk from index 602000 to 608000...');
  fs.writeFileSync(path.resolve(__dirname, 'l_end_chunk.js'), code.substring(start, start + length), 'utf8');
} else {
  console.log('File is too short:', code.length);
}
