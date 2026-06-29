const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = 0;
  while ((pos = content.indexOf('S.jsx(t_,', pos)) !== -1) {
    console.log(`Found 'S.jsx(t_,' at index ${pos}:`);
    console.log(content.substring(pos - 100, pos + 400));
    console.log('--------------------');
    pos += 9;
  }
}
