// ============================================================
// KMART → Vision Bridge (Customer Orders Only)
// Runs on billing PC — polls Supabase, inserts into Vision
// ============================================================

const sql = require('mssql');
const { createClient } = require('@supabase/supabase-js');

// ============================================================
// CONFIG
// ============================================================
const CONFIG = {
  supabase: {
    url: 'https://kmfekxzkbgneqwhukgbh.supabase.co',
    serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgxNTc1OCwiZXhwIjoyMDk2MzkxNzU4fQ.AqoLdTgNGrsC1eCmKriAV1K8cPeRny4ORaT26V4Gexc',
  },
  sqlServer: {
    server: 'localhost',
    database: 'D:\\VISIONSQL\\DATA\\C001\\C00103\\WINDATA.MDF',
    user: 'sa',
    password: 'kmart@123',
    requestTimeout: 60000,
    connectionTimeout: 30000,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      trustedConnection: true,
    },
  },
  bridge: {
    pollIntervalMs: 30000,
    billSeries: '26-27T-',   // Update to '27-28T-' each April
  },
};
// ============================================================

const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.serviceRoleKey);

function log(msg) {
  console.log(`[Customer Bridge] [${new Date().toLocaleString('en-IN')}] ${msg}`);
}

async function getVisionItem(pool, itcode) {
  const result = await pool.request()
    .input('itcode', sql.Int, itcode)
    .query(`
      SELECT ITCODE, GCODE, ITNAME, MRP, PACK1, SGST, CGST, IGST, SALECODE
      FROM item WHERE ITCODE = @itcode
    `);
  return result.recordset[0] || null;
}

