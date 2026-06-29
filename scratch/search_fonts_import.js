const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = content.indexOf('fonts.googleapis.com');
  if (pos !== -1) {
    console.log(content.substring(pos - 150, pos + 400));
  }
}
