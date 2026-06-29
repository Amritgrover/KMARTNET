const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  const terms = ['onLine', 'offline', 'navigator.onLine', 'install'];
  terms.forEach(term => {
    let pos = 0;
    console.log(`=== Matches for term: ${term} ===`);
    while ((pos = content.indexOf(term, pos)) !== -1) {
      console.log(`Found at pos ${pos}:`);
      console.log(content.substring(pos - 100, pos + 300));
      console.log('---');
      pos += term.length;
    }
  });
}
