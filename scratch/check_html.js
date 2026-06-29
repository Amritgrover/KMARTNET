const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/index.html';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  console.log('index-DYXXu0wA.js in index.html:', content.includes('index-DYXXu0wA.js'));
  console.log('index-D0CI6L84.js in index.html:', content.includes('index-D0CI6L84.js'));
  console.log('index-BiACt3m9.css in index.html:', content.includes('index-BiACt3m9.css'));
  console.log('Full HTML content:', content);
}
