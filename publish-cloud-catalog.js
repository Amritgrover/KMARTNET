// ========================================================================
// KMART NET — Step 4: Publish & Sync Catalog to Cloud (GitHub CDN)
// Reads curated Vision_Products_Catalog.xlsx, compresses packshots to Base64,
// builds catalog_sync.json, and pushes to GitHub repository.
// Salesmen apps will automatically sync the updated catalog over-the-air!
// ========================================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ExcelJS = require('exceljs');
const sharp = require('sharp');
const { findCustomImage, getSafeFolderName, CONFIG } = require('./export-catalog');

function log(msg) {
  console.log(`[Cloud Sync Publisher] [${new Date().toLocaleTimeString('en-IN')}] ${msg}`);
}

function parseNumeric(val) {
  if (typeof val === 'number') return val;
  if (typeof val === 'object' && val !== null) {
    if (typeof val.result === 'number') return val.result;
    if (typeof val.result === 'string') return parseFloat(val.result.replace(/[^0-9.]/g, '')) || 0;
  }
  if (typeof val === 'string') {
    return parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
  }
  return 0;
}

function parseText(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'object' && val.richText) {
    return val.richText.map((t) => t.text).join('').trim();
  }
  return String(val).trim();
}

function findCachedImageByItcode(itcode, mfrName) {
  const safeFolder = getSafeFolderName(mfrName || '');
  const searchDirs = [
    path.join(CONFIG.outputDir, 'product_images', safeFolder),
    path.join(CONFIG.outputDir, 'product_images'),
  ];

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    try {
      const files = fs.readdirSync(dir, { recursive: true });
      for (const file of files) {
        const fullPath = path.isAbsolute(file) ? file : path.join(dir, file);
        if (typeof file === 'string' && (path.basename(file).startsWith(`${itcode}_`) || path.basename(file).startsWith(`${itcode}.`))) {
          return fullPath;
        }
      }
    } catch (e) {}
  }
  return null;
}

