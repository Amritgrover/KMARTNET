const fs = require('fs');

const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let idx = 0;
  // Let's search for "Pe" as a variable name or in expression
  // Since it could be used as Pe, let's search for references
  const matches = [];
  let pos = 0;
  while ((pos = content.indexOf('Pe', pos)) !== -1) {
    // Check surrounding characters to make sure it's likely a variable reference
    const before = content[pos - 1];
    const after = content[pos + 2]; // Pe has length 2
    // Print occurrences with context
    console.log(`Found 'Pe' at index ${pos}:`);
    console.log(content.substring(pos - 100, pos + 200));
    console.log('--------------------');
    pos += 2;
  }
}
