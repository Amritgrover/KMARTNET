const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  console.log('--- INDEX 425950 Context (Replacement 5) ---');
  console.log(JSON.stringify(content.substring(425850, 426150)));

  console.log('--- INDEX 429554 Context (Replacement 6) ---');
  console.log(JSON.stringify(content.substring(429450, 429700)));
}
