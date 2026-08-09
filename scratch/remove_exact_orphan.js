const fs = require('fs');

['dist/assets/index-DYXXu0wA.js', 'dist/assets/index-D0CI6L84.js'].forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');

  const startStr = 'if (p.notes) {\r\n                try { notesObj = typeof p.notes === "string"';
  const startStrLf = 'if (p.notes) {\n                try { notesObj = typeof p.notes === "string"';

  const endStr = 'ye(newVis ? `🟢 Enabled "${p.name}" for App!` : `⚪ Hidden "${p.name}" from App!`);\r\n              }\r\n            };';
  const endStrLf = 'ye(newVis ? `🟢 Enabled "${p.name}" for App!` : `⚪ Hidden "${p.name}" from App!`);\n              }\n            };';

  const sIdx = content.indexOf(startStr) !== -1 ? content.indexOf(startStr) : content.indexOf(startStrLf);
  let eIdx = content.indexOf(endStr, sIdx);
  let endLen = endStr.length;
  if (eIdx === -1) {
    eIdx = content.indexOf(endStrLf, sIdx);
    endLen = endStrLf.length;
  }

  if (sIdx !== -1 && eIdx !== -1) {
    console.log(`Removing orphan block from ${filePath}...`);
    content = content.substring(0, sIdx) + content.substring(eIdx + endLen);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully removed orphan block from ${filePath}`);
  } else {
    console.log(`Could not find orphan block in ${filePath}`);
  }
});
