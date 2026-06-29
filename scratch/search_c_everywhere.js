const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = 442000;
  while ((pos = content.indexOf('c', pos)) !== -1 && pos < 500000) {
    let prevChar = content[pos - 1];
    let nextChar = content[pos + 1];
    let isValidToken = !/[a-zA-Z0-9_$]/.test(prevChar) && !/[a-zA-Z0-9_$]/.test(nextChar);
    if (isValidToken) {
      console.log(`Found 'c' at index ${pos}:`);
      console.log(content.substring(pos - 50, pos + 100));
      console.log('---');
    }
    pos++;
  }
}
