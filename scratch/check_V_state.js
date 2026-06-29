const fs = require('fs');

const files = [
  'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js',
  'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-D0CI6L84.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const target = 'const [V, ae] = ge.useState({name:"",cat:"",unit:"",mrp:"",tp:"",cp:"",cs:"",customer_price:"",tier2_min_qty:"",tier2_price:"",desc:""});';
    console.log(`${file}: ${content.includes(target)}`);
  }
});
