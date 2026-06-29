const fs = require('fs');
const path = require('path');

['index-DYXXu0wA.js', 'index-D0CI6L84.js'].forEach(fileName => {
  const filePath = path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/' + fileName);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const ylIndex = content.indexOf('yl=r=>({');
    console.log(`${fileName}: yl found at index ${ylIndex}`);
    if (ylIndex !== -1) {
      console.log(`${fileName} snippet:`, content.substring(ylIndex, ylIndex + 290));
    }
  } else {
    console.log(`${fileName} does not exist!`);
  }
});
