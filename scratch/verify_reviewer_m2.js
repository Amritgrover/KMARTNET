const fs = require('fs');

const files = [
  'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js',
  'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-D0CI6L84.js'
];

files.forEach(file => {
  console.log(`--- File: ${file} ---`);
  if (!fs.existsSync(file)) {
    console.log('Does not exist');
    return;
  }
  const content = fs.readFileSync(file, 'utf8');
  
  // Find all indices of getProductThumbnail
  let idx = content.indexOf('getProductThumbnail(');
  const occurrences = [];
  while (idx !== -1) {
    occurrences.push(idx);
    idx = content.indexOf('getProductThumbnail(', idx + 1);
  }
  console.log(`Found ${occurrences.length} occurrences:`);
  occurrences.forEach((pos, i) => {
    console.log(`Occurrence ${i+1} at index ${pos}:`);
    console.log(content.substring(pos - 150, pos + 150));
    console.log('------------------------');
  });
});
