const fs = require('fs');

const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-D0CI6L84.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  const term = 'yl=';
  const idx = content.indexOf(term);
  if (idx !== -1) {
    console.log(content.substring(idx - 100, idx + 400));
  }
}

