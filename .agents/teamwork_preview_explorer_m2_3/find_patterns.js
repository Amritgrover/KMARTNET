const fs = require('fs');
const content = fs.readFileSync('dist/assets/index-DYXXu0wA.js', 'utf8');

console.log('--- Parent Container around 486500 to 487500 ---');
console.log(content.substring(486500, 487500));
