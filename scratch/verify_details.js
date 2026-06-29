const fs = require('fs');

['DYXXu0wA', 'D0CI6L84'].forEach(h => {
  const file = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-' + h + '.js';
  console.log(`=== File: ${h} ===`);
  if (!fs.existsSync(file)) {
    console.log('File does not exist');
    return;
  }
  const content = fs.readFileSync(file, 'utf8');
  
  // 1. Check card style with padding:18 and margin:6
  const padIdx = content.indexOf('padding:18,margin:6');
  if (padIdx !== -1) {
    console.log('[OK] Card Style found:');
    console.log(content.substring(padIdx - 100, padIdx + 200));
  } else {
    console.log('[FAIL] Card Style not found');
  }
  
  // 2. Check details tag structure
  const detIdx = content.indexOf('S.jsxs("details"');
  if (detIdx !== -1) {
    console.log('[OK] details tag found:');
    console.log(content.substring(detIdx, detIdx + 600));
  } else {
    console.log('[FAIL] details tag not found');
  }
});
