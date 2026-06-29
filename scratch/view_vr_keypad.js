const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = 442000;
  while ((pos = content.indexOf('Vr=', pos)) !== -1) {
    console.log(`Found Vr= at ${pos}:`);
    console.log(content.substring(pos - 50, pos + 150));
    console.log('---');
    pos += 3;
  }
}
