const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';

function findFunctionRange(content, name) {
  const startIndex = content.indexOf(`function ${name}(`);
  if (startIndex === -1) return null;
  
  let i = startIndex + `function ${name}`.length;
  // find first '('
  while (i < content.length && content[i] !== '(') {
    i++;
  }
  if (i >= content.length) return null;
  
  let parenCount = 1;
  i++;
  while (i < content.length && parenCount > 0) {
    if (content[i] === '(') parenCount++;
    else if (content[i] === ')') parenCount--;
    i++;
  }
  
  // Now find the opening brace '{' of the function body
  while (i < content.length && content[i] !== '{') {
    i++;
  }
  if (i >= content.length) return null;
  
  let braceCount = 1;
  let inString = false;
  let stringChar = '';
  i++;
  while (i < content.length && braceCount > 0) {
    const char = content[i];
    if (inString) {
      if (char === stringChar && content[i - 1] !== '\\') {
        inString = false;
      }
    } else if (char === "'" || char === '"' || char === '`') {
      inString = true;
      stringChar = char;
    } else if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
    }
    i++;
  }
  return { start: startIndex, end: i };
}

if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  const rng = findFunctionRange(content, 'n_');
  if (rng) {
    const code = content.substring(rng.start, rng.end);
    console.log('n_ length:', code.length);
    console.log('n_ code starts with:', code.substring(0, 200));
    console.log('n_ code ends with:', code.substring(code.length - 200));
    console.log('Index of return S.jsxs(S.Fragment:', code.indexOf('return S.jsxs(S.Fragment'));
    console.log('Index of return S.jsxs(S.Fragment,{:', code.indexOf('return S.jsxs(S.Fragment,{'));
  } else {
    console.log('n_ range not found');
  }
}
