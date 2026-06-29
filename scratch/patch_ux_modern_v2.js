const fs = require('fs');

const files = [
  'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js',
  'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-D0CI6L84.js'
];

// Helper to extract a function block
function findFunctionRange(content, name) {
  const startIndex = content.indexOf(`function ${name}(`);
  if (startIndex === -1) return null;
  let i = startIndex;
  while (i < content.length && content[i] !== '{') {
    i++;
  }
  if (i >= content.length) return null;
  let braceCount = 1;
  let inString = false;
  let stringChar = '';
  i++;
  while (i < content.length && braceCount > 0) {
    const char = content[i];
    if (inString) {
      if (char === stringChar && content[i - 1] !== '\\') {
        inString = false;
      }
    } else if (char === "'" || char === '"' || char === '`') {
      inString = true;
      stringChar = char;
    } else if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
    }
    i++;
  }
  return { start: startIndex, end: i };
}

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');

  // --- RESTORY t_ ---
  const tRange = findFunctionRange(content, 't_');
  if (tRange) {
    const oldTCode = content.substring(tRange.start, tRange.end);
    const newTCode = `function t_({p:r,qty:a,onAdd:s,onInc:l,onDec:c,onSet:h}){
      const caseSize=parseInt(r.cs)||0,cases=caseSize>0?Math.floor(a/caseSize):0,pcs=caseSize>0?a%caseSize:a,[cInput,setCInput]=ge.useState(cases===0?"":String(cases)),[pInput,setPInput]=ge.useState(pcs===0?"":String(pcs)),[f,y]=ge.useState(a===0?"":String(a));
      ge.useEffect(()=>{setCInput(cases===0?"":String(cases));setPInput(pcs===0?"":String(pcs));y(a===0?"":String(a))},[a,caseSize]);
      const basePrice=r.customer_price>0?r.customer_price:r.mrp,activePrice=(r.tier2_min_qty>0&&a>=r.tier2_min_qty)?r.tier2_price:basePrice,hasTiers=r.tier2_min_qty>0;
      return S.jsxs("div",{
        style:{background:C.card,borderRadius:16,padding:16,boxShadow:"0 4px 12px rgba(0,0,0,0.05)",border:\`1.5px solid \${a>0?C.primary:C.border}\`,position:"relative",display:"flex",flexDirection:"column",gap:12,margin:6},
        children:[
          S.jsxs("div",{
            style:{display:"flex",gap:12,alignItems:"flex-start"},
            children:[
              S.jsx("div",{style:{width:74,height:74,borderRadius:12,background:"#F4F6F5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0},children:getProductThumbnail(r)}),
              S.jsxs("div",{
                style:{display:"flex",flexDirection:"column",flex:1,minWidth:0},
                children:[
                  S.jsx("div",{style:{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.5},children:r.brand||"MCVITIE'S"}),
                  S.jsx("div",{style:{fontSize:14,fontWeight:800,color:C.text,marginTop:1,lineHeight:1.2,wordBreak:"break-word"},children:r.name}),
                  S.jsxs("div",{
                    style:{display:"flex",alignItems:"baseline",gap:6,marginTop:4},
                    children:[
                      S.jsx("span",{style:{fontSize:17,fontWeight:800,color:C.accent},children:un(activePrice)}),
                      r.mrp>0&&S.jsx("span",{style:{fontSize:11.5,color:C.muted,textDecoration:"line-through"},children:un(r.mrp)})
                    ]
                  }),
                  S.jsxs("div",{
                    style:{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"},
                    children:[
                      caseSize>0&&S.jsx("div",{style:{background:"#F4F6F5",color:C.muted,fontSize:9.5,fontWeight:700,padding:"2px 6px",borderRadius:4},children:\`Case: \${caseSize} Pcs\`}),
                      r.unit&&S.jsx("div",{style:{background:"#F4F6F5",color:C.muted,fontSize:9.5,fontWeight:700,padding:"2px 6px",borderRadius:4},children:r.unit})
                    ]
                  })
                ]
              })
            ]
          }),
          caseSize>0?S.jsxs("div",{
            style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:2},
            children:[
              S.jsxs("div",{
                style:{display:"flex",flexDirection:"column",gap:4},
                children:[
                  S.jsx("span",{style:{fontSize:10,fontWeight:700,color:C.muted,textAlign:"center"},children:"CASES"}),
                  S.jsxs("div",{
                    style:{display:"flex",alignItems:"center",justifyContent:"space-between",border:\`1px solid \${C.border}\`,borderRadius:24,padding:"2px 4px",background:"#F8F9FA"},
                    children:[
                      S.jsx("button",{
                        onClick:()=>h(Math.max(0,cases-1)*caseSize+pcs),
                        style:{width:24,height:24,borderRadius:"50%",border:\`1px solid \${C.border}\`,background:"#fff",color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,cursor:cases>0?"pointer":"default"},
                        children:"-"
                      }),
                      S.jsx("input",{
                        value:cInput,
                        onChange:e=>{const valStr=e.target.value;setCInput(valStr);const val=parseInt(valStr)||0;h(val*caseSize+pcs)},
                        style:{width:30,textAlign:"center",border:"none",background:"transparent",fontSize:13,fontWeight:700,color:C.text,outline:"none",fontFamily:"'Plus Jakarta Sans', sans-serif"},
                        placeholder:"0"
                      }),
                      S.jsx("button",{
                        onClick:()=>h((cases+1)*caseSize+pcs),
                        style:{width:24,height:24,borderRadius:"50%",background:C.primary,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,cursor:"pointer",border:"none"},
                        children:"+"
                      })
                    ]
                  })
                ]
              }),
              S.jsxs("div",{
                style:{display:"flex",flexDirection:"column",gap:4},
                children:[
                  S.jsx("span",{style:{fontSize:10,fontWeight:700,color:C.muted,textAlign:"center"},children:"PIECES"}),
                  S.jsxs("div",{
                    style:{display:"flex",alignItems:"center",justifyContent:"space-between",border:\`1px solid \${C.border}\`,borderRadius:24,padding:"2px 4px",background:"#F8F9FA"},
                    children:[
                      S.jsx("button",{
                        onClick:()=>h(cases*caseSize+Math.max(0,pcs-1)),
                        style:{width:24,height:24,borderRadius:"50%",border:\`1px solid \${C.border}\`,background:"#fff",color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,cursor:pcs>0?"pointer":"default"},
                        children:"-"
                      }),
                      S.jsx("input",{
                        value:pInput,
                        onChange:e=>{const valStr=e.target.value;setPInput(valStr);const val=parseInt(valStr)||0;h(cases*caseSize+val)},
                        style:{width:30,textAlign:"center",border:"none",background:"transparent",fontSize:13,fontWeight:700,color:C.text,outline:"none",fontFamily:"'Plus Jakarta Sans', sans-serif"},
                        placeholder:"0"
                      }),
                      S.jsx("button",{
                        onClick:()=>h(cases*caseSize+pcs+1),
                        style:{width:24,height:24,borderRadius:"50%",background:C.primary,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,cursor:"pointer",border:"none"},
                        children:"+"
                      })
                    ]
                  })
                ]
              })
            ]
          }):S.jsxs("div",{
            style:{display:"flex",flexDirection:"column",gap:4,marginTop:2},
            children:[
              S.jsx("span",{style:{fontSize:10,fontWeight:700,color:C.muted,textAlign:"center"},children:"PIECES"}),
              S.jsxs("div",{
                style:{display:"flex",alignItems:"center",justifyContent:"space-between",border:\`1px solid \${C.border}\`,borderRadius:24,padding:"2px 4px",background:"#F8F9FA",width:"100%"},
                children:[
                  S.jsx("button",{
                    onClick:()=>h(Math.max(0,a-1)),
                    style:{width:24,height:24,borderRadius:"50%",border:\`1px solid \${C.border}\`,background:"#fff",color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,cursor:a>0?"pointer":"default"},
                    children:"-"
                  }),
                  S.jsx("input",{
                    value:f,
                    onChange:e=>{y(e.target.value);const val=parseInt(e.target.value)||0;h(val)},
                    style:{width:30,textAlign:"center",border:"none",background:"transparent",fontSize:13,fontWeight:700,color:C.text,outline:"none",fontFamily:"'Plus Jakarta Sans', sans-serif"},
                    placeholder:"0"
                  }),
                  S.jsx("button",{
                    onClick:()=>h(a+1),
                    style:{width:24,height:24,borderRadius:"50%",background:C.primary,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,cursor:"pointer",border:"none"},
                    children:"+"
                  })
                ]
              })
            ]
          }),
          S.jsxs("button",{
            onClick:()=>h(a>0?a:(caseSize>0?caseSize:1)),
            style:{width:"100%",background:C.primary,color:"#fff",borderRadius:24,padding:"10px",fontWeight:700,fontSize:13.5,display:"flex",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer",border:"none",marginTop:4},
            children:[
              ct.bag,
              S.jsx("span",{children:a>0?\`Added: \${a} Pcs\`:"Add to Basket"})
            ]
          }),
          hasTiers&&S.jsxs("details",{
            style:{cursor:"pointer",fontSize:11,color:C.accent,marginTop:4,marginBottom:6,background:C.accentLight,padding:"6px 10px",borderRadius:8,border:\`1px solid \${C.border}\`,transition:"all 0.2s"},
            children:[
              S.jsxs("summary",{
                style:{fontWeight:700,outline:"none",listStyle:"none",display:"flex",alignItems:"center",justifyContent:"space-between",userSelect:"none"},
                children:[
                  S.jsx("span",{children:"🏷️ View Tier Pricing"}),
                  S.jsx("span",{style:{fontSize:9},children:"▼"})
                ]
              }),
              S.jsx("div",{
                style:{marginTop:6,paddingTop:6,borderTop:\`1px dashed \${C.accent}\`,fontWeight:600,color:C.accent},
                children:\`1–\${r.tier2_min_qty-1} \${r.unit||"pcs"}: ₹\${basePrice} | \${r.tier2_min_qty}+ \${r.unit||"pcs"}: ₹\${r.tier2_price}\`
              })
            ]
          })
        ]
      });
    }`;
    content = content.substring(0, tRange.start) + newTCode + content.substring(tRange.end);
    console.log(`Replaced t_ function in ${file}`);
  } else {
    console.log(`Failed to find t_ function in ${file}`);
  }

  // --- REWRITE n_ ---
  const nRange = findFunctionRange(content, 'n_');
  if (nRange) {
    const oldNCode = content.substring(nRange.start, nRange.end);
    // Find where the return statement starts inside n_
    const returnIdx = oldNCode.indexOf('return S.jsxs(S.Fragment');
    if (returnIdx !== -1) {
      // Keep everything in n_ BEFORE the return statement, and replace the return statement to match the new design
      const nPre = oldNCode.substring(0, returnIdx);
      const newNReturn = `return S.jsxs(S.Fragment,{
        children:[
          S.jsxs("div",{
            style:{background:C.card,borderRadius:16,padding:16,boxShadow:"0 4px 12px rgba(0,0,0,0.05)",border:\`1.5px solid \${totalQty>0?C.primary:C.border}\`,position:"relative",display:"flex",flexDirection:"column",gap:12,margin:6,cursor:"pointer"},
            children:[
              S.jsx("div",{
                style:{position:"absolute",top:0,right:0,background:"#FEB23D",color:"#5C4308",fontWeight:700,fontSize:10,padding:"4px 10px",borderRadius:"0 16px 0 16px"},
                children:\`\${marginStr}% MARGIN\`
              }),
              S.jsxs("div",{
                onClick:()=>setIsOpen(true),
                style:{display:"flex",gap:12,alignItems:"flex-start"},
                children:[
                  S.jsx("div",{style:{width:74,height:74,borderRadius:12,background:"#F4F6F5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0},children:getProductThumbnail(r)}),
                  S.jsxs("div",{
                    style:{display:"flex",flexDirection:"column",flex:1,minWidth:0},
                    children:[
                      S.jsx("div",{style:{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.5},children:r.brand||"MCVITIE'S"}),
                      S.jsx("div",{style:{fontSize:14,fontWeight:800,color:C.text,marginTop:1,lineHeight:1.2,wordBreak:"break-word"},children:r.name}),
                      S.jsxs("div",{
                        style:{display:"flex",alignItems:"baseline",gap:6,marginTop:4},
                        children:[
                          S.jsx("span",{style:{fontSize:17,fontWeight:800,color:C.accent},children:un(r.tp*(1-disc/100))}),
                          r.mrp>0&&S.jsx("span",{style:{fontSize:11.5,color:C.muted,textDecoration:"line-through"},children:un(r.mrp)})
                        ]
                      }),
                      S.jsxs("div",{
                        style:{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"},
                        children:[
                          r.cp>0&&S.jsx("div",{style:{background:"#F4F6F5",color:C.muted,fontSize:9.5,fontWeight:700,padding:"2px 6px",borderRadius:4},children:\`Cost: \${un(r.cp)}\`}),
                          caseSize>0&&S.jsx("div",{style:{background:"#F4F6F5",color:C.muted,fontSize:9.5,fontWeight:700,padding:"2px 6px",borderRadius:4},children:\`Case: \${caseSize} Pcs\`})
                        ]
                      })
                    ]
                  })
                ]
              }),
              S.jsxs("div",{
                onClick:()=>setIsOpen(true),
                style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:2},
                children:[
                  S.jsxs("div",{
                    style:{display:"flex",flexDirection:"column",gap:4},
                    children:[
                      S.jsx("span",{style:{fontSize:10,fontWeight:700,color:C.muted,textAlign:"center"},children:"CASES"}),
                      S.jsxs("div",{
                        style:{display:"flex",alignItems:"center",justifyContent:"space-between",border:\`1px solid \${C.border}\`,borderRadius:24,padding:"2px 4px",background:"#F8F9FA"},
                        children:[
                          S.jsx("button",{style:{width:24,height:24,borderRadius:"50%",border:\`1px solid \${C.border}\`,background:"#fff",color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700},children:"-"}),
                          S.jsx("div",{style:{fontSize:13,fontWeight:700,color:C.text},children:caseSize>0?Math.floor(totalQty/caseSize):0}),
                          S.jsx("button",{style:{width:24,height:24,borderRadius:"50%",background:C.primary,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,border:"none"},children:"+"})
                        ]
                      })
                    ]
                  }),
                  S.jsxs("div",{
                    style:{display:"flex",flexDirection:"column",gap:4},
                    children:[
                      S.jsx("span",{style:{fontSize:10,fontWeight:700,color:C.muted,textAlign:"center"},children:r.unit||"PIECES"}),
                      S.jsxs("div",{
                        style:{display:"flex",alignItems:"center",justifyContent:"space-between",border:\`1px solid \${C.border}\`,borderRadius:24,padding:"2px 4px",background:"#F8F9FA"},
                        children:[
                          S.jsx("button",{style:{width:24,height:24,borderRadius:"50%",border:\`1px solid \${C.border}\`,background:"#fff",color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700},children:"-"}),
                          S.jsx("div",{style:{fontSize:13,fontWeight:700,color:C.text},children:caseSize>0?totalQty%caseSize:totalQty}),
                          S.jsx("button",{style:{width:24,height:24,borderRadius:"50%",background:C.primary,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,border:"none"},children:"+"})
                        ]
                      })
                    ]
                  })
                ]
              }),
              S.jsxs("button",{
                onClick:()=>setIsOpen(true),
                style:{width:"100%",background:C.primary,color:"#fff",borderRadius:24,padding:"10px",fontWeight:700,fontSize:13.5,display:"flex",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer",border:"none",marginTop:4},
                children:[
                  ct.bag,
                  S.jsx("span",{children:totalQty>0?\`Added: \${totalQty} Pcs\`:"Add to Basket"})
                ]
              })
            ]
          }),
          isOpen&&S.jsxs("div",{
            style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99999,padding:16,backdropFilter:"blur(4px)"},
            onClick:()=>setIsOpen(false),
            children:[
              S.jsxs("div",{
                style:{background:"#fff",borderRadius:16,width:"100%",maxWidth:480,maxHeight:"85vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.04)",overflow:"hidden"},
                onClick:e=>e.stopPropagation(),
                children:[
                  S.jsxs("div",{
                    style:{padding:"16px 20px",borderBottom:\`1.5px solid \${C.border}\`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.primaryLight},
                    children:[
                      S.jsxs("div",{
                        style:{display:"flex",alignItems:"center",gap:12},
                        children:[
                          S.jsx("div",{style:{width:36,height:36,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20},children:getProductThumbnail(r)}),
                          S.jsxs("div",{
                            children:[
                              S.jsx("div",{style:{fontSize:15,fontWeight:800,color:C.text},children:r.name}),
                              S.jsx("div",{style:{fontSize:12,color:C.muted},children:r.unit})
                            ]
                          })
                        ]
                      }),
                      S.jsx("button",{
                        onClick:()=>setIsOpen(false),
                        style:{border:"none",background:"transparent",fontSize:22,cursor:"pointer",color:C.muted},
                        children:"×"
                      })
                    ]
                  }),
                  S.jsx("div",{
                    style:{padding:20,overflowY:"auto",display:"flex",flexDirection:"column",gap:16},
                    children:activeBatches.length>0?activeBatches.map(b=>{
                      const bKey=\`\${r.id}_\${b.bchcode}\`;
                      const bQty=a[bKey]||0;
                      return S.jsxs("div",{
                        style:{background:"#f8fafc",borderRadius:12,padding:12,border:\`1.5px solid \${bQty>0?C.green:C.border}\`},
                        children:[
                          S.jsx(b_,{p:r,b:b,bKey:bKey,qty:bQty,onInc:s,onDec:l,onSet:h,discMap:T,setDiscMap:x},b.bchcode)
                        ]
                      },b.bchcode);
                    }):S.jsx("div",{
                      style:{background:"#f8fafc",borderRadius:12,padding:12,border:\`1.5px solid \${C.border}\`},
                      children:[
                        S.jsx(b_,{p:r,b:{batch:"Default",mrp:r.mrp,stock:r.stock},bKey:\`\${r.id}_0\`,qty:a[\`\${r.id}_0\`]||a[r.id]||0,onInc:s,onDec:l,onSet:h,discMap:T,setDiscMap:x})
                      ]
                    })
                  }),
                  S.jsxs("div",{
                    style:{padding:"16px 20px",borderTop:\`1.5px solid \${C.border}\`,display:"flex",alignItems:"center",justifyContent:"space-between",background:"#f8fafc"},
                    children:[
                      S.jsxs("div",{
                        style:{display:"flex",flexDirection:"column"},
                        children:[
                          S.jsx("span",{style:{fontSize:12,color:C.muted},children:"Selected Subtotal"}),
                          S.jsx("span",{style:{fontSize:18,fontWeight:800,color:C.primary},children:un(totalVal)})
                        ]
                      }),
                      S.jsx("button",{
                        onClick:()=>setIsOpen(false),
                        style:{background:C.primary,color:"#fff",border:"none",borderRadius:10,padding:"10px 24px",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 12px rgba(20,83,45,0.25)"},
                        children:"Done"
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      });`;
      const newNCode = nPre + newNReturn + '}';
      content = content.substring(0, nRange.start) + newNCode + content.substring(nRange.end);
      console.log(`Replaced n_ function in ${file}`);
    } else {
      console.log(`Failed to find return statement inside n_ function in ${file}`);
    }
  } else {
    console.log(`Failed to find n_ function in ${file}`);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Wrote changes to ${file}`);
});
