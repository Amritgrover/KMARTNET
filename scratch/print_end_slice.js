const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let searchStart = content.lastIndexOf('Wp.createRoot');
  console.log(content.substring(searchStart - 4000, searchStart));
}
