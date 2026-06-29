const fs = require('fs');

const f1 = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
const f2 = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-D0CI6L84.js';

if (fs.existsSync(f1) && fs.existsSync(f2)) {
  const c1 = fs.readFileSync(f1, 'utf8');
  const c2 = fs.readFileSync(f2, 'utf8');
  console.log('Files are exactly identical:', c1 === c2);
  console.log('F1 length:', c1.length);
  console.log('F2 length:', c2.length);
} else {
  console.log('One of the files is missing');
}
