const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let idx = 0;
  const terms = ['r==="admin"', 'r==="salesman"', 'r==="customer"', 'salesmanTab', 'adminTab'];
  terms.forEach(term => {
    let pos = content.indexOf(term);
    if (pos !== -1) {
      console.log(`=== Matches for term: ${term} at index ${pos} ===`);
      console.log(content.substring(pos - 300, pos + 500));
      console.log('-----------------------------\n');
    } else {
      console.log(`Term ${term} not found.\n`);
    }
  });
}
