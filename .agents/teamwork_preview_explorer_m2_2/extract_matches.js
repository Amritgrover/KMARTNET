const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js');
const content = fs.readFileSync(filePath, 'utf8');

console.log('--- Match 3 (429400 to 429900) ---');
console.log(content.substring(429400, 429900));

console.log('\n--- Match 4 (433150 to 433600) ---');
console.log(content.substring(433150, 433600));
