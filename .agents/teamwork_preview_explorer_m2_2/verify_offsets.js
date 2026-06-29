const fs = require('fs');
const path = require('path');

const files = ['index-DYXXu0wA.js', 'index-D0CI6L84.js'];
const offsets = [409534, 425950, 429554, 433290];

files.forEach(fileName => {
  const filePath = path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/' + fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`--- ${fileName} Verification ---`);
  offsets.forEach(offset => {
    console.log(`  Offset ${offset}:`, content.substring(offset - 40, offset + 60));
  });
});
