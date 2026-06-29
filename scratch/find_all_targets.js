const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

function findAndPrint(term, before = 50, after = 150) {
  let idx = 0;
  let matches = [];
  while ((idx = code.indexOf(term, idx)) !== -1) {
    matches.push(idx);
    console.log(`Found "${term}" at index ${idx}:`);
    console.log(`--- Snippet ---`);
    console.log(code.substring(idx - before, idx + term.length + after));
    console.log(`---------------\n`);
    idx += term.length;
  }
  console.log(`Total matches for "${term}": ${matches.length}\n`);
}

console.log('--- Finding i_ definition ---');
findAndPrint('function i_({');

console.log('--- Finding salesman logout button ---');
findAndPrint('localStorage.removeItem("kmart_salesman")');
