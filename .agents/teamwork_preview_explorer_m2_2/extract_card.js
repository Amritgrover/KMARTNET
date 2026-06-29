const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js');
const content = fs.readFileSync(filePath, 'utf8');

const targetIndex = 410122; // Where hasTiers matches
console.log('--- Snip from 407500 to 411500 ---');
fs.writeFileSync('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/.agents/teamwork_preview_explorer_m2_2/card_component.txt', content.substring(407000, 411500));
console.log('Snippet saved to card_component.txt');
