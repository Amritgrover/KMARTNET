const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
const c = fs.readFileSync(file, 'utf8');
const target = 'const handleConfirmOrder = async () => {';
const idx = c.indexOf(target);
if (idx === -1) {
  console.log('Target not found');
} else {
  console.log(c.substring(idx + 4200, idx + 6000));
}

