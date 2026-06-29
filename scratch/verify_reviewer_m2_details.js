const fs = require('fs');

const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
const content = fs.readFileSync(file, 'utf8');

// Find all indices of getProductThumbnail
let idx = content.indexOf('getProductThumbnail(');
const occurrences = [];
while (idx !== -1) {
  occurrences.push(idx);
  idx = content.indexOf('getProductThumbnail(', idx + 1);
}

occurrences.forEach((pos, i) => {
  if (i === 0) return; // skip definition
  console.log(`=== Occurrence ${i} (index ${pos}) ===`);
  console.log(content.substring(pos - 350, pos + 350));
  console.log('\n');
});
