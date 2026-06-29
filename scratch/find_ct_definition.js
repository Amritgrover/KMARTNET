const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = content.indexOf('lock:S.jsxs("svg"');
  if (pos !== -1) {
    console.log('Found icons definition at', pos);
    console.log(content.substring(pos - 300, pos + 600));
  } else {
    console.log('Icons definition not found.');
  }
}
