const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js');
const content = fs.readFileSync(filePath, 'utf8');

const t1 = `r==="salesman"&&S.jsxs("button",{`;
const t2 = `r==="customer"&&cust&&S.jsxs("button",{`;
const t3 = `(r==="salesman"||r==="customer")&&S.jsxs("button",{`;

console.log('t1 index:', content.indexOf(t1));
console.log('t2 index:', content.indexOf(t2));
console.log('t3 index:', content.indexOf(t3));
