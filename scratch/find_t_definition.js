const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let idx = content.indexOf('function t_({p:r');
  if (idx !== -1) {
    console.log(content.substring(idx, idx + 4000));
  }
}
