// ========================================================================
// KMART NET — Step 2: Build Web Catalog from Curated Excel Spreadsheet
// Reads the edited Vision_Products_Catalog.xlsx, filters to remaining rows,
// loads packshots/custom images, and builds the standalone index.html.
// ========================================================================

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { generateStaticHtmlCatalog, findCustomImage, getSafeFolderName, CONFIG } = require('./export-catalog');

function log(msg) {
  console.log(`[Web Catalog Builder] [${new Date().toLocaleTimeString('en-IN')}] ${msg}`);
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

// Find cached image in product_images folder by item code if path missing
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

async function buildFromExcel() {
  log('===========================================================');
  log('Reading curated products from Vision_Products_Catalog.xlsx...');
  log('===========================================================');

  const excelPath = path.join(CONFIG.outputDir, CONFIG.excelFilename);
  const altExcelPath = path.join(CONFIG.outputDir, 'Vision_Products_Catalog_Updated.xlsx');
  let targetExcel = excelPath;

  if (!fs.existsSync(targetExcel)) {
    if (fs.existsSync(altExcelPath)) {
      targetExcel = altExcelPath;
    } else {
      log(`❌ Error: Excel catalog file not found at:`);
      log(`   ${excelPath}`);
      log(`Please run "1-Export-Excel-Catalog.bat" first!`);
      process.exit(1);
    }
  }

  log(`📖 Loading: ${targetExcel}`);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(targetExcel);

  // Map to hold merged products: key = itcode
  const itemsMap = new Map();

  // 0. Load baseline products.json to detect user edits
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

  // 1. First pass: read "All FMCG Products" as baseline
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
        mfrName,
        rawName: rawName || cleanName,
        cleanName: cleanName || rawName,
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

        // If master was edited by user, Master Tab ALWAYS wins!
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
          if (cleanName) existing.cleanName = cleanName;
          existing.pack = pack || existing.pack;
          existing.unit = unit || existing.unit;
          if (imagePath) existing.imagePath = imagePath;
          overridesCount++;
        }
      } else {
        itemsMap.set(itcode, {
          itcode,
          mfrName,
          rawName: rawName || cleanName,
          cleanName: cleanName || rawName,
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

  const curatedItems = [];
  for (const item of itemsMap.values()) {
    let imageInfo = { downloaded: false, filePath: null, extension: null, buffer: null };

    // 1. Custom user photo
    const customImg = findCustomImage(CONFIG.customImagesDir, item.itcode);
    if (customImg) {
      imageInfo = {
        downloaded: true,
        filePath: customImg.filePath,
        extension: customImg.extension,
        buffer: customImg.buffer,
        isCustom: true,
      };
    }
    // 2. Explicit image path
    else if (item.imagePath && fs.existsSync(item.imagePath)) {
      try {
        const buf = fs.readFileSync(item.imagePath);
        const ext = path.extname(item.imagePath).replace('.', '').toLowerCase() || 'jpg';
        imageInfo = { downloaded: true, filePath: item.imagePath, extension: ext, buffer: buf };
      } catch (err) {}
    }
    // 3. Fallback search by itcode
    else {
      const foundPath = findCachedImageByItcode(item.itcode, item.mfrName);
      if (foundPath && fs.existsSync(foundPath)) {
        try {
          const buf = fs.readFileSync(foundPath);
          const ext = path.extname(foundPath).replace('.', '').toLowerCase() || 'jpg';
          imageInfo = { downloaded: true, filePath: foundPath, extension: ext, buffer: buf };
        } catch (err) {}
      }
    }

    curatedItems.push({
      itcode: item.itcode,
      mfrName: item.mfrName,
      rawName: item.rawName,
      cleanName: item.cleanName,
      pack: item.pack,
      unit: item.unit,
      mrp: item.mrp,
      saleRate: item.saleRate,
      imageInfo,
    });
  }

  log(`🎯 Total curated products to include in Web Catalog: ${curatedItems.length}`);
  if (curatedItems.length === 0) {
    log(`⚠️ Warning: No valid products found in the spreadsheet!`);
    return;
  }

  // Generate the standalone, self-contained index.html with embedded Base64 photos
  await generateStaticHtmlCatalog(curatedItems, CONFIG.outputDir);

  log('===========================================================');
  log(`🎉 SUCCESS! Mobile Web Catalog generated with ${curatedItems.length} curated products!`);
  log(`   🌐 File: ${path.join(CONFIG.outputDir, 'index.html')}`);
  log(`   📱 100% Standalone & Offline (Embedded Base64 Packshots)`);
  log(`   📲 WhatsApp Destination: +91 98775 70829`);
  log('===========================================================');
}

if (require.main === module) {
  buildFromExcel().catch((err) => {
    log(`❌ Fatal Error: ${err.message}`);
    console.error(err);
  });
}

module.exports = { buildFromExcel };