async function publishCatalog() {
  log('===========================================================');
  log('Preparing Over-The-Air (OTA) Cloud Catalog Sync Bundle...');
  log('===========================================================');

  const excelPath = path.join(CONFIG.outputDir, CONFIG.excelFilename);
  const altExcelPath = path.join(CONFIG.outputDir, 'Vision_Products_Catalog_Updated.xlsx');
  let targetExcel = excelPath;

  if (!fs.existsSync(targetExcel)) {
    if (fs.existsSync(altExcelPath)) {
      targetExcel = altExcelPath;
    } else {
      log(`⚠️ Excel catalog not found at: ${excelPath}`);
      log(`Checking fallback products.json...`);
    }
  }

  let items = [];

  if (fs.existsSync(targetExcel)) {
    log(`📖 Loading Excel catalog: ${targetExcel}`);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(targetExcel);

    // Map to hold merged products: key = itcode
    const itemsMap = new Map();

    // 0. Load baseline products.json to detect exactly which sheet the user edited
    const baselineMap = new Map();
    const baselineJsonPath = path.join(CONFIG.outputDir, 'products.json');
    if (fs.existsSync(baselineJsonPath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(baselineJsonPath, 'utf8'));
        for (const p of raw) {
          baselineMap.set(p.itcode, p);
        }
      } catch (e) {}
    }

    // 1. First pass: read "All FMCG Products" as master baseline
    const masterSheet = workbook.getWorksheet('All FMCG Products') || workbook.worksheets[0];
    if (masterSheet) {
      log(`📋 Loading master catalog from "${masterSheet.name}"...`);
      masterSheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const rawName = parseText(row.getCell(2).value);
        const cleanName = parseText(row.getCell(3).value);
        const mrp = parseNumeric(row.getCell(4).value);
        const saleRate = parseNumeric(row.getCell(5).value);
        if (!rawName && !cleanName) return;

        const itcodeVal = parseText(row.getCell(6).value);
        const itcode = itcodeVal ? parseInt(itcodeVal, 10) : rowNumber;
        const mfrName = parseText(row.getCell(7).value) || 'FMCG';
        const pack = parseInt(parseText(row.getCell(8).value), 10) || 1;
        const unit = parseText(row.getCell(9).value) || 'PCS';
        let imagePath = parseText(row.getCell(10).value);

        const base = baselineMap.get(itcode);
        const masterEdited = base && (
          (base.mrp !== undefined && base.mrp !== mrp) ||
          (base.saleRate !== undefined && base.saleRate !== saleRate) ||
          (base.cleanName && cleanName && base.cleanName !== cleanName)
        );

        if (masterEdited) {
          log(`   ✏️ Detected user edit on master sheet "${masterSheet.name}": [${itcode}] "${rawName}" -> MRP: ₹${base.mrp} -> ₹${mrp}, Rate: ₹${base.saleRate} -> ₹${saleRate}`);
        }

        itemsMap.set(itcode, {
          itcode,
          mfr: mfrName,
          rawName: rawName || cleanName,
          name: cleanName || rawName,
          pack,
          unit,
          mrp,
          saleRate,
          imagePath,
          masterEdited: !!masterEdited,
        });
      });
    }

    // 2. Second pass: scan brand worksheets only for intentional brand tab edits
    let overridesCount = 0;
    workbook.eachSheet((ws) => {
      if (ws.name === 'All FMCG Products') return;
      ws.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const itcodeVal = parseText(row.getCell(6).value);
        const itcode = itcodeVal ? parseInt(itcodeVal, 10) : null;
        if (!itcode) return;

        const rawName = parseText(row.getCell(2).value);
        const cleanName = parseText(row.getCell(3).value);
        const mrp = parseNumeric(row.getCell(4).value);
        const saleRate = parseNumeric(row.getCell(5).value);
        const pack = parseInt(parseText(row.getCell(8).value), 10) || 1;
        const unit = parseText(row.getCell(9).value) || 'PCS';
        const imagePath = parseText(row.getCell(10).value);
        const mfrName = parseText(row.getCell(7).value) || ws.name;

        const base = baselineMap.get(itcode);

        if (itemsMap.has(itcode)) {
          const existing = itemsMap.get(itcode);

          // If the master sheet was already edited by user, Master Tab ALWAYS wins!
          if (existing.masterEdited) {
            return;
          }

          // Check if brand sheet has an intentional edit different from baseline
          const brandEdited = base ? (
            (base.mrp !== undefined && base.mrp !== mrp) ||
            (base.saleRate !== undefined && base.saleRate !== saleRate) ||
            (base.cleanName && cleanName && base.cleanName !== cleanName)
          ) : (existing.mrp !== mrp || existing.saleRate !== saleRate);

          if (brandEdited) {
            log(`   ✏️ Override from brand sheet "${ws.name}": [${itcode}] "${rawName}" -> MRP: ₹${existing.mrp} -> ₹${mrp}, Rate: ₹${existing.saleRate} -> ₹${saleRate}`);
            existing.mrp = mrp;
            existing.saleRate = saleRate;
            if (cleanName) existing.name = cleanName;
            existing.pack = pack || existing.pack;
            existing.unit = unit || existing.unit;
            if (imagePath) existing.imagePath = imagePath;
            overridesCount++;
          }
        } else {
          itemsMap.set(itcode, {
            itcode,
            mfr: mfrName,
            rawName: rawName || cleanName,
            name: cleanName || rawName,
            pack,
            unit,
            mrp,
            saleRate,
            imagePath,
          });
        }
      });
    });

    if (overridesCount > 0) {
      log(`🎯 Successfully merged ${overridesCount} user edits from brand worksheets!`);
    }

    // 3. Resolve images and compile items list
    for (const item of itemsMap.values()) {
      let imageBuf = null;

      // 1. Custom user photo
      const customImg = findCustomImage(CONFIG.customImagesDir, item.itcode);
      if (customImg && customImg.buffer) {
        imageBuf = customImg.buffer;
      }
      // 2. Explicit image path from Excel
      else if (item.imagePath && fs.existsSync(item.imagePath)) {
        try { imageBuf = fs.readFileSync(item.imagePath); } catch (e) {}
      }
      // 3. Fallback search by itcode in product_images
      if (!imageBuf) {
        const found = findCachedImageByItcode(item.itcode, item.mfr);
        if (found && fs.existsSync(found)) {
          try { imageBuf = fs.readFileSync(found); } catch (e) {}
        }
      }

      items.push({
        itcode: item.itcode,
        mfr: item.mfr,
        rawName: item.rawName,
        name: item.name,
        pack: item.pack,
        unit: item.unit,
        mrp: item.mrp,
        saleRate: item.saleRate,
        rawImageBuffer: imageBuf,
      });
    }
  } else {
    // Fallback to products.json if Excel not generated yet
    const fallbackJsonPath = path.join(CONFIG.outputDir, 'products.json');
    if (!fs.existsSync(fallbackJsonPath)) {
      throw new Error('Neither Excel catalog nor products.json was found on Desktop!');
    }
    log(`📖 Loading fallback JSON: ${fallbackJsonPath}`);
    const rawItems = JSON.parse(fs.readFileSync(fallbackJsonPath, 'utf8'));
    for (const p of rawItems) {
      let imageBuf = null;
      const found = findCachedImageByItcode(p.itcode, p.mfr);
      if (found && fs.existsSync(found)) {
        try { imageBuf = fs.readFileSync(found); } catch (e) {}
      }
      items.push({
        itcode: p.itcode,
        mfr: p.mfr,
        rawName: p.rawName || p.name,
        name: p.cleanName || p.name,
        pack: p.pack || 1,
        unit: p.unit || 'PCS',
        mrp: p.mrp || 0,
        saleRate: p.saleRate || 0,
        rawImageBuffer: imageBuf,
      });
    }
  }

  log(`🎯 Total curated products to sync: ${items.length}`);
  log(`Compressing packshots into offline Base64 thumbnails...`);

  const processedProducts = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let imageBase64 = null;

    if (item.rawImageBuffer) {
      try {
        const thumbBuf = await sharp(item.rawImageBuffer)
          .resize(280, 280, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80, mozjpeg: true })
          .toBuffer();
        imageBase64 = `data:image/jpeg;base64,${thumbBuf.toString('base64')}`;
      } catch (err) {
        // Fallback to raw buffer if sharp fails
        imageBase64 = `data:image/jpeg;base64,${item.rawImageBuffer.toString('base64')}`;
      }
    }

    processedProducts.push({
      itcode: item.itcode,
      mfr: item.mfr,
      rawName: item.rawName,
      name: item.name,
      pack: item.pack,
      unit: item.unit,
      mrp: item.mrp,
      saleRate: item.saleRate,
      imageBase64: imageBase64,
    });
  }

  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const version = `v${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}.${pad(now.getHours())}${pad(now.getMinutes())}`;
  const timestampStr = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) + ' ' + now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const syncPayload = {
    version: version,
    timestamp: timestampStr,
    totalProducts: processedProducts.length,
    whatsappNumber: '919877570829',
    products: processedProducts,
  };

  const syncJsonPath = path.join(__dirname, 'catalog_sync.json');
  fs.writeFileSync(syncJsonPath, JSON.stringify(syncPayload), 'utf8');

  // Also copy to desktop export folder
  const desktopSyncPath = path.join(CONFIG.outputDir, 'catalog_sync.json');
  fs.writeFileSync(desktopSyncPath, JSON.stringify(syncPayload), 'utf8');

  const fileSizeMb = (fs.statSync(syncJsonPath).size / (1024 * 1024)).toFixed(2);
  log(`✅ Generated catalog_sync.json:`);
  log(`   📦 Version: ${version}`);
  log(`   📅 Date: ${timestampStr}`);
  log(`   📊 Products: ${processedProducts.length}`);
  log(`   💾 Bundle Size: ${fileSizeMb} MB`);

  const noPush = process.argv.includes('--no-push') || process.argv.includes('--dry-run');
  if (noPush) {
    log(`ℹ️ [DRY RUN / NO PUSH] Skipping git push to GitHub.`);
    return;
  }

  log('');
  log('===========================================================');
  log('Pushing catalog_sync.json to GitHub repository...');
  log('===========================================================');

  try {
    const gitDir = __dirname;
    execSync('git add catalog_sync.json', { cwd: gitDir, stdio: 'inherit' });
    
    // Commit only if changes exist
    try {
      execSync(`git commit -m "chore(catalog): update cloud catalog ${version}"`, { cwd: gitDir, stdio: 'inherit' });
    } catch (commitErr) {
      log(`ℹ️ No changes detected in catalog_sync.json compared to last commit.`);
    }

    log(`🚀 Uploading to GitHub: https://github.com/Amritgrover/KMARTNET.git ...`);
    execSync('git push origin master', { cwd: gitDir, stdio: 'inherit' });

    log('');
    log('===========================================================');
    log('🎉 SUCCESS! CATALOG PUBLISHED TO CLOUD CDN!');
    log(`   Version: ${version}`);
    log(`   CDN URL: https://raw.githubusercontent.com/Amritgrover/KMARTNET/master/catalog_sync.json`);
    log('-----------------------------------------------------------');
    log('📱 All salesmen opening their KMART FMCG app will now');
    log('   automatically update to these newest prices and products!');
    log('===========================================================');
  } catch (gitErr) {
    log(`❌ Git push failed: ${gitErr.message}`);
    log('You can still manually run "git push origin master" inside kmartnet folder.');
    throw gitErr;
  }
}

if (require.main === module) {
  publishCatalog().catch((err) => {
    console.error(`Fatal publisher error:`, err);
    process.exit(1);
  });
}

module.exports = { publishCatalog };
