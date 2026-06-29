const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = 472000;
  while ((pos = content.indexOf('c?', pos)) !== -1 && pos < 490000) {
    console.log(`Found 'c?' at index ${pos}:`);
    console.log(content.substring(pos - 100, pos + 400));
    console.log('--------------------');
    pos += 2;
  }
}