async function insertBillRow(pool, p) {
  const qty     = (p.pkg * p.nugs) + p.looseqty;
  const amt     = parseFloat((p.rate * qty).toFixed(2));
  const taxable = parseFloat((amt / (1 + p.taxp / 100)).toFixed(2));
  const sgstp   = p.taxp / 2;
  const cgstap  = p.taxp / 2;
  const sgsta   = parseFloat((taxable * sgstp / 100).toFixed(2));
  const cgsta   = parseFloat((taxable * cgstap / 100).toFixed(2));
  const titax   = parseFloat((sgsta + cgsta).toFixed(2));
  const nrbgst  = qty > 0 ? parseFloat((taxable / qty).toFixed(3)) : 0;
  const rcode   = `S${CONFIG.bridge.billSeries}${p.bno}`;
  const dt      = new Date(p.orderDate);

  const r = pool.request();

  r.input('UNCODE',    sql.Float,        p.uncode);
  r.input('ACCODE',    sql.Int,          p.accode);
  r.input('GCODE',     sql.Int,          p.gcode || 0);
  r.input('TAXCODE',   sql.Int,          1001);
  r.input('SMCODE',    sql.Int,          p.smcode || 0);
  r.input('CCR',       sql.Float,        0);
  r.input('ITCODE',    sql.Int,          p.itcode);
  r.input('BARCODE',   sql.NVarChar(50), String(p.itcode));
  r.input('BCHCODE',   sql.Int,          0);
  r.input('BATCH',     sql.NVarChar(50), '');
  r.input('BEXPIRY',   sql.NVarChar(50), '');
  r.input('MRP',       sql.Float,        p.mrp || 0);
  r.input('CLRCODE',   sql.Int,          0);
  r.input('CLRNAME',   sql.NVarChar(50), '');
  r.input('BLSRS',     sql.NVarChar(20), CONFIG.bridge.billSeries);
  r.input('DATE',      sql.DateTime,     dt);
  r.input('RDATE',     sql.DateTime,     dt);
  r.input('BNO',       sql.Float,        p.bno);
  r.input('DOCNO',     sql.NVarChar(20), String(p.bno));
  r.input('TYPE',      sql.NVarChar(5),  'S');
  r.input('DES',       sql.NVarChar(100),p.des || '');
  r.input('PARTICULAR',sql.NVarChar(100),'');
  r.input('GDCODE',    sql.Int,          0);
  r.input('GDCODE1',   sql.Int,          0);
  r.input('GDCODE2',   sql.Float,        0);
  r.input('LOTNO',     sql.NVarChar(20), '');
  
  r.input('PKG',       sql.Float,        p.nugs);
  r.input('NUGS',      sql.Float,        p.pkg);
  
  r.input('LOOSEQTY',  sql.Float,        p.looseqty);
  r.input('QTY',       sql.Float,        qty);
  r.input('PKGRATE',   sql.Float,        0);
  r.input('FRENUGS',   sql.Float,        0);
  r.input('LOOSEFQTY', sql.Float,        0);
  r.input('RATE',      sql.Float,        p.rate);
  r.input('AMT',       sql.Float,        amt);
  r.input('TOTQTY',    sql.Float,        qty);
  r.input('TAXP',      sql.Float,        p.taxp);
  r.input('TAXAMT',    sql.Float,        0);
  r.input('TITAX',     sql.Float,        titax);
  r.input('RATEUNIT',  sql.VarChar(20),  '');
  r.input('QTYUNIT',   sql.NVarChar(20), 'PCS');
  r.input('RMKS',      sql.NVarChar(100),'');
  r.input('WHT',       sql.Float,        0);
  r.input('WHTUNIT',   sql.NVarChar(20), '');
  r.input('ORDERNO',   sql.NVarChar(20), '');
  r.input('PAYMODE',   sql.Float,        0);
  r.input('PAYRMKS',   sql.NVarChar(50), '');
  r.input('SAL_PURCOD',sql.Int,          1);
  r.input('RCODE',     sql.NVarChar(30), rcode);
  r.input('CHALLANNO', sql.NVarChar(20), '');
  r.input('CHNSTATUS', sql.Float,        0);
  r.input('RATETYPE',  sql.NVarChar(10), 'PTR');
  r.input('TCODE',     sql.Float,        0);
  r.input('TNAME',     sql.NVarChar(50), '');
  r.input('EXPORTTYPE',sql.NVarChar(5),  'N');
  r.input('EXPORTUNO', sql.NVarChar(20), '');
  r.input('EXPORTRMKS',sql.NVarChar(50), '');
  r.input('ITRMKS',    sql.NVarChar(50), '');
  r.input('CONTROLCHNO',sql.NVarChar(20),'');
  r.input('DELYN',     sql.NVarChar(5),  '');
  r.input('widthcol',  sql.NVarChar(20), '');
  r.input('samplcol',  sql.Float,        0);
  r.input('remcol',    sql.NVarChar(20), '');
  r.input('extschp',   sql.Float,        0);
  r.input('extscha',   sql.Float,        0);
  r.input('frgtpaid',  sql.Float,        0);
  r.input('WHTPLUS',   sql.Float,        0); r.input('WHTMIN',    sql.Float, 0);
  r.input('WHTPLUSP',  sql.Float,        0); r.input('WHTMINP',   sql.Float, 0);
  r.input('COMM1ON',   sql.Float,        0); r.input('COMM1CAL',  sql.Float, 0); r.input('COMM1AMT',  sql.Float, 0);
  r.input('COMM2ON',   sql.Float,        0); r.input('COMM2CAL',  sql.Float, 0); r.input('COMM2AMT',  sql.Float, 0);
  r.input('COMMTOT',   sql.Float,        0);
  r.input('ADDDISCON', sql.Float,        0); r.input('ADDDISCCAL',sql.Float, 0); r.input('ADDDISCAMT',sql.Float, 0);
  r.input('BCOMMON',   sql.Float,        0); r.input('BCOMMCAL',  sql.Float, 0); r.input('BCOMMAMT',  sql.Float, 0);
  r.input('BCOMMADJ',  sql.Int,          0);
  r.input('pendord',   sql.Float,        0); r.input('stockinh',  sql.Float, 0); r.input('repqty',    sql.Float, 0);
  r.input('sertaxpc',  sql.Float,        0); r.input('sertaxamt', sql.Float, 0); r.input('sertaxamtI',sql.Float, 0);
  r.input('CANCELBILL',sql.NVarChar(5),  '');
  r.input('jobcode',   sql.Int,          0);
  r.input('JOBNAME',   sql.NVarChar(50), '');
  r.input('REFINISH',  sql.NVarChar(5),  '');
  r.input('PRICERET',  sql.Float,        0); r.input('ROAMT',     sql.Float, 0);
  r.input('NQTY',      sql.Float,        0); r.input('NAMT',      sql.Float, 0);
  r.input('CONRATE',   sql.Float,        0); r.input('CONP',      sql.Float, 0); r.input('CONQTY',    sql.Float, 0);
  r.input('PAYCODE',   sql.Int,          0);
  r.input('PAYNAME',   sql.VarChar(50),  '');
  r.input('PAYAMT',    sql.Float,        0);
  r.input('TOTAMT',    sql.Float,        0);
  r.input('SGSTP',     sql.Float,        sgstp);
  r.input('SGSTA',     sql.Float,        sgsta);
  r.input('CGSTP',     sql.Float,        cgstap);
  r.input('CGSTA',     sql.Float,        cgsta);
  r.input('IGSTP',     sql.Float,        0);
  r.input('IGSTA',     sql.Float,        0);
  r.input('CESSP',     sql.Float,        0);
  r.input('CESSA',     sql.Float,        0);
  r.input('VATGST',    sql.Int,          1);
  r.input('TAXABLEAMT',sql.Float,        taxable);
  r.input('CESSQ',     sql.Float,        0);
  r.input('CESSQA',    sql.Float,        0);
  r.input('RCM',       sql.NVarChar(5),  'I');
  r.input('CITCODE',   sql.Int,          0);
  r.input('CDESC',     sql.NVarChar(50), '');
  r.input('CQTY',      sql.Float,        0);
  r.input('NETRATEBGST',sql.Float,       nrbgst);
  r.input('NETRATEAGST',sql.Float,       p.rate);
  r.input('POSTCODE',  sql.Int,          p.salecode || 0);
  r.input('POSTNAME',  sql.VarChar(50),  '');
  r.input('POLISHP',   sql.Float,        0); r.input('POLISHW',   sql.Float,        0);
  r.input('DMDRATE',   sql.VarChar(20),  ''); r.input('DMDAMT',    sql.Float,        0);
  r.input('STNRATE',   sql.Float,        0); r.input('STNAMT',    sql.Float,        0);
  r.input('GLDRATE',   sql.Float,        0); r.input('GLDAMT',    sql.Float,        0);
  r.input('BALQTY',    sql.Float,        0);
  r.input('COSTRATE',  sql.Float,        0);
  r.input('RECONO',    sql.Float,        0);
  r.input('RECOYN',    sql.Bit,          0);
  r.input('INPUTMNTH', sql.DateTime,     new Date('2000-01-01'));
  r.input('POINTS',    sql.Float,        0);
  r.input('FRGTPAIDC', sql.Float,        0);
  r.input('PRLCODE',   sql.Int,          0);
  r.input('RMG1',      sql.VarChar(50),  ''); r.input('RMG2', sql.VarChar(50), '');
  r.input('RMG3',      sql.VarChar(50),  ''); r.input('RMG4', sql.VarChar(50), '');
  r.input('RMG5',      sql.VarChar(50),  '');
  r.input('LBRRATE',   sql.Float,        0);
  r.input('LBRAMT',    sql.Float,        0);

  await r.query(`
    INSERT INTO BILL (
      UNCODE,ACCODE,GCODE,TAXCODE,SMCODE,CCR,ITCODE,BARCODE,
      BCHCODE,BATCH,BEXPIRY,MRP,CLRCODE,CLRNAME,BLSRS,
      DATE,RDATE,BNO,DOCNO,TYPE,DES,PARTICULAR,
      GDCODE,GDCODE1,GDCODE2,LOTNO,
      PKG,NUGS,LOOSEQTY,QTY,PKGRATE,FRENUGS,LOOSEFQTY,
      RATE,AMT,TOTQTY,TAXP,TAXAMT,TITAX,
      RATEUNIT,QTYUNIT,RMKS,WHT,WHTUNIT,ORDERNO,PAYMODE,PAYRMKS,
      EXP1,EXP2,EXP3,EXP4,EXP5,EXP6,EXP7,EXP8,EXP9,EXP10,EXP11,EXP12,EXP13,EXP14,EXP15,
      EXPAFTR1,EXPAFTR2,EXPAFTR3,EXPAFTR4,EXPAFTR5,EXPAFTR6,EXPAFTR7,EXPAFTR8,EXPAFTR9,EXPAFTR10,EXPAFTR11,EXPAFTR12,EXPAFTR13,EXPAFTR14,EXPAFTR15,
      AEXP1,AEXP2,AEXP3,AEXP4,AEXP5,AEXP6,AEXP7,AEXP8,AEXP9,AEXP10,AEXP11,AEXP12,AEXP13,AEXP14,AEXP15,
      TEXP,
      AEXPAFTR1,AEXPAFTR2,AEXPAFTR3,AEXPAFTR4,AEXPAFTR5,AEXPAFTR6,AEXPAFTR7,AEXPAFTR8,AEXPAFTR9,AEXPAFTR10,AEXPAFTR11,AEXPAFTR12,AEXPAFTR13,AEXPAFTR14,AEXPAFTR15,
      TEXPAFTR,
      SAL_PURCOD,RCODE,CHALLANNO,CHNSTATUS,RATETYPE,TCODE,TNAME,
      EXPORTTYPE,EXPORTUNO,EXPORTRMKS,ITRMKS,CONTROLCHNO,DELYN,
      widthcol,samplcol,remcol,extschp,extscha,frgtpaid,
      WHTPLUS,WHTMIN,WHTPLUSP,WHTMINP,
      COMM1ON,COMM1CAL,COMM1AMT,COMM2ON,COMM2CAL,COMM2AMT,COMMTOT,
      ADDDISCON,ADDDISCCAL,ADDDISCAMT,BCOMMON,BCOMMCAL,BCOMMAMT,BCOMMADJ,
      pendord,stockinh,repqty,sertaxpc,sertaxamt,sertaxamtI,
      CANCELBILL,jobcode,JOBNAME,REFINISH,
      PRICERET,ROAMT,NQTY,NAMT,CONRATE,CONP,CONQTY,
      PAYCODE,PAYNAME,PAYAMT,TOTAMT,
      SGSTP,SGSTA,CGSTP,CGSTA,IGSTP,IGSTA,CESSP,CESSA,
      VATGST,TAXABLEAMT,CESSQ,CESSQA,RCM,
      CITCODE,CDESC,CQTY,NETRATEBGST,NETRATEAGST,
      POSTCODE,POSTNAME,POLISHP,POLISHW,DMDRATE,DMDAMT,
      STNRATE,STNAMT,GLDRATE,GLDAMT,BALQTY,COSTRATE,
      RECONO,RECOYN,INPUTMNTH,POINTS,FRGTPAIDC,PRLCODE,
      RMG1,RMG2,RMG3,RMG4,RMG5,LBRRATE,LBRAMT
    ) VALUES (
      @UNCODE,@ACCODE,@GCODE,@TAXCODE,@SMCODE,@CCR,@ITCODE,@BARCODE,
      @BCHCODE,@BATCH,@BEXPIRY,@MRP,@CLRCODE,@CLRNAME,@BLSRS,
      @DATE,@RDATE,@BNO,@DOCNO,@TYPE,@DES,@PARTICULAR,
      @GDCODE,@GDCODE1,@GDCODE2,@LOTNO,
      @PKG,@NUGS,@LOOSEQTY,@QTY,@PKGRATE,@FRENUGS,@LOOSEFQTY,
      @RATE,@AMT,@TOTQTY,@TAXP,@TAXAMT,@TITAX,
      @RATEUNIT,@QTYUNIT,@RMKS,@WHT,@WHTUNIT,@ORDERNO,@PAYMODE,@PAYRMKS,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,
      @SAL_PURCOD,@RCODE,@CHALLANNO,@CHNSTATUS,@RATETYPE,@TCODE,@TNAME,
      @EXPORTTYPE,@EXPORTUNO,@EXPORTRMKS,@ITRMKS,@CONTROLCHNO,@DELYN,
      @widthcol,@samplcol,@remcol,@extschp,@extscha,@frgtpaid,
      @WHTPLUS,@WHTMIN,@WHTPLUSP,@WHTMINP,
      @COMM1ON,@COMM1CAL,@COMM1AMT,@COMM2ON,@COMM2CAL,@COMM2AMT,@COMMTOT,
      @ADDDISCON,@ADDDISCCAL,@ADDDISCAMT,@BCOMMON,@BCOMMCAL,@BCOMMAMT,@BCOMMADJ,
      @pendord,@stockinh,@repqty,@sertaxpc,@sertaxamt,@sertaxamtI,
      @CANCELBILL,@jobcode,@JOBNAME,@REFINISH,
      @PRICERET,@ROAMT,@NQTY,@NAMT,@CONRATE,@CONP,@CONQTY,
      @PAYCODE,@PAYNAME,@PAYAMT,@TOTAMT,
      @SGSTP,@SGSTA,@CGSTP,@CGSTA,@IGSTP,@IGSTA,@CESSP,@CESSA,
      @VATGST,@TAXABLEAMT,@CESSQ,@CESSQA,@RCM,
      @CITCODE,@CDESC,@CQTY,@NETRATEBGST,@NETRATEAGST,
      @POSTCODE,@POSTNAME,@POLISHP,@POLISHW,@DMDRATE,@DMDAMT,
      @STNRATE,@STNAMT,@GLDRATE,@GLDAMT,@BALQTY,@COSTRATE,
      @RECONO,@RECOYN,@INPUTMNTH,@POINTS,@FRGTPAIDC,@PRLCODE,
      @RMG1,@RMG2,@RMG3,@RMG4,@RMG5,@LBRRATE,@LBRAMT
    )
  `);
}

