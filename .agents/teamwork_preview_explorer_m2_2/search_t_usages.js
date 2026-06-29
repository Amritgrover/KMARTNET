const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js');
const content = fs.readFileSync(filePath, 'utf8');

// Find occurrences of t_({
const regex = /t_\(\{/g;
const matches = [...content.matchAll(regex)];
console.log('Found t_({ matches:', matches.length);
matches.forEach((m, idx) => {
  console.log(`Match [${idx}] at ${m.index}:`, content.substring(m.index - 100, m.index + 200));
});
