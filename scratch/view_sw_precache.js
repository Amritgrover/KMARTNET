const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/sw.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  console.log('index-DYXXu0wA.js exists in sw.js:', content.includes('index-DYXXu0wA.js'));
  console.log('index-D0CI6L84.js exists in sw.js:', content.includes('index-D0CI6L84.js'));
}
