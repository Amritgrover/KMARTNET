const fs = require('fs');

const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
const content = fs.readFileSync(file, 'utf8');

// Find all indices of $r
let idx = content.indexOf('$r(');
const occurrences = [];
while (idx !== -1) {
  occurrences.push(idx);
  idx = content.indexOf('$r(', idx + 1);
}

console.log(`Found ${occurrences.length} occurrences of "$r(":`);
occurrences.forEach((pos, i) => {
  console.log(`Occurrence ${i+1} at index ${pos}:`);
  console.log(content.substring(pos - 100, pos + 100));
  console.log('------------------------');
});
