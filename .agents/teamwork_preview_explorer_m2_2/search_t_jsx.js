const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js');
const content = fs.readFileSync(filePath, 'utf8');

// Find occurrences of S.jsx(t_ or S.jsxs(t_ or references to t_
const regexes = [
  /jsx\(t_,/g,
  /jsxs\(t_,/g,
  /\b(t_)\b/g
];

regexes.forEach((regex, rIdx) => {
  const matches = [...content.matchAll(regex)];
  console.log(`Regex ${regex} matches:`, matches.length);
  matches.slice(0, 10).forEach((m, idx) => {
    console.log(`  Match [${idx}] at ${m.index}:`, content.substring(m.index - 50, m.index + 150));
  });
});
