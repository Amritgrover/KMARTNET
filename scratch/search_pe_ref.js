const fs = require('fs');

const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let idx = 0;
  while ((idx = content.indexOf('Pe', idx)) !== -1) {
    const context = content.substring(idx - 100, idx + 150);
    if (context.includes('map') || context.includes('jsx') || context.includes('jsxs')) {
      console.log(`Found 'Pe' at index ${idx}:`);
      console.log(context);
      console.log('--------------------');
    }
    idx += 2;
  }
}
