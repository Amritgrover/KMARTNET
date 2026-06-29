const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js');
const content = fs.readFileSync(filePath, 'utf8');

const targetIndex = 404006;
console.log('--- Snip from 403900 to 404600 ---');
console.log(content.substring(403900, 404600));
