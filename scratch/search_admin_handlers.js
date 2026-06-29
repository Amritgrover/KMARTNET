const fs = require('fs');

const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  ['kl', 'jl', 'gt'].forEach(func => {
    let idx = 0;
    while ((idx = content.indexOf(func + '=', idx)) !== -1) {
      console.log(`Found '${func}=' at index ${idx}:`);
      console.log(content.substring(idx - 100, idx + 400));
      console.log('--------------------');
      idx += func.length + 1;
    }
    while ((idx = content.indexOf(func + '(', idx)) !== -1) {
      console.log(`Found '${func}(' at index ${idx}:`);
      console.log(content.substring(idx - 100, idx + 400));
      console.log('--------------------');
      idx += func.length + 1;
    }
  });
}
