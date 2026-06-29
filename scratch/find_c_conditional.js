const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = 442000;
  while ((pos = content.indexOf('c', pos)) !== -1) {
    let prev = content.substring(pos - 4, pos);
    let next = content.substring(pos + 1, pos + 5);
    
    // Check if it's conditional check: e.g. "c?" or "c&&" or "c?"
    if (next.startsWith('?') || next.startsWith('&') || prev.endsWith('?') || prev.endsWith('&') || prev.endsWith('!') || prev.trim().endsWith('&&')) {
      console.log(`Conditional reference at index ${pos}:`);
      console.log(content.substring(pos - 50, pos + 150));
      console.log('---');
    }
    pos++;
  }
}
