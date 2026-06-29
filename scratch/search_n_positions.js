const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = 0;
  let target = 'function n_(';
  while ((pos = content.indexOf(target, pos)) !== -1) {
    console.log(`Found 'function n_(' at ${pos}:`);
    console.log(content.substring(pos, pos + 150));
    console.log('---');
    pos += target.length;
  }
}
