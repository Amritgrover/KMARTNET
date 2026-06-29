const fs = require('fs');

const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let idx = content.indexOf('customCats.map');
  if (idx !== -1) {
    // Let's print 1200 characters from customCats.map
    console.log(content.substring(idx, idx + 1500));
  }
}
