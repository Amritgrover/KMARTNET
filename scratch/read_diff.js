const fs = require('fs');
const path = require('path');

const diffPath = path.join(__dirname, 'diff_js.txt');
if (fs.existsSync(diffPath)) {
  const content = fs.readFileSync(diffPath, 'utf16le');
  fs.writeFileSync(path.join(__dirname, 'diff_js_utf8.txt'), content, 'utf8');
  console.log('Converted to UTF-8!');
  
  // Print some key parts of the diff
  const lines = content.split('\n');
  console.log('Total diff lines:', lines.length);
  lines.slice(0, 100).forEach((line, i) => console.log(`${i+1}: ${line}`));
} else {
  console.log('Diff file not found!');
}
