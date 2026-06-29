const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js');
const content = fs.readFileSync(filePath, 'utf8');

console.log('File length:', content.length);

// 1. Search for yl function
const ylIndex = content.indexOf('yl=r=>({');
if (ylIndex !== -1) {
  console.log('yl found at index:', ylIndex);
  console.log('yl snippet:', content.substring(ylIndex, ylIndex + 300));
} else {
  console.log('yl not found with yl=r=>({');
  // Try finding yl=
  const ylMatches = [...content.matchAll(/yl=/g)];
  console.log('yl= matches:', ylMatches.map(m => m.index));
}

// 2. Search for hasTiers/tier pricing
const tierMatches = [...content.matchAll(/hasTiers/g)];
console.log('hasTiers matches:', tierMatches.map(m => m.index));
if (tierMatches.length > 0) {
  tierMatches.forEach((m, idx) => {
    console.log(`hasTiers [${idx}] snippet:`, content.substring(m.index - 50, m.index + 250));
  });
}

// 3. Search for customer product card component t_
// Let's search for "t_=" or "function t_" or usages of t_
// Let's find "1-${r.tier2_min_qty"
const tierStringIndex = content.indexOf('1-${r.tier2_min_qty');
if (tierStringIndex !== -1) {
  console.log('tierStringIndex found at:', tierStringIndex);
  console.log('tierString snippet:', content.substring(tierStringIndex - 200, tierStringIndex + 200));
}
