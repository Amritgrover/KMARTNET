const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

console.log('File length:', code.length);
// Write the last 25000 characters of the file to a file
const start = code.length - 25000;
fs.writeFileSync(path.resolve(__dirname, 'file_end_chunk.js'), code.substring(start), 'utf8');
console.log('Saved last 25000 characters to file_end_chunk.js');
