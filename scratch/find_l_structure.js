const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let searchStart = content.lastIndexOf('Wp.createRoot');
  // let's grab the code before that, say 10000 characters
  let slice = content.substring(searchStart - 15000, searchStart);
  
  // Find where l_'s return statement begins.
  // We can look for the main return by finding "return S.jsxs" or "return S.jsx" that corresponds to the end
  let pos = slice.indexOf('return S.jsxs(');
  if (pos !== -1) {
    console.log('Found return statement at relative index', pos);
    console.log(slice.substring(pos, pos + 1500));
  } else {
    console.log('return S.jsxs( not found in this slice');
  }
}
