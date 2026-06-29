const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js');
const content = fs.readFileSync(filePath, 'utf8');

function findOccurrences(query, count = 10, contextLen = 200) {
  console.log(`\n--- Searching for: "${query}" ---`);
  let idx = -1;
  let found = 0;
  while ((idx = content.indexOf(query, idx + 1)) !== -1) {
    found++;
    const start = Math.max(0, idx - contextLen);
    const end = Math.min(content.length, idx + query.length + contextLen);
    console.log(`Occurrence ${found} at index ${idx}:`);
    console.log(content.slice(start, end));
    if (found >= count) break;
  }
  if (found === 0) {
    console.log('No occurrences found.');
  }
}

// Search for role-based rendering of navigation or menus
findOccurrences('r==="salesman"', 5, 250);
findOccurrences('r==="customer"', 5, 250);
findOccurrences('children:[ct.user,"Profile"]', 2, 400);
