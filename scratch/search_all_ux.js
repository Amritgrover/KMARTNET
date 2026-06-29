const fs = require('fs');
const file = 'dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const c = fs.readFileSync(file, 'utf8');
  const terms = [
    'getProductThumbnail',
    'image_url',
    'details',
    'summary',
    'Bulk Pricing Info',
    'bottomNav',
    'fixed',
    'offline',
    'shimmer',
    'skeleton',
    'autocomplete',
    'install',
    'pie',
    'bar',
    'pulse',
    'shake',
    'spinner',
    '#1b4332',
    '#2d6a4f',
    'forest'
  ];
  console.log('--- Search Results ---');
  terms.forEach(t => {
    let count = 0;
    let idx = c.indexOf(t);
    while (idx !== -1) {
      count++;
      idx = c.indexOf(t, idx + 1);
    }
    console.log(`${t}: ${count} occurrence(s)`);
    if (count > 0) {
      // Print context of the first occurrence
      const firstIdx = c.indexOf(t);
      console.log(`  Context: ${c.substring(Math.max(0, firstIdx - 50), Math.min(c.length, firstIdx + 150))}\n`);
    }
  });
} else {
  console.log('File not found:', file);
}
