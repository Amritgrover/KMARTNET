const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = content.indexOf('document.getElementById("root")');
  if (pos !== -1) {
    console.log('Found mounting point at', pos);
    console.log(content.substring(pos - 1000, pos + 500));
  } else {
    console.log('Mounting point not found.');
  }
}
