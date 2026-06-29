const fs = require('fs');
const path = require('path');

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      search(full);
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.toLowerCase().includes('image_url')) {
        console.log(`Found in: ${full}`);
        // Let's print matching lines
        const lines = content.split('\n');
        lines.forEach((l, i) => {
          if (l.toLowerCase().includes('image_url')) {
            console.log(`  Line ${i+1}: ${l}`);
          }
        });
      }
    }
  }
}

search('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/.agents');
