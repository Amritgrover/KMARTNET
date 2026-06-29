const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets';
const destDir = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/.agents/teamwork_preview_explorer_m2_2/temp_assets';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

['index-DYXXu0wA.js', 'index-D0CI6L84.js', 'index-BiACt3m9.css'].forEach(file => {
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
  console.log(`Copied ${file} to temp_assets`);
});
