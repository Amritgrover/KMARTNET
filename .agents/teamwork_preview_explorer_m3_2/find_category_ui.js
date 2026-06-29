const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

// We know Pe is defined as: Pe=ge.useMemo(()=>["All",...Array.from(new Set(s.map(j=>j.cat)))],[s])
// Let's find occurrences of "Pe" or "getCleanCat" or "All" in the render section.
// Usually it maps over something or references Pe.
let pos = 0;
const terms = ['getCleanCat', 'customCats', 'scroll'];
terms.forEach(term => {
  let idx = 0;
  console.log(`=== Matches for term: ${term} ===`);
  while ((idx = code.indexOf(term, idx)) !== -1) {
    console.log(`Found at index ${idx}:`);
    console.log(code.substring(idx - 100, idx + 200));
    console.log('---');
    idx += term.length;
  }
});
