const fs = require('fs');

const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let idx = 0;
  while ((idx = content.indexOf('category', idx)) !== -1) {
    const context = content.substring(idx - 100, idx + 150);
    if (context.includes('jsx') || context.includes('jsxs') || context.includes('click') || context.includes('suggestions') || context.includes('quick')) {
      console.log(`Found 'category' at index ${idx}:`);
      console.log(context);
      console.log('--------------------');
    }
    idx += 8;
  }
}
