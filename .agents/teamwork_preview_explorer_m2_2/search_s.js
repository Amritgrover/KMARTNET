const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js');
const content = fs.readFileSync(filePath, 'utf8');

// Find declaration of S
// Usually something like "const S =" or "import...as S" or "S=jsxRuntime"
const matchS = content.match(/(\bS=[^;]+)/) || content.match(/(import.*S\b)/);
if (matchS) {
  console.log('Declaration match:', matchS[0]);
  const index = content.indexOf(matchS[0]);
  console.log('Declaration index:', index);
  console.log('Context:', content.substring(index - 50, index + 250));
} else {
  console.log('S declaration not found directly, let us search for S.jsx');
  const jsxIdx = content.indexOf('S.jsx(');
  console.log('S.jsx first found at:', jsxIdx);
  console.log('Context of S.jsx:', content.substring(jsxIdx - 100, jsxIdx + 100));
}
