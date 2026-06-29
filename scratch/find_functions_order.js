const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  ['function t_', 'function b_', 'function n_', 'function i_'].forEach(term => {
    console.log(`${term} at index ${content.indexOf(term)}`);
  });
}
