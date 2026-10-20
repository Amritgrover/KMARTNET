// ========================================================================
// KMART NET — Vision SQL Products & Images Catalog Exporter
// Fetches FMCG products from Vision SQL accounting software,
// cleans product names, downloads web images, and creates a multi-tab
// Excel workbook with embedded preview thumbnails.
// ========================================================================

const fs = require('fs');
const path = require('path');
const sql = require('mssql');
const ExcelJS = require('exceljs');
const sharp = require('sharp');
const { buildCatalogHtml } = require('./template-catalog');

const CONFIG = {
  sqlServer: {
    server: 'localhost',
    database: 'D:\\VISIONSQL\\DATA\\C001\\C00103\\WINDATA.MDF',
    user: 'sa',
    password: 'kmart@123',
    requestTimeout: 60000,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
  // Export destination folder on Desktop
  outputDir: 'C:\\Users\\Amritpal Singh\\Desktop\\Vision_Products_Export',
  customImagesDir: 'C:\\Users\\Amritpal Singh\\Desktop\\Vision_Products_Export\\custom_images',
  excelFilename: 'Vision_Products_Catalog.xlsx',
  // Manufacturers to export: 3 = McVities, 4 = Reckitt Benckiser, 5 = Sleepy Owl, 6 = Marico
  targetCoCodes: [3, 4, 5, 6],
};

function log(msg) {
  console.log(`[Catalog Export] [${new Date().toLocaleTimeString('en-IN')}] ${msg}`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Find user-uploaded custom photo in custom_images directory
function findCustomImage(customImagesDir, itcode) {
  if (!fs.existsSync(customImagesDir)) return null;
  try {
    const files = fs.readdirSync(customImagesDir);
    const pattern = new RegExp(`^${itcode}(?:[._-].*)?$`, 'i');
    for (const file of files) {
      if (pattern.test(file)) {
        const fullPath = path.join(customImagesDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          const buf = fs.readFileSync(fullPath);
          const ext = getImageExtension(buf);
          if (ext) {
            return { filePath: fullPath, extension: ext, buffer: buf, filename: file };
          }
        }
      }
    }
  } catch (e) {}
  return null;
}

// ========================================================================
// 1. SMART PRODUCT NAME CLEANER & QUERY BUILDER
// ========================================================================
function cleanProductName(manufacturer, rawName) {
  let name = (rawName || '').trim();
  const mfrUpper = (manufacturer || '').toUpperCase();

  // Strip leading single-letter prefixes like "A.", "B.", "C.", "D.", "M.", "Z."
  name = name.replace(/^[A-Z]\.\s*/i, '');

  // Strip case pack multipliers like "1*24PC", "1*6", "1*12 PCS", "(16*453.75G)", "(SET OF 10)"
  name = name.replace(/\(\d+\*\d+(?:\.\d+)?(?:G|GM|ML|KG)?\)/gi, '');
  name = name.replace(/\b\d+\s*\*\s*\d+\s*(?:PCS?|PC)?\b/gi, '');
  name = name.replace(/\(SET OF \d+\)/gi, '');

  // Strip price tags like "10/-", "99/-", "599/-", "RS10", "1/-", "7/-", "254.59/-"
  name = name.replace(/\b\d+(?:\.\d+)?\/-/g, '');
  name = name.replace(/\bRS\s*\d+\b/gi, '');

  let brandPrefix = '';

  // --- RECKITT BENCKISER (Dettol, Harpic, Lizol, Air Wick, Durex, Cherry Blossom) ---
  if (mfrUpper.includes('REKITT') || mfrUpper.includes('RECKITT')) {
    if (/^Z\.RE$/i.test(name.trim())) {
      return { clean: 'Reckitt Product Sample', query: 'Reckitt Benckiser product' };
    }
    name = name.replace(/\bCHB LIQ BLK\b/gi, 'Cherry Blossom Liquid Shoe Polish Black');
    name = name.replace(/\bCHARRY SHOE SHINER BLACK\b/gi, 'Cherry Blossom Shoe Shiner Polish Black');
    name = name.replace(/\bCHARRY SHOE SHINER\b/gi, 'Cherry Blossom Shoe Shiner Polish');
    name = name.replace(/\bDETOL\b/gi, 'Dettol');
    name = name.replace(/\bAIR WIK\b/gi, 'Air Wick Room Freshener Spray');
    name = name.replace(/\bANTISAPTIK LIQ\b/gi, 'Dettol Antiseptic Liquid');
    name = name.replace(/\bANTISEPTIC\b/gi, 'Dettol Antiseptic Liquid');
    name = name.replace(/\bREKITT ANT\b/gi, 'Dettol Antiseptic Liquid');
    name = name.replace(/\bHRP RED ULTRA\b/gi, 'Harpic Red Ultra Bathroom Cleaner');
    name = name.replace(/\bLYS BCL\b/gi, 'Lizol Disinfectant Surface Floor Cleaner');
    name = name.replace(/\bHAND WASH FOAMING STWB\b/gi, 'Dettol Foaming Handwash Strawberry');
    name = name.replace(/\bHAND WASH FOAMING ALOE COCO\b/gi, 'Dettol Foaming Handwash Aloe Vera & Coconut');
    name = name.replace(/\bDETOL KITCHEN LIME\b/gi, 'Dettol Kitchen Gel Lime');
    name = name.replace(/\bDUREX EXTRA TIME\b/gi, 'Durex Extra Time Condom');
    name = name.replace(/\bORG\b/gi, 'Original');
    name = name.replace(/\bSKC\b/gi, 'Skincare');

    if (!/dettol|harpic|lizol|cherry blossom|air wick|durex/i.test(name)) {
      brandPrefix = 'Dettol ';
    }
  }

  // --- MARICO (Parachute, Saffola, Mediker) ---
  else if (mfrUpper.includes('MARICO')) {
    name = name.replace(/\bSARSO\b/gi, 'Parachute Advansed Mustard Sarson Hair Oil');
    name = name.replace(/\bJASMINE\b/gi, 'Parachute Advansed Jasmine Hair Oil');
    name = name.replace(/\bAMLA\b/gi, 'Parachute Advansed Amla Hair Oil');
    name = name.replace(/\bALMOND\b/gi, 'Parachute Advansed Almond Hair Oil');
    name = name.replace(/\bALOE VERA\b/gi, 'Parachute Advansed Aloe Vera Hair Oil');
    name = name.replace(/\bPARACHUTE\b/gi, 'Parachute Advansed');
    name = name.replace(/\bPARA SHMP\b/gi, 'Parachute Advansed Coconut Milk Shampoo');
    name = name.replace(/\bMEDICARE SHAMPOO\b/gi, 'Mediker Anti Lice Shampoo');
    name = name.replace(/\bVEGGIE TWIST\b/gi, 'Saffola Masala Oats Veggie Twist');
    name = name.replace(/\bPEPPY TAMATO\b/gi, 'Saffola Masala Oats Peppy Tomato');
    name = name.replace(/\bCLASSIC MASALA\b/gi, 'Saffola Masala Oats Classic Masala');
    name = name.replace(/\bSOYA CHUNKS\b/gi, 'Saffola Mealmaker Soya Chunks');
    name = name.replace(/\bSOYA MINI CHUNKS\b/gi, 'Saffola Mealmaker Soya Mini Chunks');
    name = name.replace(/\bDANDRUF\b/gi, 'Anti Dandruff');
    name = name.replace(/Parachute Advansed\s+Parachute Advansed/gi, 'Parachute Advansed');

    if (!/parachute|saffola|mediker/i.test(name)) {
      brandPrefix = 'Parachute ';
    }
  }

  // --- SLEEPY OWL ---
  else if (mfrUpper.includes('SLEEPY OWL')) {
    name = name.replace(/\bCOFEE\b/gi, 'Coffee');
    name = name.replace(/\bHAZLENUT\b/gi, 'Hazelnut');
    name = name.replace(/\bXPRESSO\b/gi, 'Espresso');
    name = name.replace(/\bORGINAL\b/gi, 'Original');
    name = name.replace(/\bPREMIX CAPPUCCINO\b/gi, 'Instant Premix Cappuccino');
    name = name.replace(/\bCOFFEE ASSORTED\b/gi, 'Coffee Assorted Pack');
    brandPrefix = 'Sleepy Owl ';
  }

  // --- MCVITIES ---
  else if (mfrUpper.includes('MC VITTIES') || mfrUpper.includes('MCVITIES')) {
    name = name.replace(/\bCASHIEW\b/gi, 'Cashew');
    name = name.replace(/\bBUTER\b/gi, 'Butter');
    name = name.replace(/\bWHOLEWHEAT MARIE\b/gi, 'Wholewheat Marie Biscuits');
    name = name.replace(/\bHOBONO\b/gi, 'Hobnob');
    name = name.replace(/\bFESTIVE PACK\b/gi, 'Festive Biscuits Gift Pack');
    brandPrefix = "McVitie's ";
  }

  let fullName = (brandPrefix + name).replace(/\s+/g, ' ').trim();
  let query = fullName + ' product India';
  return { clean: fullName, query };
}

// Format canonical sheet name
function getSheetName(coname) {
  const upper = coname.toUpperCase();
  if (upper.includes('REKITT') || upper.includes('RECKITT')) return 'Reckitt Benckiser (Dettol)';
  if (upper.includes('MARICO')) return 'Marico';
  if (upper.includes('SLEEPY OWL')) return 'Sleepy Owl';
  if (upper.includes('MC VITTIES') || upper.includes('MCVITIES')) return "McVitie's";
  return coname.substring(0, 30);
}

// Format safe folder name
function getSafeFolderName(coname) {
  const upper = coname.toUpperCase();
  if (upper.includes('REKITT') || upper.includes('RECKITT')) return 'Reckitt_Dettol';
  if (upper.includes('MARICO')) return 'Marico';
  if (upper.includes('SLEEPY OWL')) return 'Sleepy_Owl';
  if (upper.includes('MC VITTIES') || upper.includes('MCVITIES')) return 'McVities';
  return coname.replace(/[^a-zA-Z0-9_]/g, '_');
}

// Check if buffer is valid JPEG or PNG
function getImageExtension(buf) {
  if (!buf || buf.length < 8) return null;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  return null;
}

// ========================================================================
// 2. WEB IMAGE SEARCH & DOWNLOADER (Bing Images with Fallback)
// ========================================================================
async function searchWebImages(query) {
  try {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    const html = await res.text();
    const matches = [...html.matchAll(/murl&quot;:&quot;(http[^&]+?\.(?:jpg|jpeg|png))/gi)].map((m) => m[1]);
    if (matches.length > 0) return matches;
  } catch (err) {
    // continue to fallback
  }

  // Fallback to DuckDuckGo if needed
  try {
    const vqdUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
    const vqdRes = await fetch(vqdUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    const html = await vqdRes.text();
    const match = html.match(/vqd=([0-9-]+)&/);
    if (match) {
      const vqd = match[1];
      const imgApiUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,;&p=1`;
      const res = await fetch(imgApiUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      const data = await res.json();
      if (data && Array.isArray(data.results)) {
        return data.results.map((r) => r.image).filter(Boolean);
      }
    }
  } catch (err) {}

  return [];
}

async function downloadFirstValidImage(candidates, targetFilePath) {
  for (const url of candidates.slice(0, 5)) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      clearTimeout(timeout);

      if (!res.ok) continue;
      const arrayBuf = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      const ext = getImageExtension(buffer);

      if (ext) {
        const finalPath = targetFilePath.endsWith('.jpg') ? targetFilePath : targetFilePath + '.' + ext;
        fs.writeFileSync(finalPath, buffer);
        return { success: true, filePath: finalPath, url, extension: ext, buffer };
      }
    } catch (e) {
      // try next candidate
    }
  }
  return { success: false };
}

// ========================================================================
// 3. STATIC HTML WEB CATALOG GENERATOR (MOBILE-FIRST + CART + WHATSAPP)
// ========================================================================
async function generateStaticHtmlCatalog(processedItems, outputDir) {
  log('Generating self-contained offline web catalog with embedded optimized packshots...');

  const webProducts = await Promise.all(
    processedItems.map(async (p) => {
      let relPath = null;
      let imageBase64 = null;

      if (p.imageInfo && p.imageInfo.filePath && fs.existsSync(p.imageInfo.filePath)) {
        const safeFolder = getSafeFolderName(p.mfrName);
        relPath = `./product_images/${safeFolder}/${path.basename(p.imageInfo.filePath)}`;

        try {
          const buf = p.imageInfo.buffer || fs.readFileSync(p.imageInfo.filePath);
          // Optimize packshot thumbnail: max 280x280 inside, quality 80 JPEG
          const thumbBuf = await sharp(buf)
            .resize(280, 280, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80, mozjpeg: true })
            .toBuffer();
          imageBase64 = `data:image/jpeg;base64,${thumbBuf.toString('base64')}`;
        } catch (thumbErr) {
          try {
            const fallbackBuf = p.imageInfo.buffer || fs.readFileSync(p.imageInfo.filePath);
            const ext = p.imageInfo.extension || 'jpg';
            const mime = ext === 'png' ? 'image/png' : (ext === 'webp' ? 'image/webp' : 'image/jpeg');
            imageBase64 = `data:${mime};base64,${fallbackBuf.toString('base64')}`;
          } catch (e) {
            imageBase64 = null;
          }
        }
      }

      return {
        itcode: p.itcode,
        mfr: p.mfrName,
        rawName: p.rawName,
        cleanName: p.cleanName,
        pack: p.pack,
        unit: p.unit,
        mrp: p.mrp,
        saleRate: p.saleRate,
        imageRelPath: relPath,
        imageBase64: imageBase64,
      };
    })
  );

  const html = buildCatalogHtml(webProducts);


  const indexPath = path.join(outputDir, 'index.html');
  const jsonPath = path.join(outputDir, 'products.json');

  fs.writeFileSync(indexPath, html, 'utf8');
  const jsonProducts = webProducts.map(({ imageBase64, ...rest }) => rest);
  fs.writeFileSync(jsonPath, JSON.stringify(jsonProducts, null, 2), 'utf8');

  log('📱 Generated Mobile Web Catalog & WhatsApp Ordering Portal:');
  log(`   🌐 ${indexPath}`);
  log(`   📦 ${jsonPath}`);
}

// ========================================================================
// 4. MAIN RUN PIPELINE
// ========================================================================

async function main() {
  log('===========================================================');
  log('Starting Vision SQL FMCG Catalog & Image Export Pipeline...');
  log('===========================================================');

  // Ensure output directories exist
  const outputImagesDir = path.join(CONFIG.outputDir, 'product_images');
  fs.mkdirSync(outputImagesDir, { recursive: true });
  fs.mkdirSync(CONFIG.customImagesDir, { recursive: true });

  // Create instructions file in custom_images directory if not present
  const howToPath = path.join(CONFIG.customImagesDir, 'HOW_TO_ADD_CUSTOM_IMAGES.txt');
  if (!fs.existsSync(howToPath)) {
    const howToText = `====================================================================
KMART — HOW TO ADD CUSTOM PRODUCT PHOTOS
====================================================================
To use your own photo for any product instead of an internet image:

1. Name the photo file starting with the Product Item Code (ITCODE):
   - Example for Dettol Soap 150g (Item Code 506):
     Save file as: 506.jpg   (or 506.png, or 506_dettol.jpg)
   - Example for Parachute Jasmine 190ml (Item Code 554):
     Save file as: 554.jpg   (or 554_parachute.jpg)
   - Example for Sleepy Owl Hazelnut Jar (Item Code 490):
     Save file as: 490.jpg   (or 490_sleepy_owl.png)

2. Drop your photo file right here in this "custom_images" folder.

3. Double-click "Run-Catalog-Export.bat" on your Desktop.

The exporter will automatically detect your photo, use it with top
priority, and update both your Excel spreadsheet and the Web Catalog!
====================================================================`;
    fs.writeFileSync(howToPath, howToText, 'utf8');
  }

  let pool;
  try {
    // 1. Connect to SQL Server
    log('Connecting to Vision SQL Server database...');
    pool = await sql.connect(CONFIG.sqlServer);
    log('✅ Successfully connected to Vision SQL Server.');

    // 2. Fetch active items for the target manufacturers
    const itemsResult = await pool.request().query(`
      SELECT 
        i.ITCODE, 
        c.COCODE, 
        c.CONAME, 
        i.ITNAME, 
        i.MRP, 
        i.PRICERET, 
        i.NCPAGST,
        i.PACK1, 
        i.UNIT, 
        i.BARCODE, 
        i.HSNCODE
      FROM item i 
      JOIN CO_MASTER c ON i.COCODE = c.COCODE 
      WHERE i.COCODE IN (${CONFIG.targetCoCodes.join(',')})
        AND i.ITCODE > 0
        AND i.ITNAME IS NOT NULL
        AND LTRIM(RTRIM(i.ITNAME)) != ''
      ORDER BY c.COCODE, i.ITNAME
    `);

    const items = itemsResult.recordset || [];
    log(`Fetched ${items.length} items across target manufacturers.`);

    // 3. Fetch batch pricing from Batch_master to ensure latest active MRP/rates
    const batchResult = await pool.request().query(`
      SELECT ITCODE, BCHCODE, BATCH, MRP, PRICERET, NCPAGST
      FROM Batch_master
      WHERE ITCODE > 0
    `);

    const batchMap = new Map();
    (batchResult.recordset || []).forEach((b) => {
      if (!batchMap.has(b.ITCODE)) batchMap.set(b.ITCODE, []);
      batchMap.get(b.ITCODE).push(b);
    });

    log(`Retrieved pricing batches for ${batchMap.size} items from Batch_master.`);

    // 4. Process items, clean names, and fetch images
    log('Beginning product image fetching and normalization...');
    const processedItems = [];

    for (let i = 0; i < items.length; i++) {
      const itm = items[i];
      const itcode = itm.ITCODE;
      const mfrName = itm.CONAME.trim();
      const rawName = itm.ITNAME.trim();

      // Resolve pricing with active batch fallback
      const batches = batchMap.get(itcode) || [];
      const activeBatch = batches.sort((a, b) => (b.BCHCODE || 0) - (a.BCHCODE || 0))[0];

      const mrp = activeBatch && parseFloat(activeBatch.MRP) > 0 ? parseFloat(activeBatch.MRP) : (parseFloat(itm.MRP) || 0);
      const saleRate = activeBatch && parseFloat(activeBatch.PRICERET) > 0 ? parseFloat(activeBatch.PRICERET) : (parseFloat(itm.PRICERET) || 0);
      const costPrice = activeBatch && parseFloat(activeBatch.NCPAGST) > 0 ? parseFloat(activeBatch.NCPAGST) : (parseFloat(itm.NCPAGST) || 0);

      const { clean, query } = cleanProductName(mfrName, rawName);

      // Safe local filename
      const safeFolder = getSafeFolderName(mfrName);
      const mfrDir = path.join(outputImagesDir, safeFolder);
      fs.mkdirSync(mfrDir, { recursive: true });

      const safeBaseName = `${itcode}_${clean.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40)}`;
      const targetImagePath = path.join(mfrDir, `${safeBaseName}.jpg`);

      let imageInfo = { downloaded: false, filePath: null, url: '', extension: null };

      // 1. Check for custom user-uploaded photo in custom_images (Top Priority)
      const customImg = findCustomImage(CONFIG.customImagesDir, itcode);
      if (customImg) {
        const customTarget = path.join(mfrDir, `${safeBaseName}.${customImg.extension}`);
        fs.copyFileSync(customImg.filePath, customTarget);
        imageInfo = {
          downloaded: true,
          filePath: customTarget,
          url: 'Custom User Photo (' + customImg.filename + ')',
          extension: customImg.extension,
          buffer: customImg.buffer,
          isCustom: true,
        };
        log(`[${i + 1}/${items.length}] 🌟 Using CUSTOM user photo for [${mfrName}]: "${customImg.filename}"`);
      }
      // 2. Otherwise check if image already exists locally from previous internet run
      else if (fs.existsSync(targetImagePath)) {
        const existingBuf = fs.readFileSync(targetImagePath);
        const ext = getImageExtension(existingBuf);
        if (ext) {
          imageInfo = { downloaded: true, filePath: targetImagePath, url: 'Cached Locally', extension: ext, buffer: existingBuf };
        }
      }

      // If not yet downloaded, search online
      if (!imageInfo.downloaded) {
        log(`[${i + 1}/${items.length}] Searching image for [${mfrName}]: "${clean}"...`);
        const candidates = await searchWebImages(query);
        if (candidates.length > 0) {
          const downloadRes = await downloadFirstValidImage(candidates, targetImagePath);
          if (downloadRes.success) {
            imageInfo = {
              downloaded: true,
              filePath: downloadRes.filePath,
              url: downloadRes.url,
              extension: downloadRes.extension,
              buffer: downloadRes.buffer,
            };
            log(`   ✅ Downloaded (${imageInfo.extension.toUpperCase()}): ${path.basename(downloadRes.filePath)}`);
          } else {
            log(`   ⚠️ Failed to download valid JPG/PNG from candidates.`);
          }
        } else {
          log(`   ⚠️ No image results returned.`);
        }
        // Polite delay
        await delay(250);
      } else {
        log(`[${i + 1}/${items.length}] Using existing cached image for: "${clean}"`);
      }

      processedItems.push({
        itcode,
        cocode: itm.COCODE,
        mfrName,
        rawName,
        cleanName: clean,
        pack: itm.PACK1 || 1,
        unit: (itm.UNIT || 'PCS').trim(),
        mrp,
        saleRate,
        costPrice,
        barcode: (itm.BARCODE || '').trim(),
        hsn: (itm.HSNCODE || '').trim(),
        imageInfo,
      });
    }

    const downloadedCount = processedItems.filter((p) => p.imageInfo.downloaded).length;
    log(`Image fetch complete! Successfully acquired images for ${downloadedCount} of ${processedItems.length} products (${Math.round((downloadedCount / processedItems.length) * 100)}%).`);

    // ========================================================================
    // 5. GENERATE MULTI-TAB EXCEL WORKBOOK WITH EMBEDDED THUMBNAILS
    // ========================================================================
    log('Generating formatted Excel workbook with embedded preview thumbnails...');
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'KMART NET - Vision Accounting Bridge';
    workbook.lastModifiedBy = 'Antigravity AI';
    workbook.created = new Date();

    // Group items by manufacturer for individual tabs
    const groups = new Map();
    processedItems.forEach((item) => {
      const sheetName = getSheetName(item.mfrName);
      if (!groups.has(sheetName)) groups.set(sheetName, []);
      groups.get(sheetName).push(item);
    });

    // Helper to format a worksheet
    function populateSheet(sheet, sheetItems) {
      sheet.views = [{ state: 'frozen', ySplit: 1 }];

      sheet.columns = [
        { header: 'Preview', key: 'thumbnail', width: 13 },
        { header: 'Vision Item Name', key: 'raw_name', width: 36 },
        { header: 'Clean Product Name', key: 'clean_name', width: 42 },
        { header: 'MRP (₹)', key: 'mrp', width: 15 },
        { header: 'Sale Rate (₹)', key: 'sale_rate', width: 15 },
        // Hidden metadata columns for 2-Build-Web-Catalog.bat
        { header: 'Item Code', key: 'itcode', width: 10, hidden: true },
        { header: 'Brand', key: 'mfr', width: 15, hidden: true },
        { header: 'Pack', key: 'pack', width: 10, hidden: true },
        { header: 'Unit', key: 'unit', width: 10, hidden: true },
        { header: 'Image Path', key: 'image_path', width: 30, hidden: true },
      ];

      // Style Header Row
      const headerRow = sheet.getRow(1);
      headerRow.height = 30;
      headerRow.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1B4332' }, // Forest Green Brand Color
      };

      sheetItems.forEach((itm, idx) => {
        const rowIndex = idx + 2;
        const row = sheet.addRow({
          thumbnail: '',
          raw_name: itm.rawName,
          clean_name: itm.cleanName,
          mrp: itm.mrp,
          sale_rate: itm.saleRate,
          itcode: itm.itcode,
          mfr: itm.mfrName,
          pack: itm.pack || 1,
          unit: itm.unit || 'PCS',
          image_path: itm.imageInfo && itm.imageInfo.filePath ? itm.imageInfo.filePath : '',
        });

        row.height = 56;
        row.alignment = { vertical: 'middle', horizontal: 'left' };

        // Zebra striping
        const isEven = rowIndex % 2 === 0;
        const bgColor = isEven ? 'FFF9FBF9' : 'FFFFFFFF';
        for (let c = 1; c <= 5; c++) {
          const cell = row.getCell(c);
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE2E7E4' } },
            bottom: { style: 'thin', color: { argb: 'FFE2E7E4' } },
            left: { style: 'thin', color: { argb: 'FFE2E7E4' } },
            right: { style: 'thin', color: { argb: 'FFE2E7E4' } },
          };
        }

        // Number formats for currency
        row.getCell('mrp').numFmt = '₹#,##0.00';
        row.getCell('mrp').alignment = { vertical: 'middle', horizontal: 'right' };
        row.getCell('sale_rate').numFmt = '₹#,##0.00';
        row.getCell('sale_rate').alignment = { vertical: 'middle', horizontal: 'right' };

        // Embed Thumbnail Image
        if (itm.imageInfo.downloaded && itm.imageInfo.filePath && itm.imageInfo.extension) {
          try {
            const imageId = workbook.addImage({
              filename: itm.imageInfo.filePath,
              extension: itm.imageInfo.extension,
            });

            sheet.addImage(imageId, {
              tl: { col: 0.15, row: rowIndex - 1 + 0.08 },
              ext: { width: 52, height: 52 },
              editAs: 'oneCell',
            });
          } catch (embedErr) {
            // gracefully skip image embed if corrupted
          }
        }
      });

      // Enable auto-filter
      sheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: 5 },
      };
    }

    // 1. Master Tab: All FMCG Products
    const allSheet = workbook.addWorksheet('All FMCG Products');
    populateSheet(allSheet, processedItems);

    // 2. Individual Tabs per Manufacturer
    for (const [sheetName, sheetItems] of groups.entries()) {
      const mfrSheet = workbook.addWorksheet(sheetName);
      populateSheet(mfrSheet, sheetItems);
    }

    const excelOutputPath = path.join(CONFIG.outputDir, CONFIG.excelFilename);
    let finalSavedPath = excelOutputPath;
    try {
      await workbook.xlsx.writeFile(excelOutputPath);
    } catch (saveErr) {
      if (saveErr.code === 'EBUSY') {
        const altFilename = 'Vision_Products_Catalog_Updated.xlsx';
        finalSavedPath = path.join(CONFIG.outputDir, altFilename);
        log(`⚠️ '${CONFIG.excelFilename}' is currently open in Excel. Saving as '${altFilename}' instead...`);
        await workbook.xlsx.writeFile(finalSavedPath);
      } else {
        throw saveErr;
      }
    }

    log(`🎉 SUCCESS! Excel Catalog saved to:`);
    log(`   📁 ${finalSavedPath}`);
    log(`Images saved in:`);
    log(`   📁 ${outputImagesDir}`);

    const isStep1Only = process.argv.includes('--excel-only') || !process.argv.includes('--with-web');
    if (!isStep1Only) {
      // Generate Mobile-First Static Web Catalog & WhatsApp Ordering Portal directly
      await generateStaticHtmlCatalog(processedItems, CONFIG.outputDir);
    } else {
      log('');
      log('===========================================================');
      log('✅ STEP 1 COMPLETE: Excel Catalog generated successfully!');
      log(`   📁 File: ${finalSavedPath}`);
      log('-----------------------------------------------------------');
      log('📋 NEXT STEPS FOR CURATION:');
      log('   1. Open Vision_Products_Catalog.xlsx on your Desktop.');
      log('   2. Review products. Delete any rows you do NOT want.');
      log('      (You can also edit Clean Product Names or Sale Rates).');
      log('   3. Save and close Excel.');
      log('   4. Run "2-Build-Web-Catalog.bat" to generate index.html.');
      log('===========================================================');
    }
  } catch (err) {
    log(`❌ Fatal Pipeline Error: ${err.message}`);
    console.error(err);
  } finally {
    if (pool) await pool.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  main,
  generateStaticHtmlCatalog,
  getSafeFolderName,
  findCustomImage,
  CONFIG,
};
