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

  // Look for master tab "All FMCG Products", fallback to first sheet
  const worksheet = workbook.getWorksheet('All FMCG Products') || workbook.worksheets[0];
  if (!worksheet) {
    log(`❌ Error: No worksheets found in Excel file!`);
    process.exit(1);
  }

  log(`📋 Found worksheet: "${worksheet.name}" with ${worksheet.rowCount} total rows.`);

  const curatedItems = [];
  let rowIndex = 0;

  worksheet.eachRow((row, rowNumber) => {
    rowIndex++;
    // Skip header row
    if (rowNumber === 1) return;

    // Col 2: Vision Item Name
    // Col 3: Clean Product Name
    // Col 4: MRP
    // Col 5: Sale Rate
    // Col 6: Item Code (hidden metadata)
    // Col 7: Brand (hidden metadata)
    // Col 8: Pack (hidden metadata)
    // Col 9: Unit (hidden metadata)
    // Col 10: Image Path (hidden metadata)
    const rawName = parseText(row.getCell(2).value);
    const cleanName = parseText(row.getCell(3).value);
    const mrp = parseNumeric(row.getCell(4).value);
    const saleRate = parseNumeric(row.getCell(5).value);

    // Skip blank or invalid rows
    if (!rawName && !cleanName) return;

    const itcodeVal = parseText(row.getCell(6).value);
    const itcode = itcodeVal ? parseInt(itcodeVal, 10) : rowNumber;
    const mfrName = parseText(row.getCell(7).value) || 'FMCG';
    const pack = parseInt(parseText(row.getCell(8).value), 10) || 1;
    const unit = parseText(row.getCell(9).value) || 'PCS';
    let imagePath = parseText(row.getCell(10).value);

    let imageInfo = { downloaded: false, filePath: null, extension: null, buffer: null };

    // 1. Check for custom user-uploaded photo in custom_images (Top Priority)
    const customImg = findCustomImage(CONFIG.customImagesDir, itcode);
    if (customImg) {
      imageInfo = {
        downloaded: true,
        filePath: customImg.filePath,
        extension: customImg.extension,
        buffer: customImg.buffer,
        isCustom: true,
      };
    }
    // 2. Otherwise check if imagePath exists on disk
    else if (imagePath && fs.existsSync(imagePath)) {
      try {
        const buf = fs.readFileSync(imagePath);
        const ext = path.extname(imagePath).replace('.', '').toLowerCase() || 'jpg';
        imageInfo = { downloaded: true, filePath: imagePath, extension: ext, buffer: buf };
      } catch (err) {}
    }
    // 3. Fallback search by item code in product_images
    else {
      const foundPath = findCachedImageByItcode(itcode, mfrName);
      if (foundPath && fs.existsSync(foundPath)) {
        try {
          const buf = fs.readFileSync(foundPath);
          const ext = path.extname(foundPath).replace('.', '').toLowerCase() || 'jpg';
          imageInfo = { downloaded: true, filePath: foundPath, extension: ext, buffer: buf };
        } catch (err) {}
      }
    }

    curatedItems.push({
      itcode,
      mfrName,
      rawName: rawName || cleanName,
      cleanName: cleanName || rawName,
      pack,
      unit,
      mrp,
      saleRate,
      imageInfo,
    });
  });

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
