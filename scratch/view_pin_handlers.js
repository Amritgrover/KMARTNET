const fs = require('fs');
const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  let pos = 0;
  
  // Search for function r_
  let posR = content.indexOf('function r_');
  if (posR !== -1) {
    console.log('Found function r_ at', posR);
    console.log(content.substring(posR - 100, posR + 400));
    console.log('---');
  }

  // Search for Vr=
  let posVr = content.indexOf('Vr=');
  if (posVr !== -1) {
    console.log('Found Vr= at', posVr);
    console.log(content.substring(posVr - 100, posVr + 200));
    console.log('---');
  }

  // Search for Ri definition
  let posRi = content.indexOf('const Ri=');
  if (posRi === -1) posRi = content.indexOf('function Ri');
  if (posRi === -1) posRi = content.indexOf('Ri=');
  if (posRi !== -1) {
    console.log('Found Ri at', posRi);
    console.log(content.substring(posRi - 100, posRi + 1200));
    console.log('---');
  }
}
