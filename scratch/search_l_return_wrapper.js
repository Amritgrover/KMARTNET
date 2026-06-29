const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = 0;
  const terms = ['minHeight:'];
  terms.forEach(term => {
    let idx = 0;
    while ((idx = content.indexOf(term, idx)) !== -1) {
      console.log(`Found '${term}' at index ${idx}:`);
      console.log(content.substring(idx - 100, idx + 400));
      console.log('--------------------');
      idx += term.length;
    }
  });
}
