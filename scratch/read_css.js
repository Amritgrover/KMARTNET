const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-BiACt3m9.css';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  console.log('CSS length:', content.length);
  console.log(content.substring(content.length - 2000));
}
