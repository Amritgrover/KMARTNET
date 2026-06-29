const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = 0;
  // Let's search for primary:"#15803d" or similar green color hex
  let target = 'primary:"#';
  while ((pos = content.indexOf(target, pos)) !== -1) {
    console.log(`Found 'primary:"#' at ${pos}:`);
    console.log(content.substring(pos - 100, pos + 400));
    console.log('---');
    pos += target.length;
  }
}
