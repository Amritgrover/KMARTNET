const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  const target = 'tier2_min_qty-1}';
  const pos = content.indexOf(target);
  if (pos !== -1) {
    const chunk = content.substring(pos - 100, pos + 200);
    console.log('Context string:', chunk);
    for (let i = 0; i < chunk.length; i++) {
      console.log(`char: ${chunk[i]}, code: ${chunk.charCodeAt(i)}`);
    }
  } else {
    console.log('Target string not found');
  }
}
