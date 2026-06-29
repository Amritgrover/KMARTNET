const fs = require('fs');

const files = [
  'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-DYXXu0wA.js',
  'c:/Users/Amritpal Singh/Downloads/kmartnet/kmartnet/dist/assets/index-D0CI6L84.js'
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`${file} does not exist.`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');
  console.log(`\n=== Patching Warehouse Stock Display in (Normalized): ${file} ===`);

  // Normalize CRLF to LF
  content = content.replace(/\r\n/g, '\n');

  // Target 1: Admin Card Warehouse Stock
  const target1 = `      }),(()=> {
        const cs = parseInt(r.cs) || 0;
        const activeBatches = (r.product_batches || []).filter(b => b.stock > 0 && b.bchcode > 0);
        const formatStock = (stockVal) => {
          return cs > 0 ? \`\${Math.floor(stockVal / cs)} Cs & \${stockVal % cs} Pcs\` : \`\${stockVal} Pcs\`;
        };
        if (activeBatches.length > 0) {
          return S.jsxs("div", {
            style: { background: C.greenBg, border: \`1px solid \${C.green}33\`, borderRadius: 10, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 },
            children: [
              S.jsxs("div", {
                style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: \`1.2px solid \${C.green}22\`, paddingBottom: 4, marginBottom: 2 },
                children: [
                  S.jsx("span", { style: { fontSize: 12, fontWeight: 700, color: C.muted }, children: "Current Warehouse Stock" }),
                  S.jsx("span", { style: { fontSize: 15.5, fontWeight: 900, color: "#000" }, children: formatStock(r.stock) })
                ]
              }),`;

  const replacement1 = `      }),(()=> {
        const cs = parseInt(r.cs) || 0;
        const activeBatches = (r.product_batches || []).filter(b => b.stock > 0 && b.bchcode > 0);
        const totalActiveStock = activeBatches.reduce((sum, b) => sum + b.stock, 0);
        const formatStock = (stockVal) => {
          return cs > 0 ? \`\${Math.floor(stockVal / cs)} Cs & \${stockVal % cs} Pcs\` : \`\${stockVal} Pcs\`;
        };
        if (activeBatches.length > 0) {
          return S.jsxs("div", {
            style: { background: C.greenBg, border: \`1px solid \${C.green}33\`, borderRadius: 10, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 },
            children: [
              S.jsxs("div", {
                style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: \`1.2px solid \${C.green}22\`, paddingBottom: 4, marginBottom: 2 },
                children: [
                  S.jsx("span", { style: { fontSize: 12, fontWeight: 700, color: C.muted }, children: "Current Warehouse Stock" }),
                  S.jsx("span", { style: { fontSize: 15.5, fontWeight: 900, color: "#000" }, children: formatStock(totalActiveStock) })
                ]
              }),`;

  if (content.includes(target1)) {
    content = content.replace(target1, replacement1);
    console.log('Patch 1 (Admin Card Stock): Success');
  } else {
    console.log('Patch 1 (Admin Card Stock): Target not found!');
  }

  // Target 2: Admin Modal Warehouse Stock
  const target2 = `  const cs = parseInt(ee.cs) || 0;
  const activeBatches = (ee.product_batches || []).filter(b => b.stock > 0 && b.bchcode > 0);
  const formatStock = (stockVal) => {
    return cs > 0 ? \`\${Math.floor(stockVal / cs)} Cs & \${stockVal % cs} Pcs\` : \`\${stockVal} Pcs\`;
  };
  if (activeBatches.length > 0) {
    return S.jsxs("div", {
      style: { marginBottom: 18, background: C.greenBg, border: \`1px solid \${C.green}33\`, borderRadius: 10, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 },
      children: [
        S.jsxs("div", {
          style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: \`1.2px solid \${C.green}22\`, paddingBottom: 4, marginBottom: 2 },
          children: [
            S.jsx("span", { style: { fontSize: 13, fontWeight: 700, color: C.muted }, children: "Current Warehouse Stock" }),
            S.jsx("span", { style: { fontSize: 15.5, fontWeight: 900, color: "#000" }, children: formatStock(ee.stock) })
          ]
        }),`;

  const replacement2 = `  const cs = parseInt(ee.cs) || 0;
  const activeBatches = (ee.product_batches || []).filter(b => b.stock > 0 && b.bchcode > 0);
  const totalActiveStock = activeBatches.reduce((sum, b) => sum + b.stock, 0);
  const formatStock = (stockVal) => {
    return cs > 0 ? \`\${Math.floor(stockVal / cs)} Cs & \${stockVal % cs} Pcs\` : \`\${stockVal} Pcs\`;
  };
  if (activeBatches.length > 0) {
    return S.jsxs("div", {
      style: { marginBottom: 18, background: C.greenBg, border: \`1px solid \${C.green}33\`, borderRadius: 10, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 },
      children: [
        S.jsxs("div", {
          style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: \`1.2px solid \${C.green}22\`, paddingBottom: 4, marginBottom: 2 },
          children: [
            S.jsx("span", { style: { fontSize: 13, fontWeight: 700, color: C.muted }, children: "Current Warehouse Stock" }),
            S.jsx("span", { style: { fontSize: 15.5, fontWeight: 900, color: "#000" }, children: formatStock(totalActiveStock) })
          ]
        }),`;

  if (content.includes(target2)) {
    content = content.replace(target2, replacement2);
    console.log('Patch 2 (Admin Modal Stock): Success');
  } else {
    console.log('Patch 2 (Admin Modal Stock): Target not found!');
  }

  fs.writeFileSync(file, content, 'utf8');
});
