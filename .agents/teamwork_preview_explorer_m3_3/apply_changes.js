const fs = require('fs');
const path = require('path');

const jsPath1 = path.resolve(__dirname, '../../dist/assets/index-DYXXu0wA.js');
const jsPath2 = path.resolve(__dirname, '../../dist/assets/index-D0CI6L84.js');
const cssPath = path.resolve(__dirname, '../../dist/assets/index-BiACt3m9.css');

const jsContent = fs.readFileSync(jsPath1, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');

const snippetI = fs.readFileSync(path.resolve(__dirname, 'snippet_i_.js'), 'utf8').trim();
const snippetProfileModal = fs.readFileSync(path.resolve(__dirname, 'snippet_profile_modal.js'), 'utf8').trim();
const snippetBottomNav = fs.readFileSync(path.resolve(__dirname, 'snippet_bottom_nav.js'), 'utf8').trim();
const snippetCss = fs.readFileSync(path.resolve(__dirname, 'snippet_css.css'), 'utf8').trim();

const replacements = [
  // 1. Header Button - Salesman Logout
  {
    name: 'Salesman Logout Header Button Class',
    search: 'r==="salesman"&&S.jsxs("button",{',
    replace: 'r==="salesman"&&S.jsxs("button",{className:"desktop-only-btn",',
  },
  // 2. Header Button - Customer Profile
  {
    name: 'Customer Profile Header Button Class',
    search: 'r==="customer"&&cust&&S.jsxs("button",{',
    replace: 'r==="customer"&&cust&&S.jsxs("button",{className:"desktop-only-btn",',
  },
  // 3. Header Button - Cart Button
  {
    name: 'Cart Header Button Class',
    search: '(r==="salesman"||r==="customer")&&S.jsxs("button",{',
    replace: '(r==="salesman"||r==="customer")&&S.jsxs("button",{className:"desktop-only-btn",',
  },
  // 4. Category Filter Pill Bar Component definition i_
  {
    name: 'Category Pill Bar Component Definition',
    search: 'function i_({categories:r,active:a,onChange:s}){return S.jsx("div",{style:{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none",WebkitOverflowScrolling:"touch"},children:r.map(l=>S.jsx("button",{onClick:()=>s(l),style:{padding:"6px 14px",borderRadius:20,border:`1.5px solid \${a===l?C.primary:C.border}\`,background:a===l?C.primary:"#fff",color:a===l?"#fff":C.muted,fontSize:12.5,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"\'Outfit\', sans-serif",transition:"all 0.15s",flexShrink:0},children:[\$r(l)?\$r(l)+" ":"",getCleanCat(l)]},l))})}',
    replace: snippetI,
  },
  // 5. Category Component Usage 1 (Customer/Salesman Catalogue Filter)
  {
    name: 'Category Filter Customer/Salesman Usage',
    search: 'S.jsx(i_,{categories:Pe,active:g,onChange:l=>{m(l),setSelectedBrand("All")}})',
    replace: 'S.jsx(i_,{categories:Pe,active:g,products:s,onChange:l=>{m(l),setSelectedBrand("All")}})',
  },
  // 6. Category Component Usage 2 (Admin Catalogue Filter)
  {
    name: 'Category Filter Admin Usage',
    search: 'S.jsx(i_,{categories:Pe,active:adminCatFilter,onChange:setAdminCatFilter})',
    replace: 'S.jsx(i_,{categories:Pe,active:adminCatFilter,products:s,onChange:setAdminCatFilter})',
  },
  // 7. Customer/Salesman Profile Modal overlay
  {
    name: 'Profile Modal Overlay & Salesman Details Integration',
    replace_full_segment: true,
    startTarget: 'showCustProfile&&S.jsxs(S.Fragment,',
    endTarget: 'showCustOrders&&S.jsxs(S.Fragment,',
    replace: snippetProfileModal,
  },
  // 8. Mobile Bottom Navigation bar insertion at JSX end
  {
    name: 'Mobile Bottom Navigation Insertion',
    search: `                      S.jsx("button", {
                        onClick: () => setEditingOrder(null),
                        style: { flex: 1, padding: "10px 0", background: C.bg, color: C.muted, border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
                        children: "Cancel"
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}`,
    replace: snippetBottomNav,
  }
];

function applyToContent(content, filepath) {
  let updatedContent = content;
  for (const rep of replacements) {
    if (rep.replace_full_segment) {
      const sIdx = updatedContent.indexOf(rep.startTarget);
      const eIdx = updatedContent.indexOf(rep.endTarget);
      if (sIdx === -1 || eIdx === -1) {
        console.error(`ERROR: Segment targets not found for: ${rep.name}`);
        process.exit(1);
      }
      const oldSegment = updatedContent.slice(sIdx, eIdx);
      updatedContent = updatedContent.replace(oldSegment, rep.replace);
    } else {
      const firstIdx = updatedContent.indexOf(rep.search);
      if (firstIdx === -1) {
        console.error(`ERROR: Target not found for: ${rep.name} in ${filepath}`);
        process.exit(1);
      }
      const lastIdx = updatedContent.lastIndexOf(rep.search);
      if (firstIdx !== lastIdx) {
        console.error(`ERROR: Target not unique for: ${rep.name} in ${filepath}`);
        process.exit(1);
      }
      updatedContent = updatedContent.replace(rep.search, rep.replace);
    }
  }
  return updatedContent;
}

console.log('Applying changes to index-DYXXu0wA.js...');
const updatedJs1 = applyToContent(jsContent, 'index-DYXXu0wA.js');
fs.writeFileSync(jsPath1, updatedJs1, 'utf8');
console.log('SUCCESS: Written index-DYXXu0wA.js');

console.log('Applying changes to index-D0CI6L84.js...');
const jsContent2 = fs.readFileSync(jsPath2, 'utf8');
const updatedJs2 = applyToContent(jsContent2, 'index-D0CI6L84.js');
fs.writeFileSync(jsPath2, updatedJs2, 'utf8');
console.log('SUCCESS: Written index-D0CI6L84.js');

console.log('Appending CSS additions to index-BiACt3m9.css...');
const updatedCss = cssContent + '\n' + snippetCss;
fs.writeFileSync(cssPath, updatedCss, 'utf8');
console.log('SUCCESS: Written index-BiACt3m9.css');

console.log('All changes successfully applied to workspace files!');
