const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js');
const content = fs.readFileSync(filePath, 'utf8');

const targetIndex = 425950;
console.log('--- Snip from 425000 to 426800 ---');
console.log(content.substring(425000, 426800));
