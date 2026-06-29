const fs = require('fs');
const path = require('path');

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      search(full);
    } else if (file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.md')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.toLowerCase().includes('unsplash')) {
        console.log(`Found in: ${full}`);
      }
    }
  }
}

search('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet');
