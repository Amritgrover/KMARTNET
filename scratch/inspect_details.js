const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

function findContext(keyword, len = 200) {
  console.log(`\n=== Context for "${keyword}" ===`);
  let idx = 0;
  while (true) {
    idx = code.indexOf(keyword, idx);
    if (idx === -1) break;
    const start = Math.max(0, idx - len);
    const end = Math.min(code.length, idx + keyword.length + len);
    console.log(`[Index ${idx}]: ... ${code.slice(start, end)} ...`);
    idx += keyword.length;
  }
}

findContext('image_url');
findContext('yl');
findContext('PRICERET');
