const fs = require('fs');
const path = require('path');

const tempDir = 'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/.agents/teamwork_preview_explorer_m2_2/temp_assets';

['index-DYXXu0wA.js', 'index-D0CI6L84.js'].forEach(fileName => {
  const filePath = path.join(tempDir, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n=== Patching ${fileName} ===`);

  // 1. yl mapper replacement
  const ylTarget = 'yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],brand:r.brand??""})';
  const ylReplacement = 'yl=r=>({id:r.id,name:r.name,cat:r.cat,unit:r.unit,mrp:r.mrp,tp:r.tp,cp:r.cp??0,cs:r.cs??"",customer_price:r.customer_price??0,tier2_min_qty:r.tier2_min_qty??0,tier2_price:r.tier2_price??0,desc:r.note??"",vision_product_id:r.vision_product_id,stock:r.stock??0,product_batches:r.product_batches??[],brand:r.brand??"",image_url:r.image_url??""})';
  if (content.includes(ylTarget)) {
    content = content.replace(ylTarget, ylReplacement);
    console.log('  [OK] yl mapper patched');
  } else {
    console.log('  [ERR] yl mapper target not found');
  }

  // 2. Insert helper getProductThumbnail
  const helperTarget = 'function getCleanCat(r){if(!r)return"";return r.replace(/^(\\p{Emoji_Presentation}|\\p{Emoji})\\s*/u,"")}';
  const helperReplacement = 'function getCleanCat(r){if(!r)return"";return r.replace(/^(\\p{Emoji_Presentation}|\\p{Emoji})\\s*/u,"")}function getProductThumbnail(r){const c=getCleanCat(r.cat).trim().toLowerCase(),f={staples:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&auto=format&fit=crop",biscuits:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&auto=format&fit=crop",beverages:"https://images.unsplash.com/photo-1527960656306-ce37c5512d6c?w=100&auto=format&fit=crop",snacks:"https://images.unsplash.com/photo-1599490659213-e2b9527bc087?w=100&auto=format&fit=crop"},u=r.image_url||f[c];return u?S.jsx("img",{src:u,alt:r.name,style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:10}}):$r(r.cat)}';
  
  if (content.includes(helperTarget)) {
    content = content.replace(helperTarget, helperReplacement);
    console.log('  [OK] getProductThumbnail helper inserted');
  } else {
    // Try without escaping backslashes if already raw in memory
    const rawHelperTarget = 'function getCleanCat(r){if(!r)return"";return r.replace(/^(\\p{Emoji_Presentation}|\\p{Emoji})\\s*/u,"")}';
    if (content.includes(rawHelperTarget)) {
      content = content.replace(rawHelperTarget, helperReplacement);
      console.log('  [OK] getProductThumbnail helper inserted (raw match)');
    } else {
      console.log('  [ERR] getCleanCat helper target not found');
    }
  }

  // 3. Customer card: padding, margin
  const cardStyleTarget = 'style:{background:C.card,borderRadius:13,padding:14,border:`1.5px solid ${a>0?C.green:C.border}`,boxShadow:a>0?`0 0 0 3px ${C.greenBg}`:"0 1px 6px rgba(0,0,0,0.06)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",flexDirection:"column",gap:0}';
  const cardStyleReplacement = 'style:{background:C.card,borderRadius:13,padding:18,margin:6,border:`1.5px solid ${a>0?C.green:C.border}`,boxShadow:a>0?`0 0 0 3px ${C.greenBg}`:"0 1px 6px rgba(0,0,0,0.06)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",flexDirection:"column",gap:0}';
  if (content.includes(cardStyleTarget)) {
    content = content.replace(cardStyleTarget, cardStyleReplacement);
    console.log('  [OK] Customer card padding and margin increased');
  } else {
    console.log('  [ERR] Customer card style target not found');
  }

  // 4. Customer card: tier pricing disclosure panel
  const tierTarget = 'hasTiers&&S.jsx("div",{style:{fontSize:11,color:C.accent,fontWeight:700,marginTop:2,marginBottom:4},children:`1–${r.tier2_min_qty-1} ${r.unit||"pcs"}: ₹${basePrice} | ${r.tier2_min_qty}+ ${r.unit||"pcs"}: ₹${r.tier2_price}`})';
  const tierReplacement = 'hasTiers&&S.jsxs("details",{style:{cursor:"pointer",fontSize:11,color:C.accent,marginTop:4,marginBottom:6,background:C.accentLight,padding:"6px 10px",borderRadius:8,border:`1px solid ${C.border}`,transition:"all 0.2s"},children:[S.jsxs("summary",{style:{fontWeight:700,outline:"none",listStyle:"none",display:"flex",alignItems:"center",justifyContent:"space-between",userSelect:"none"},children:[S.jsx("span",{children:"🏷️ View Tier Pricing"}),S.jsx("span",{style:{fontSize:9},children:"▼"})]}),S.jsx("div",{style:{marginTop:6,paddingTop:6,borderTop:`1px dashed ${C.accent}`,fontWeight:600,color:C.accent},children:`1–${r.tier2_min_qty-1} ${r.unit||"pcs"}: ₹${basePrice} | ${r.tier2_min_qty}+ ${r.unit||"pcs"}: ₹${r.tier2_price}`})]})';
  if (content.includes(tierTarget)) {
    content = content.replace(tierTarget, tierReplacement);
    console.log('  [OK] Customer card tier pricing disclosure patched');
  } else {
    console.log('  [ERR] Customer card tier pricing target not found');
  }

  // 5. Replace 4 emoji occurrences:
  // Occurrence 1: Customer Card div
  const emojiDiv1 = 'S.jsx("div",{style:{width:38,height:38,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10,flexShrink:0},children:$r(r.cat)})';
  const emojiDiv1Rep = 'S.jsx("div",{style:{width:38,height:38,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10,flexShrink:0},children:getProductThumbnail(r)})';
  if (content.includes(emojiDiv1)) {
    content = content.replace(emojiDiv1, emojiDiv1Rep);
    console.log('  [OK] Emoji Occurrence 1 patched');
  } else {
    console.log('  [ERR] Emoji Occurrence 1 target not found');
  }

  // Occurrence 2: Salesman Card wrapper (using regex to handle whitespace)
  const regexSalesman = /S\.jsx\("div",\{\s*style:\{\s*width:\s*36,\s*height:\s*36,\s*borderRadius:\s*10,\s*background:\s*C\.primaryLight,\s*display:\s*"flex",\s*alignItems:\s*"center",\s*justifyContent:\s*"center",\s*fontSize:\s*18,\s*flexShrink:\s*0\s*\},\s*children:\s*\$r\(r\.cat\)\s*\}\)/g;
  if (regexSalesman.test(content)) {
    content = content.replace(regexSalesman, 'S.jsx("div",{style:{width:36,height:36,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0},children:getProductThumbnail(r)})');
    console.log('  [OK] Emoji Occurrence 2 patched (Salesman Card)');
  } else {
    console.log('  [ERR] Emoji Occurrence 2 target not found');
  }

  // Occurrence 3: Batch modal / list item (using regex to handle whitespace)
  const regexBatch = /S\.jsx\("div",\{\s*style:\{\s*width:\s*36,\s*height:\s*36,\s*borderRadius:\s*10,\s*background:\s*"#fff",\s*display:\s*"flex",\s*alignItems:\s*"center",\s*justifyContent:\s*"center",\s*fontSize:\s*20\s*\},\s*children:\s*\$r\(r\.cat\)\s*\}\)/g;
  if (regexBatch.test(content)) {
    content = content.replace(regexBatch, 'S.jsx("div",{style:{width:36,height:36,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20},children:getProductThumbnail(r)})');
    console.log('  [OK] Emoji Occurrence 3 patched (Batch list item)');
  } else {
    console.log('  [ERR] Emoji Occurrence 3 target not found');
  }

  // Occurrence 4: Another list item
  const emojiDiv4 = 'S.jsx("div",{style:{fontSize:28,background:C.bg,borderRadius:10,width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:$r(r.cat)})';
  const emojiDiv4Rep = 'S.jsx("div",{style:{fontSize:28,background:C.bg,borderRadius:10,width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:getProductThumbnail(r)})';
  if (content.includes(emojiDiv4)) {
    content = content.replace(emojiDiv4, emojiDiv4Rep);
    console.log('  [OK] Emoji Occurrence 4 patched');
  } else {
    console.log('  [ERR] Emoji Occurrence 4 target not found');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Saved patches to ${fileName}`);
});
