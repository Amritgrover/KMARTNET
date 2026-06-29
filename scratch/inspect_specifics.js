const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

console.log(code.substring(441900, 442500));
