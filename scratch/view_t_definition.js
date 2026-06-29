const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = content.indexOf('function t_(');
  if (pos !== -1) {
    console.log(content.substring(pos, pos + 7000));
  } else {
    console.log('function t_( not found');
  }
}