log('🚀 KMART-Vision Customer Bridge started');
log(`   Series  : ${CONFIG.bridge.billSeries}`);
log(`   Polling : every ${CONFIG.bridge.pollIntervalMs / 1000}s`);

sql.connect(CONFIG.sqlServer).then(pool => {
  log('✅ SQL Server connected');

  async function syncOrders() {
    log('Checking Supabase for pending customer orders...');
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id, created_at, items,
          customers ( vision_customer_id ),
          salesmen ( vision_salesman_id )
        `)
        .eq('sync_status', 'pending')
        .eq('source', 'customer');

      if (error) throw error;
      if (!orders?.length) { log('No pending customer orders.'); return; }

      log(`Found ${orders.length} customer order(s) — syncing to Vision...`);

      for (const order of orders) {
        try {
          const visCustId  = order.customers?.vision_customer_id;
          const visSalesId = order.salesmen?.vision_salesman_id || 0;

          if (!visCustId) throw new Error(`Vision Customer ID not mapped`);

          const items = order.items;
          const productIds = items.map(i => i.id);

          const { data: dbProducts, error: prodErr } = await supabase
            .from('products')
            .select('id, vision_product_id, mrp')
            .in('id', productIds);

          if (prodErr) throw prodErr;

          const idResult = await pool.request().query(`
            SELECT 
              ISNULL(MAX(UNCODE), 0) + 1 AS next_uncode,
              ISNULL(MAX(CAST(BNO AS INT)), 0) + 1 AS next_bno
            FROM BILL
            WHERE BLSRS = '${CONFIG.bridge.billSeries}'
          `);
          const { next_uncode, next_bno } = idResult.recordset[0];
          let uncode = next_uncode;

          for (const item of items) {
            const prodInfo = dbProducts.find(p => p.id === item.id);
            if (!prodInfo?.vision_product_id) {
              throw new Error(`Vision Product ID not mapped for: ${item.name}`);
            }

            const vItem = await getVisionItem(pool, prodInfo.vision_product_id);
            if (!vItem) throw new Error(`ITCODE ${prodInfo.vision_product_id} not found in Vision`);

            const caseSize = vItem.PACK1 || 1;
            const gstRate  = (vItem.SGST || 0) + (vItem.CGST || 0);
            const pkg      = Math.floor(item.qty / caseSize);
            const looseqty = item.qty % caseSize;

            await insertBillRow(pool, {
              uncode: uncode++, accode: visCustId,
              gcode: vItem.GCODE || 0, smcode: visSalesId,
              itcode: prodInfo.vision_product_id, bno: next_bno,
              orderDate: order.created_at, des: vItem.ITNAME,
              pkg, nugs: caseSize, looseqty, rate: item.price,
              taxp: gstRate, salecode: vItem.SALECODE || 0,
              mrp: vItem.MRP || prodInfo.mrp || 0,
            });
          }

          await supabase.from('orders').update({
            sync_status:        'synced',
            vision_bill_no:     next_bno,
            vision_customer_id: visCustId,
            vision_salesman_id: visSalesId,
            synced_at:          new Date().toISOString(),
          }).eq('id', order.id);

          log(`✅ Order ${order.id} → Vision Bill ${CONFIG.bridge.billSeries}${next_bno}`);

        } catch (err) {
          log(`❌ Order ${order.id} FAILED: ${err.message}`);
          await supabase.from('orders').update({
            sync_status: 'failed',
            sync_error:  err.message,
          }).eq('id', order.id);
        }
      }
    } catch (err) {
      log(`Bridge error: ${err.message}`);
    }
  }

  syncOrders();
  setInterval(syncOrders, CONFIG.bridge.pollIntervalMs);

}).catch(err => {
  log(`❌ SQL Server connection failed: ${err.message}`);
  process.exit(1);
});
