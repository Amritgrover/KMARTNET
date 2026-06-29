const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = content.indexOf('const Nn=');
  if (pos === -1) pos = content.indexOf('Nn=');
  if (pos !== -1) {
    console.log('Found Nn at', pos);
    console.log(content.substring(pos - 100, pos + 800));
  } else {
    console.log('Nn definition not found.');
  }
}
