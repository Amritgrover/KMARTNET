const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js');
const content = fs.readFileSync(filePath, 'utf8');

const startIdx = 601500;
const endIdx = 615000;
let slice = content.slice(startIdx, endIdx);

let formatted = '';
let indent = 0;
for (let i = 0; i < slice.length; i++) {
  const char = slice[i];
  if (char === '{' || char === '[') {
    indent++;
    formatted += char + '\n' + '  '.repeat(Math.max(0, indent));
  } else if (char === '}' || char === ']') {
    indent--;
    formatted += '\n' + '  '.repeat(Math.max(0, indent)) + char;
  } else if (char === ';') {
    formatted += ';\n' + '  '.repeat(Math.max(0, indent));
  } else if (slice.startsWith('&&', i)) {
    formatted += ' && \n' + '  '.repeat(Math.max(0, indent));
    i++;
  } else if (slice.startsWith('||', i)) {
    formatted += ' || \n' + '  '.repeat(Math.max(0, indent));
    i++;
  } else {
    formatted += char;
  }
}

fs.writeFileSync(path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/.agents/teamwork_preview_explorer_m3_3/dump_end.js'), formatted, 'utf8');
console.log('Dumped end slice to dump_end.js');
