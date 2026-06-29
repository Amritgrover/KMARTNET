const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

// The function l_ returns a JSX element. Let's find the end of l_
const startPos = code.indexOf('function l_()');
if (startPos !== -1) {
  // Let's search for "return " in the last part of l_
  // Let's get the 15000 characters from l_ function and print the last 2000 characters of it
  const lCode = code.substring(startPos, startPos + 15000);
  const returnIdx = lCode.lastIndexOf('return ');
  if (returnIdx !== -1) {
    console.log('Found return in l_ at index:', startPos + returnIdx);
    console.log(lCode.substring(returnIdx - 200, returnIdx + 2000));
  }
}
