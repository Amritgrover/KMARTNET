const fs = require('fs');

function updateBundle(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update component a_ signature and JSX
  const oldA_Sig = `function a_({p:r,onEdit:a,onDelete:s}){`;
  const newA_Sig = `function a_({p:r,onEdit:a,onDelete:s,onToggleVis:t}){
  const isVis = (() => {
    if (!r) return false;
    let notesObj = null;
    if (r.notes) {
      if (typeof r.notes === "string") {
        try { notesObj = JSON.parse(r.notes); } catch(e) {}
      } else if (typeof r.notes === "object") {
        notesObj = r.notes;
      }
    }
    if (notesObj && notesObj.is_visible !== undefined && notesObj.is_visible !== null) {
      return notesObj.is_visible === true || notesObj.is_visible === "true" || notesObj.is_visible === 1;
    }
    if (r.is_visible !== undefined && r.is_visible !== null) {
      return r.is_visible === true || r.is_visible === "true" || r.is_visible === 1;
    }
    if (r.note === "hidden" || r.note === "false") return false;
    if (r.note === "visible" || r.note === "true" || r.note === "1") return true;
    return false;
  })();`;

  if (content.includes(oldA_Sig)) {
    content = content.replace(oldA_Sig, newA_Sig);
  }

  // 2. Add badge button inside a_ details
  const oldVisionSpan = `r.vision_product_id&&S.jsxs("span",{style:{fontSize:10,fontWeight:700,color:C.accent,background:C.accentLight,padding:"2px 6px",borderRadius:4,whiteSpace:"nowrap"},children:["Vision ID: ",r.vision_product_id]})`;
  const newVisionSpan = `r.vision_product_id&&S.jsxs("span",{style:{fontSize:10,fontWeight:700,color:C.accent,background:C.accentLight,padding:"2px 6px",borderRadius:4,whiteSpace:"nowrap"},children:["Vision ID: ",r.vision_product_id]}),S.jsx("button",{onClick:(e)=>{e.stopPropagation();t&&t()},style:{fontSize:10.5,fontWeight:700,color:isVis?"#166534":"#475569",background:isVis?"#dcfce7":"#f1f5f9",border:\`1px solid \${isVis?"#bbf7d0":"#cbd5e1"}\`,padding:"2px 8px",borderRadius:6,cursor:"pointer",whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:4},children:isVis?"🟢 App Catalog":"⚪ Hidden"})`;

  if (content.includes(oldVisionSpan)) {
    content = content.replace(oldVisionSpan, newVisionSpan);
  }

  // 3. Define top-level toggleVis right under top-level checkVis
  const oldCheckVisEnd = `if (p.note === "visible" || p.note === "true" || p.note === "1") return true;\n    return false;\n  };`;
  const newCheckVisEnd = `if (p.note === "visible" || p.note === "true" || p.note === "1") return true;\n    return false;\n  };\n\n  const toggleVis = async (p) => {\n    let notesObj = {};\n    if (p.notes) {\n      try { notesObj = typeof p.notes === "string" ? JSON.parse(p.notes) : p.notes; } catch(e) {}\n    }\n    const curVis = checkVis(p);\n    const newVis = !curVis;\n    const updatedNotesObj = { ...notesObj, is_visible: newVis };\n    const updatedNotesStr = JSON.stringify(updatedNotesObj);\n    l(prev => prev.map(item => item.id === p.id ? { ...item, is_visible: newVis, notes: updatedNotesStr } : item));\n    const { error } = await Or.from("products").update({ notes: updatedNotesStr }).eq("id", p.id);\n    if (error) {\n      ye("Failed to update visibility: " + error.message);\n    } else {\n      ye(newVis ? \`🟢 Enabled "\${p.name}" for App!\` : \`⚪ Hidden "\${p.name}" from App!\`);\n    }\n  };`;

  if (content.includes(oldCheckVisEnd)) {
    content = content.replace(oldCheckVisEnd, newCheckVisEnd);
  }

  // 4. Pass onToggleVis to a_ in adminTab === "products"
  const oldAMap = `Dn.map(j=>S.jsx(a_,{p:j,onEdit:()=>jl(j),onDelete:()=>E(j)},j.id))`;
  const newAMap = `Dn.map(j=>S.jsx(a_,{p:j,onEdit:()=>jl(j),onDelete:()=>E(j),onToggleVis:()=>toggleVis(j)},j.id))`;

  if (content.includes(oldAMap)) {
    content = content.replace(oldAMap, newAMap);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

updateBundle('dist/assets/index-DYXXu0wA.js');
updateBundle('dist/assets/index-D0CI6L84.js');
