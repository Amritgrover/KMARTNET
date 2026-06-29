const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = content.indexOf('function a_(');
  if (pos === -1) pos = content.indexOf('a_=');
  if (pos !== -1) {
    console.log('Found function a_ at', pos);
    console.log(content.substring(pos, pos + 1000));
  } else {
    console.log('function a_ not found.');
  }
}
