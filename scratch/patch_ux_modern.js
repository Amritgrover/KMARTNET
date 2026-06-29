const fs = require('fs');

const files = [
  'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js',
  'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-D0CI6L84.js'
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');

  // 1. Color object definition update
  const oldC = 'C={bg:"#F4F2ED",card:"#FFFFFF",primary:"#14532D",primaryLight:"#DCFCE7",accent:"#B45309",accentLight:"#FEF3C7",text:"#1A1A1A",muted:"#71717A",border:"#E4E1D9",green:"#16A34A",greenBg:"#F0FDF4",red:"#DC2626",redBg:"#FEF2F2",wa:"#25D366",yellow:"#FCD34D"}';
  const newC = 'C={bg:"#f8f9fa",card:"#FFFFFF",primary:"#1b4332",primaryLight:"#e8f5e9",accent:"#d4a843",accentLight:"#f4e3b1",text:"#181d19",muted:"#404942",border:"#e2e7e4",green:"#40916c",greenBg:"#e8f5e9",red:"#ba1a1a",redBg:"#ffdad6",wa:"#25D366",yellow:"#f4e3b1"}';
  if (content.includes(oldC)) {
    content = content.replace(oldC, newC);
    console.log(`Updated C colors in ${file}`);
  } else {
    console.log(`Could not find old C definition in ${file}`);
  }

  // 2. Google Fonts family stylesheet update
  const oldFontsUrl = 'family=Outfit:wght@400;500;600;700;800&display=swap';
  const newFontsUrl = 'family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
  if (content.includes(oldFontsUrl)) {
    content = content.replace(oldFontsUrl, newFontsUrl);
    console.log(`Updated Google Fonts link in ${file}`);
  } else {
    console.log(`Could not find old Google Fonts link in ${file}`);
  }

  // 3. Update body default font style
  const oldBodyFont = "document.body.style.fontFamily=\"'Outfit', sans-serif\"";
  const newBodyFont = "document.body.style.fontFamily=\"'Plus Jakarta Sans', sans-serif\"";
  if (content.includes(oldBodyFont)) {
    content = content.replace(oldBodyFont, newBodyFont);
    console.log(`Updated body font family style in ${file}`);
  } else {
    console.log(`Could not find old body font family style in ${file}`);
  }

  // 4. Global replacement of 'Outfit', sans-serif to 'Plus Jakarta Sans', sans-serif
  const countOutfit = (content.match(/'Outfit', sans-serif/g) || []).length;
  if (countOutfit > 0) {
    content = content.split("'Outfit', sans-serif").join("'Plus Jakarta Sans', sans-serif");
    console.log(`Globally replaced ${countOutfit} fontFamily declarations in ${file}`);
  }

  // 5. Update salesman card n_ container roundedness and shadow
  const oldN_Card = 'style:{background:C.card,borderRadius:13,padding:14,border:`1.5px solid ${totalQty>0?C.green:C.border}`,boxShadow:totalQty>0?`0 0 0 3px ${C.greenBg}`:"0 1px 6px rgba(0,0,0,0.06)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",width:"100%"}';
  const newN_Card = 'style:{background:C.card,borderRadius:16,padding:14,border:`1.5px solid ${totalQty>0?C.green:C.border}`,boxShadow:totalQty>0?`0 0 0 3px ${C.greenBg}`:"0 4px 12px rgba(0,0,0,0.05)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",width:"100%"}';
  if (content.includes(oldN_Card)) {
    content = content.replace(oldN_Card, newN_Card);
    console.log(`Updated salesman card container roundedness/shadow in ${file}`);
  } else {
    console.log(`Could not find salesman card container style in ${file}`);
  }

  // 6. Update salesman card TP price color and size
  const oldN_Price = 'S.jsxs("div",{style:{fontSize:14.5,fontWeight:800,color:C.primary},children:[r.mrp>0?"TP: ":"",un(r.tp*(1-disc/100))]})';
  const newN_Price = 'S.jsxs("div",{style:{fontSize:15,fontWeight:800,color:C.accent},children:[r.mrp>0?"TP: ":"",un(r.tp*(1-disc/100))]})';
  if (content.includes(oldN_Price)) {
    content = content.replace(oldN_Price, newN_Price);
    console.log(`Updated salesman card TP color/size in ${file}`);
  } else {
    console.log(`Could not find salesman card TP price in ${file}`);
  }

  // 7. Update customer card t_ layout (from column stack to row with image on left, details on right)
  const oldT_Header = 'return S.jsxs("div",{style:{background:C.card,borderRadius:13,padding:18,margin:6,border:`1.5px solid ${a>0?C.green:C.border}`,boxShadow:a>0?`0 0 0 3px ${C.greenBg}`:"0 1px 6px rgba(0,0,0,0.06)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",flexDirection:"column",gap:0},children:[S.jsx("div",{style:{width:38,height:38,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10,flexShrink:0},children:getProductThumbnail(r)}),S.jsx("div",{style:{fontSize:10.5,fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:.6,marginBottom:4},children:getCleanCat(r.cat)}),S.jsx("div",{style:{fontSize:13.5,fontWeight:700,color:C.text,lineHeight:1.35,marginBottom:3,flex:1},children:r.name}),!(r.unit&&["pcs","pcs.","piece","pieces"].includes(r.unit.trim().toLowerCase()))&&S.jsx("div",{style:{fontSize:12,color:C.muted,marginBottom:10},children:r.unit}),';
  const newT_Header = 'return S.jsxs("div",{style:{background:C.card,borderRadius:16,padding:14,margin:6,border:`1.5px solid ${a>0?C.green:C.border}`,boxShadow:a>0?`0 0 0 3px ${C.greenBg}`:"0 4px 12px rgba(0,0,0,0.05)",transition:"border-color 0.2s, box-shadow 0.2s",display:"flex",flexDirection:"row",gap:12,alignItems:"flex-start"},children:[S.jsx("div",{style:{width:64,height:64,borderRadius:12,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0},children:getProductThumbnail(r)}),S.jsxs("div",{style:{display:"flex",flexDirection:"column",flex:1,minWidth:0},children:[S.jsx("div",{style:{fontSize:10.5,fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:.6,marginBottom:4},children:getCleanCat(r.cat)}),S.jsx("div",{style:{fontSize:13.5,fontWeight:700,color:C.text,lineHeight:1.35,marginBottom:3,flex:1},children:r.name}),!(r.unit&&["pcs","pcs.","piece","pieces"].includes(r.unit.trim().toLowerCase()))&&S.jsx("div",{style:{fontSize:12,color:C.muted,marginBottom:10},children:r.unit}),';

  if (content.includes(oldT_Header)) {
    content = content.replace(oldT_Header, newT_Header);
    console.log(`Updated customer card t_ layout header in ${file}`);
  } else {
    console.log(`Could not find customer card t_ layout header in ${file}`);
  }

  // 8. Update customer card t_ pricing color to gold
  const oldT_Price = 'children:[S.jsx("span",{style:{fontSize:19,fontWeight:800,color:C.primary},children:un(activePrice)})';
  const newT_Price = 'children:[S.jsx("span",{style:{fontSize:20,fontWeight:800,color:C.accent},children:un(activePrice)})';
  if (content.includes(oldT_Price)) {
    content = content.replace(oldT_Price, newT_Price);
    console.log(`Updated customer card price color/size in ${file}`);
  } else {
    console.log(`Could not find customer card price code in ${file}`);
  }

  // 9. Update customer card t_ quantity stepper plus button to stay filled green
  const oldT_PlusBtn = 'S.jsx("button",{onClick:s,style:{width:30,height:30,borderRadius:8,border:`1.5px solid ${C.primary}`,background:a===0?C.primary:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:a===0?"#fff":C.primary,flexShrink:0,transition:"background 0.15s"},children:ct.plus})';
  const newT_PlusBtn = 'S.jsx("button",{onClick:s,style:{width:30,height:30,borderRadius:8,border:`1.5px solid ${C.primary}`,background:C.primary,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0},children:ct.plus})';
  if (content.includes(oldT_PlusBtn)) {
    content = content.replace(oldT_PlusBtn, newT_PlusBtn);
    console.log(`Updated customer card quantity stepper plus button in ${file}`);
  } else {
    console.log(`Could not find customer card quantity stepper plus button in ${file}`);
  }

  // 10. Close the details column div container at the end of t_ children array
  const oldT_Tail = 'a>0&&S.jsxs("div",{style:{textAlign:"center",fontSize:12,fontWeight:700,color:C.green,marginTop:6},children:["= ",un(((r.tier2_min_qty>0&&a>=r.tier2_min_qty)?r.tier2_price:(r.customer_price>0?r.customer_price:r.mrp))*a)]})]}';
  const newT_Tail = 'a>0&&S.jsxs("div",{style:{textAlign:"center",fontSize:12,fontWeight:700,color:C.green,marginTop:6},children:["= ",un(((r.tier2_min_qty>0&&a>=r.tier2_min_qty)?r.tier2_price:(r.customer_price>0?r.customer_price:r.mrp))*a)]})]})]}';
  if (content.includes(oldT_Tail)) {
    content = content.replace(oldT_Tail, newT_Tail);
    console.log(`Updated customer card t_ layout tail (closed details container) in ${file}`);
  } else {
    console.log(`Could not find customer card t_ layout tail in ${file}`);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Wrote changes to ${file}`);
});
