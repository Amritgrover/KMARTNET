const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = 0;
  let matches = [];
  while ((pos = content.indexOf('c', pos)) !== -1) {
    let prevChar = content[pos - 1];
    let nextChar = content[pos + 1];
    let isValidToken = !/[a-zA-Z0-9_$]/.test(prevChar) && !/[a-zA-Z0-9_$]/.test(nextChar);
    if (isValidToken) {
      matches.push(pos);
    }
    pos++;
  }
  console.log(`Total standalone 'c' matches: ${matches.length}`);
  matches.forEach(m => {
    // Print around the match if it's within the main App component range
    if (m >= 441000 && m <= 624660) {
      console.log(`Match at index ${m}: ${content.substring(m - 30, m + 40)}`);
    }
  });
}
