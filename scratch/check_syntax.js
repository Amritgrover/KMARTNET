const fs = require('fs');
const path = require('path');
const vm = require('vm');

const files = [
  'c:\\Users\\Amritpal Singh\\Downloads\\kmartnet\\kmartnet\\dist\\assets\\index-DYXXu0wA.js',
  'c:\\Users\\Amritpal Singh\\Downloads\\kmartnet\\kmartnet\\dist\\assets\\index-D0CI6L84.js'
];

if (!vm.SourceTextModule) {
  console.log("vm.SourceTextModule is not available. Using dynamic import check instead.");
  (async () => {
    for (const file of files) {
      const tempFile = file.replace('.js', '_temp_check.mjs');
      fs.copyFileSync(file, tempFile);
      try {
        await import('file:///' + tempFile.replace(/\\/g, '/'));
        console.log(`✅ ${path.basename(file)} loaded/parsed successfully without syntax errors!`);
      } catch (err) {
        if (err.name === 'SyntaxError') {
          console.error(`❌ SyntaxError in ${path.basename(file)}:`, err);
        } else {
          console.log(`✅ ${path.basename(file)} parsed successfully (threw expected runtime error: ${err.message})!`);
        }
      } finally {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      }
    }
  })();
} else {
  (async () => {
    for (const file of files) {
      try {
        const code = fs.readFileSync(file, 'utf8');
        const m = new vm.SourceTextModule(code);
        console.log(`✅ ${path.basename(file)} parsed successfully as ES Module!`);
      } catch (err) {
        console.error(`❌ Parse error in ${path.basename(file)}:`, err);
      }
    }
  })();
}
