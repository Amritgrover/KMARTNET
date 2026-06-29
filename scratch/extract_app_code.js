const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '../dist/assets/index-DYXXu0wA.js');
const code = fs.readFileSync(jsPath, 'utf8');

const appCode = code.slice(400000);
fs.writeFileSync(path.join(__dirname, 'app_code.js'), appCode, 'utf8');
console.log('App code extracted! Size:', appCode.length);
