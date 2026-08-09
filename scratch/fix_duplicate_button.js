const fs = require('fs');

['dist/assets/index-DYXXu0wA.js', 'dist/assets/index-D0CI6L84.js'].forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');

  const duplicatePattern = `,S.jsx("button",{onClick:(e)=>{e.stopPropagation();t&&t()},style:{fontSize:10.5,fontWeight:700,color:isVis?"#166534":"#475569",background:isVis?"#dcfce7":"#f1f5f9",border:\`1px solid \${isVis?"#bbf7d0":"#cbd5e1"}\`,padding:"2px 8px",borderRadius:6,cursor:"pointer",whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:4},children:isVis?"🟢 App Catalog":"⚪ Hidden"}),S.jsx("button",{onClick:(e)=>{e.stopPropagation();t&&t()},style:{fontSize:10.5,fontWeight:700,color:isVis?"#166534":"#475569",background:isVis?"#dcfce7":"#f1f5f9",border:\`1px solid \${isVis?"#bbf7d0":"#cbd5e1"}\`,padding:"2px 8px",borderRadius:6,cursor:"pointer",whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:4},children:isVis?"🟢 App Catalog":"⚪ Hidden"})`;

  const singlePattern = `,S.jsx("button",{onClick:(e)=>{e.stopPropagation();t&&t()},style:{fontSize:10.5,fontWeight:700,color:isVis?"#166534":"#475569",background:isVis?"#dcfce7":"#f1f5f9",border:\`1px solid \${isVis?"#bbf7d0":"#cbd5e1"}\`,padding:"2px 8px",borderRadius:6,cursor:"pointer",whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:4},children:isVis?"🟢 App Catalog":"⚪ Hidden"})`;

  if (content.includes(duplicatePattern)) {
    console.log(`Found duplicate button pattern in ${filePath}! Removing duplicate...`);
    content = content.replace(duplicatePattern, singlePattern);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully fixed duplicate button in ${filePath}`);
  } else {
    console.log(`Duplicate pattern not found in ${filePath}`);
  }
});
