// ========================================================================
// KMART NET — Next-Gen B2B Mobile Web Catalog Template
// High-converting quick-commerce UI/UX, Vision SQL PACK1 case size integration,
// dynamic +1 Case / +2 Cases buttons, saved kirana store profiles,
// bill preview, and 1-tap direct WhatsApp ordering to +91 98775 70829.
// ========================================================================

const fs = require('fs');
const path = require('path');

function buildCatalogHtml(webProducts, catalogVersion, catalogTimestamp) {
  const countAll = webProducts.length;
  const countDettol = webProducts.filter((p) => (p.mfr || '').toUpperCase().includes('REKITT')).length;
  const countMarico = webProducts.filter((p) => (p.mfr || '').toUpperCase().includes('MARICO')).length;
  const countSleepy = webProducts.filter((p) => (p.mfr || '').toUpperCase().includes('SLEEPY OWL')).length;
  const countMcVitties = webProducts.filter((p) => (p.mfr || '').toUpperCase().includes('MC VITTIES')).length;

  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const ver = catalogVersion || `v${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}.${pad(now.getHours())}${pad(now.getMinutes())}`;
  const timeStr = catalogTimestamp || (now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));

  let logoBase64 = '';
  try {
    const logoPath = path.join(__dirname, 'dist', 'icon-192.png');
    if (fs.existsSync(logoPath)) {
      logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;
    }
  } catch (e) {}

  const jsonPayload = JSON.stringify(webProducts);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <title>KMART FMCG — B2B Wholesale Catalog & Ordering</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #123e2b;
      --primary-hover: #1b533a;
      --primary-light: #2d6a4f;
      --primary-bg: #eaf5ee;
      --accent: #d4a843;
      --accent-hover: #b88d30;
      --whatsapp: #25d366;
      --whatsapp-hover: #1eb857;
      --bg: #f4f6f5;
      --surface: #ffffff;
      --border: #e2e8e4;
      --border-light: #edf2ee;
      --text: #161c18;
      --text-muted: #5e6b63;
      --danger: #d93838;
      --radius-sm: 8px;
      --radius: 12px;
      --radius-lg: 16px;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
      --shadow-md: 0 4px 14px rgba(0,0,0,0.07);
      --shadow-lg: 0 12px 32px rgba(0,0,0,0.12);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.4;
      padding-bottom: 95px;
      -webkit-font-smoothing: antialiased;
    }

    /* Top Sticky Header */
    header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--primary);
      color: #ffffff;
      box-shadow: 0 4px 20px rgba(18,62,43,0.3);
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .brand-title {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-logo-img {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      object-fit: contain;
      box-shadow: 0 1px 3px rgba(0,0,0,0.25);
      border: 1.5px solid rgba(255,255,255,0.4);
      background: #ffffff;
      flex-shrink: 0;
    }
    .brand-badge {
      font-size: 0.65rem;
      background: var(--accent);
      color: #111;
      font-weight: 800;
      padding: 3px 7px;
      border-radius: 6px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sync-catalog-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.16);
      border: 1px solid rgba(255, 255, 255, 0.32);
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .sync-catalog-btn:hover {
      background: rgba(255, 255, 255, 0.28);
    }
    .sync-catalog-btn:active {
      transform: scale(0.96);
    }
    .sync-icon {
      font-size: 0.85rem;
      display: inline-block;
      transition: transform 0.3s ease;
    }
    .sync-icon.spinning {
      animation: syncSpin 0.9s linear infinite;
    }
    @keyframes syncSpin {
      100% { transform: rotate(360deg); }
    }
    .sync-toast {
      position: fixed;
      top: 18px;
      left: 50%;
      transform: translateX(-50%) translateY(-100px);
      background: #123e2b;
      color: #ffffff;
      border: 1.5px solid #d4a843;
      padding: 10px 20px;
      border-radius: 30px;
      font-size: 0.84rem;
      font-weight: 700;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
      z-index: 999999;
      transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      pointer-events: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sync-toast.show {
      transform: translateX(-50%) translateY(0);
    }
    .header-order-count {
      font-size: 0.8rem;
      color: #cfe6d8;
      font-weight: 600;
      background: rgba(255,255,255,0.12);
      padding: 4px 10px;
      border-radius: 20px;
    }

    /* Controls Bar */
    .controls-bar {
      background: #0d2e20;
      padding: 10px 16px 12px;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    .controls-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .search-box-wrapper {
      position: relative;
      width: 100%;
    }
    .search-input {
      width: 100%;
      height: 44px;
      padding: 0 42px 0 40px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.2);
      background: #ffffff;
      color: #111;
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      transition: all 0.2s;
    }
    .search-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(212,168,67,0.35);
    }
    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1rem;
      color: #888;
      pointer-events: none;
    }
    .clear-search {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #e2e8e4;
      border: none;
      color: #555;
      font-size: 0.8rem;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
    }

    /* Brand Filter Pills */
    .brand-pills-scroll {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 2px;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .brand-pills-scroll::-webkit-scrollbar { display: none; }
    .brand-pill {
      flex: 0 0 auto;
      padding: 7px 14px;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 700;
      background: rgba(255,255,255,0.12);
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.15);
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;
    }
    .brand-pill.active {
      background: var(--accent);
      color: #111111;
      border-color: var(--accent);
      box-shadow: 0 2px 8px rgba(212,168,67,0.4);
    }
    .pill-count {
      opacity: 0.85;
      font-size: 0.75rem;
      margin-left: 4px;
    }

    /* Main Container */
    main {
      max-width: 1400px;
      margin: 16px auto;
      padding: 0 12px;
    }

    /* View & Sort Bar */
    .view-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      gap: 8px;
      flex-wrap: wrap;
    }
    .results-count {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-muted);
    }
    .view-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sort-select {
      height: 34px;
      padding: 0 10px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text);
      outline: none;
      cursor: pointer;
    }
    .view-toggles {
      display: flex;
      background: #e5ece7;
      border-radius: 8px;
      padding: 2px;
    }
    .view-btn {
      padding: 5px 12px;
      border: none;
      background: transparent;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #555;
      cursor: pointer;
    }
    .view-btn.active {
      background: #ffffff;
      color: var(--primary);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    /* Grid Layout */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 14px;
    }
    @media (max-width: 640px) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
    }
    @media (max-width: 360px) {
      .products-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Product Card */
    .product-card {
      background: var(--surface);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .product-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .card-img-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-bottom: 1px solid var(--border-light);
      padding: 8px;
    }
    .card-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.3s;
    }
    .product-card:hover .card-img {
      transform: scale(1.05);
    }
    .card-brand-badge {
      position: absolute;
      top: 6px;
      left: 6px;
      font-size: 0.62rem;
      font-weight: 800;
      padding: 3px 7px;
      border-radius: 6px;
      color: #ffffff;
      backdrop-filter: blur(4px);
    }
    .badge-dettol { background: #008744; }
    .badge-marico { background: #005da4; }
    .badge-sleepy { background: #5d3a1a; }
    .badge-mcvitie { background: #c92a2a; }
    .badge-default { background: var(--primary); }

    .card-savings-badge {
      position: absolute;
      top: 6px;
      right: 6px;
      font-size: 0.62rem;
      font-weight: 800;
      padding: 3px 6px;
      border-radius: 6px;
      background: #d93838;
      color: #ffffff;
    }

    .card-body {
      padding: 10px;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
      gap: 8px;
    }
    .product-title {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text);
      line-height: 1.3;
      margin-bottom: 2px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.3em;
    }
    .product-raw {
      font-size: 0.7rem;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Vision SQL PACK1 Case Size Badge */
    .case-size-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--primary);
      background: #eaf5ee;
      border: 1px solid #cce5d4;
      padding: 2px 7px;
      border-radius: 6px;
      width: fit-content;
      margin: 2px 0;
    }

    /* Price Section */
    .price-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .sale-price {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--primary);
    }
    .mrp-price {
      font-size: 0.78rem;
      color: #888;
      text-decoration: line-through;
    }

    /* Order Controls on Card */
    .order-controls {
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: #f8faf8;
      padding: 6px;
      border-radius: 8px;
      border: 1px solid var(--border-light);
    }
    .rate-edit-pill {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      padding: 3px 6px;
      border-radius: 6px;
      border: 1px solid var(--border);
      font-size: 0.72rem;
      color: var(--text-muted);
      font-weight: 600;
    }
    .card-rate-input {
      width: 68px;
      height: 22px;
      border: 1px solid #d2ded5;
      border-radius: 4px;
      padding: 0 4px;
      text-align: right;
      font-size: 0.82rem;
      font-weight: 800;
      color: var(--primary);
      background: #fafdfa;
      outline: none;
    }
    .card-rate-input:focus {
      border-color: var(--accent);
      background: #ffffff;
    }

    /* Smart Add Button / Stepper */
    .btn-smart-add {
      width: 100%;
      height: 34px;
      background: var(--primary);
      color: #ffffff;
      border: none;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      transition: all 0.2s;
      box-shadow: 0 2px 6px rgba(18,62,43,0.25);
    }
    .btn-smart-add:hover { background: var(--primary-hover); }
    .btn-smart-add:active { transform: scale(0.97); }

    .smart-stepper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 34px;
      background: var(--primary-bg);
      border: 1.5px solid var(--primary);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }
    .smart-step-btn {
      width: 38px;
      height: 100%;
      background: transparent;
      border: none;
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      user-select: none;
      flex-shrink: 0;
    }
    .smart-step-btn:hover { background: rgba(18,62,43,0.12); }
    .smart-step-btn:active { background: rgba(18,62,43,0.22); }
    .smart-input-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      flex: 1;
      min-width: 0;
      height: 100%;
    }
    .smart-qty-input {
      width: 46px;
      height: 24px;
      background: #ffffff;
      border: 1px solid rgba(18,62,43,0.3);
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 800;
      color: var(--primary);
      text-align: center;
      outline: none;
      padding: 0 2px;
    }
    .smart-qty-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(18,62,43,0.2);
    }
    .smart-qty-unit {
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--primary);
      white-space: nowrap;
    }

    /* Bulk Case Action Chips */
    .carton-chips {
      display: flex;
      gap: 4px;
    }
    .chip-btn {
      flex: 1;
      padding: 4px 2px;
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 5px;
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--text-muted);
      cursor: pointer;
      text-align: center;
      transition: all 0.15s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .chip-btn:hover {
      background: var(--primary-bg);
      border-color: var(--primary-light);
      color: var(--primary);
    }

    /* Case Chips Styling */
    .case-chip {
      background: #f0f7ff;
      border-color: #bfdbfe;
      color: #1d4ed8;
      font-weight: 700;
    }
    .case-chip:hover {
      background: #dbeafe;
      border-color: #93c5fd;
      color: #1e40af;
    }

    /* Loose Pieces Chips Styling */
    .loose-chips-group {
      display: flex;
      gap: 4px;
      margin-top: 3px;
    }
    .loose-chip {
      background: #f0fdf4;
      border-color: #bbf7d0;
      color: #15803d;
      font-weight: 700;
    }
    .loose-chip:hover {
      background: #dcfce7;
      border-color: #86efac;
      color: #166534;
    }
    .loose-manual-btn {
      background: #fefce8;
      border-color: #fef08a;
      color: #854d0e;
    }
    .loose-manual-btn:hover {
      background: #fef9c3;
      border-color: #fde047;
      color: #713f12;
    }

    /* Inline Manual Loose Input Row */
    .loose-inline-row {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
      padding: 4px 6px;
      background: #fffbeb;
      border: 1px dashed #fcd34d;
      border-radius: var(--radius-sm);
      animation: fadeIn 0.15s ease-in;
    }
    .loose-inline-tag {
      font-size: 0.65rem;
      font-weight: 800;
      color: #92400e;
      white-space: nowrap;
    }
    .loose-inline-input {
      width: 48px;
      flex: 1;
      height: 24px;
      padding: 0 4px;
      font-size: 0.78rem;
      font-weight: 800;
      border: 1px solid #f59e0b;
      border-radius: 4px;
      text-align: center;
      background: #ffffff;
      color: var(--text);
      outline: none;
    }
    .loose-inline-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(18,62,43,0.15);
    }
    .loose-inline-add {
      height: 24px;
      padding: 0 8px;
      background: #f59e0b;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 800;
      cursor: pointer;
      white-space: nowrap;
    }
    .loose-inline-add:hover {
      background: #d97706;
    }
    .loose-inline-cancel {
      height: 24px;
      width: 22px;
      background: transparent;
      color: #78716c;
      border: none;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .loose-inline-cancel:hover {
      color: #dc2626;
    }

    /* Table View */
    .table-container {
      display: none;
      background: var(--surface);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      overflow-x: auto;
      box-shadow: var(--shadow-sm);
    }
    .catalog-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }
    .catalog-table th {
      background: var(--primary);
      color: #ffffff;
      padding: 10px 12px;
      text-align: left;
      font-weight: 700;
      font-size: 0.78rem;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .catalog-table td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }
    .catalog-table tr:nth-child(even) { background: #fafbfa; }
    .catalog-table tr:hover { background: #f2f7f3; }
    .table-thumb {
      width: 44px;
      height: 44px;
      object-fit: contain;
      border-radius: 6px;
      background: #ffffff;
      border: 1px solid var(--border);
      padding: 2px;
    }

    /* Sticky Bottom Bar on Mobile */
    .sticky-bottom-bar {
      position: fixed;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 24px);
      max-width: 600px;
      background: var(--primary);
      color: #ffffff;
      border-radius: 40px;
      padding: 10px 18px;
      display: none;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 8px 26px rgba(18,62,43,0.4);
      z-index: 95;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .sticky-bottom-bar:hover {
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 10px 30px rgba(18,62,43,0.5);
    }
    .bottom-bar-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .bottom-cart-badge {
      background: var(--accent);
      color: #111;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 12px;
    }
    .bottom-cart-info {
      display: flex;
      flex-direction: column;
    }
    .bottom-total-text {
      font-size: 1rem;
      font-weight: 800;
    }
    .bottom-items-sub {
      font-size: 0.7rem;
      color: #cfe6d8;
    }
    .bottom-view-btn {
      background: #ffffff;
      color: var(--primary);
      border: none;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 0.82rem;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* Cart Slide-out Drawer */
    .drawer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(3px);
      z-index: 110;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    .drawer-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }

    .cart-drawer {
      position: fixed;
      top: 0;
      right: -100%;
      width: 100%;
      max-width: 440px;
      height: 100%;
      background: var(--surface);
      z-index: 120;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-lg);
      transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cart-drawer.open { right: 0; }

    .drawer-header {
      background: var(--primary);
      color: #ffffff;
      padding: 14px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .drawer-title {
      font-size: 1.1rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .drawer-close {
      background: rgba(255,255,255,0.15);
      border: none;
      color: #ffffff;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 1.1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Saved Shops Picker */
    .saved-shop-box {
      background: #f4f8f5;
      border: 1px solid #dbeef1;
      border-radius: var(--radius);
      padding: 10px;
    }
    .saved-shop-title {
      font-size: 0.72rem;
      font-weight: 800;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .shop-select-row {
      display: flex;
      gap: 6px;
    }
    .shop-select {
      flex: 1;
      height: 32px;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0 8px;
      background: #ffffff;
    }
    .btn-save-shop {
      padding: 0 10px;
      background: var(--primary);
      color: #ffffff;
      border: none;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
    }

    /* Customer Form */
    .customer-box {
      background: #fafbfa;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 12px;
    }
    .customer-box h4 {
      font-size: 0.78rem;
      font-weight: 800;
      color: var(--text);
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .form-row { margin-bottom: 8px; }
    .form-row:last-child { margin-bottom: 0; }
    .form-input {
      width: 100%;
      height: 36px;
      padding: 0 10px;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.85rem;
      font-family: inherit;
      outline: none;
      background: #ffffff;
    }
    .form-input:focus { border-color: var(--primary); }

    /* Cart Items in Drawer */
    .cart-items-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .cart-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
    }
    .cart-item-img {
      width: 48px;
      height: 48px;
      object-fit: contain;
      border-radius: 6px;
      background: #ffffff;
      border: 1px solid var(--border-light);
      padding: 2px;
    }
    .cart-item-info {
      flex: 1;
      min-width: 0;
    }
    .cart-item-name {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text);
      line-height: 1.25;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cart-item-case-badge {
      display: inline-block;
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--primary);
      background: #eaf5ee;
      padding: 1px 5px;
      border-radius: 4px;
      margin: 2px 0;
    }
    .cart-item-rate-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 3px 0;
      font-size: 0.72rem;
      color: var(--text-muted);
    }
    .cart-rate-input {
      width: 65px;
      height: 22px;
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 0 4px;
      font-size: 0.78rem;
      font-weight: 700;
      text-align: right;
      color: var(--primary);
    }
    .cart-item-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .cart-item-stepper {
      display: flex;
      align-items: center;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: #ffffff;
      overflow: hidden;
      height: 26px;
    }
    .cart-step-btn {
      width: 26px;
      height: 100%;
      background: transparent;
      border: none;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cart-qty-input {
      width: 34px;
      height: 100%;
      border: none;
      text-align: center;
      font-size: 0.8rem;
      font-weight: 800;
      outline: none;
    }
    .cart-item-total {
      font-size: 0.88rem;
      font-weight: 800;
      color: var(--primary);
    }
    .btn-remove-item {
      background: transparent;
      border: none;
      color: var(--danger);
      font-size: 1rem;
      cursor: pointer;
      padding: 4px;
    }

    /* Drawer Footer */
    .drawer-footer {
      border-top: 1px solid var(--border);
      background: #fafbfa;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .cart-summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .cart-summary-total {
      display: flex;
      justify-content: space-between;
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--primary);
      padding-top: 6px;
      border-top: 1px dashed var(--border);
    }

    /* Drawer Action Buttons */
    .btn-whatsapp-order {
      width: 100%;
      height: 46px;
      background: var(--whatsapp);
      color: #ffffff;
      border: none;
      border-radius: var(--radius);
      font-size: 0.95rem;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(37,211,102,0.3);
      transition: background 0.2s, transform 0.1s;
    }
    .btn-whatsapp-order:hover { background: var(--whatsapp-hover); }
    .btn-whatsapp-order:active { transform: scale(0.98); }

    .btn-preview-bill {
      width: 100%;
      height: 36px;
      background: #ffffff;
      color: var(--primary);
      border: 1.5px solid var(--primary);
      border-radius: var(--radius);
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-preview-bill:hover { background: var(--primary-bg); }

    .btn-clear-cart {
      background: transparent;
      border: none;
      color: var(--danger);
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      padding: 4px;
      text-align: center;
    }

    /* Bill Receipt Modal */
    .bill-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.65);
      backdrop-filter: blur(4px);
      z-index: 130;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .bill-modal-overlay.open { display: flex; }
    .bill-modal {
      background: #ffffff;
      border-radius: 16px;
      max-width: 460px;
      width: 100%;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    .bill-modal-header {
      background: var(--primary);
      color: #ffffff;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .bill-modal-header h3 {
      font-size: 0.95rem;
      font-weight: 800;
    }
    .bill-modal-body {
      padding: 14px;
      overflow-y: auto;
      font-family: monospace;
      font-size: 0.8rem;
      background: #fafdfa;
      white-space: pre-wrap;
      line-height: 1.45;
    }
    .bill-modal-footer {
      padding: 10px 14px;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 8px;
      background: #ffffff;
    }
    .btn-copy-bill {
      flex: 1;
      height: 38px;
      background: var(--primary);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-close-bill {
      padding: 0 16px;
      height: 38px;
      background: #e2e8e4;
      color: #333;
      border: none;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
    }

    .empty-cart {
      text-align: center;
      padding: 40px 16px;
      color: var(--text-muted);
    }
    .empty-cart-icon {
      font-size: 2.5rem;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>

  <!-- Top Sticky Header -->
  <header>
    <div class="header-top">
      <div class="brand-title">
        ${logoBase64 ? `<img src="${logoBase64}" alt="KMART Logo" class="brand-logo-img">` : ''}
        <span>KMART FMCG</span>
        <span class="brand-badge">B2B Wholesale</span>
      </div>
      <div class="header-right">
        <button id="syncCatalogBtn" class="sync-catalog-btn" onclick="syncCatalog(true)" title="Check for latest prices and products">
          <span class="sync-icon" id="syncIcon">🔄</span>
          <span class="sync-label" id="syncLabel">Sync</span>
        </button>
        <span class="header-order-count" id="headerProductCount">${countAll} Products</span>
      </div>
    </div>

    <!-- Controls Bar -->
    <div class="controls-bar">
      <div class="controls-inner">
        <!-- Search Input -->
        <div class="search-box-wrapper">
          <span class="search-icon">🔍</span>
          <input type="text" id="searchInput" class="search-input" placeholder="Search by product, brand, or code..." autocomplete="off">
          <button id="clearSearchBtn" class="clear-search" title="Clear search">✕</button>
        </div>

        <!-- Horizontal Brand Filter Tabs -->
        <div class="brand-pills-scroll">
          <div class="brand-pill active" data-brand="ALL">All<span class="pill-count" id="count-all">(${countAll})</span></div>
          <div class="brand-pill" data-brand="REKITT">Dettol / Reckitt<span class="pill-count" id="count-rekitt">(${countDettol})</span></div>
          <div class="brand-pill" data-brand="MARICO">Marico<span class="pill-count" id="count-marico">(${countMarico})</span></div>
          <div class="brand-pill" data-brand="SLEEPY OWL">Sleepy Owl<span class="pill-count" id="count-sleepy">(${countSleepy})</span></div>
          <div class="brand-pill" data-brand="MC VITTIES">McVitie's<span class="pill-count" id="count-mcvitties">(${countMcVitties})</span></div>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Catalog Content -->
  <main>
    <!-- View & Sort Bar -->
    <div class="view-bar">
      <div class="results-count" id="resultsCount">Showing ${countAll} of ${countAll} items</div>
      <div class="view-actions">
        <!-- Sort Dropdown -->
        <select id="sortSelect" class="sort-select" onchange="onSortChange(this.value)">
          <option value="default">⚡ Featured</option>
          <option value="discount">🏷️ Discount: High to Low</option>
          <option value="price_asc">💵 Price: Low to High</option>
          <option value="price_desc">💰 Price: High to Low</option>
          <option value="name_asc">🔤 Name: A to Z</option>
          <option value="in_cart">🛒 In Cart Only</option>
        </select>

        <!-- View Switcher -->
        <div class="view-toggles">
          <button class="view-btn active" id="btnGridView" onclick="switchView('grid')" title="Cards View">⊞ Cards</button>
          <button class="view-btn" id="btnTableView" onclick="switchView('table')" title="Dense Table View">☰ Table</button>
        </div>
      </div>
    </div>

    <!-- Product Cards Grid -->
    <div class="products-grid" id="productsGrid"></div>

    <!-- Tabular View -->
    <div class="table-container" id="tableContainer">
      <table class="catalog-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Clean Name & Case Pack</th>
            <th>Vision Item Name</th>
            <th>MRP</th>
            <th>Order Rate (₹)</th>
            <th>Cart Qty</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
    </div>
  </main>

  <!-- Mobile Sticky Bottom Floating Bar -->
  <div class="sticky-bottom-bar" id="stickyBottomBar" onclick="toggleCart(true)">
    <div class="bottom-bar-left">
      <span class="bottom-cart-badge" id="bottomCartPieces">0 pcs</span>
      <div class="bottom-cart-info">
        <span class="bottom-total-text" id="bottomCartTotal">₹0.00</span>
        <span class="bottom-items-sub" id="bottomCartItems">0 items in order</span>
      </div>
    </div>
    <button class="bottom-view-btn">View Order 🛒 →</button>
  </div>

  <!-- Cart Slide-out Drawer Overlay -->
  <div class="drawer-overlay" id="drawerOverlay" onclick="toggleCart(false)"></div>

  <!-- Cart Drawer -->
  <aside class="cart-drawer" id="cartDrawer">
    <div class="drawer-header">
      <div class="drawer-title">
        <span>🛒 Order Summary</span>
        <span class="brand-badge" id="drawerCountBadge">0 Items</span>
      </div>
      <button class="drawer-close" onclick="toggleCart(false)">✕</button>
    </div>

    <div class="drawer-body">
      <!-- Saved Customer / Shop Profile Selector -->
      <div class="saved-shop-box">
        <div class="saved-shop-title">
          <span>🏪 Frequent Kirana / Shop Profile</span>
        </div>
        <div class="shop-select-row">
          <select id="savedShopSelect" class="shop-select" onchange="onSelectSavedShop(this.value)">
            <option value="">-- Choose frequent store --</option>
          </select>
          <button class="btn-save-shop" onclick="saveCurrentShop()" title="Save current store details">💾 Save</button>
        </div>
      </div>

      <!-- Customer Details Form -->
      <div class="customer-box">
        <h4>Customer & Delivery Details</h4>
        <div class="form-row">
          <input type="text" id="custName" class="form-input" placeholder="Customer / Shop Name *" required>
        </div>
        <div class="form-row">
          <input type="tel" id="custPhone" class="form-input" placeholder="Phone Number (optional)">
        </div>
        <div class="form-row">
          <input type="text" id="custNotes" class="form-input" placeholder="Delivery Note / Payment terms (optional)">
        </div>
      </div>

      <!-- Cart Item List -->
      <div class="cart-items-list" id="cartItemsList">
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <p>Your order is currently empty.</p>
          <small>Tap "+ ADD" or "+1 Case" on any product to build an order!</small>
        </div>
      </div>
    </div>

    <div class="drawer-footer">
      <div class="cart-summary-row">
        <span>Total Products:</span>
        <strong id="cartSummaryItems">0 items</strong>
      </div>
      <div class="cart-summary-row">
        <span>Total Quantity:</span>
        <strong id="cartSummaryPieces">0 pcs</strong>
      </div>
      <div class="cart-summary-row" id="caseSummaryRow">
        <span>Master Case Tally:</span>
        <strong id="cartSummaryCases" style="color:var(--primary)">0 Cases</strong>
      </div>
      <div class="cart-summary-total">
        <span>Grand Total:</span>
        <span id="cartSummaryTotal">₹0.00</span>
      </div>

      <!-- Preview Bill Button -->
      <button class="btn-preview-bill" onclick="openBillPreview()">
        📄 Preview Bill Receipt
      </button>

      <!-- WhatsApp Place Order Button (Strictly to +91 98775 70829) -->
      <button class="btn-whatsapp-order" onclick="placeOrderWhatsApp()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.586 1.761.884 2.79.885h.002c3.182 0 5.769-2.587 5.77-5.766.001-3.182-2.585-5.771-5.771-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/>
        </svg>
        Send Order on WhatsApp
      </button>

      <button class="btn-clear-cart" onclick="clearCart()">Clear Order</button>
    </div>
  </aside>

  <!-- Bill Receipt Preview Modal -->
  <div class="bill-modal-overlay" id="billModalOverlay" onclick="closeBillModal(event)">
    <div class="bill-modal" onclick="event.stopPropagation()">
      <div class="bill-modal-header">
        <h3>📄 B2B Order Receipt Estimate</h3>
        <button class="drawer-close" onclick="closeBillModal()">✕</button>
      </div>
      <div class="bill-modal-body" id="billModalContent"></div>
      <div class="bill-modal-footer">
        <button class="btn-copy-bill" onclick="copyBillText()">📋 Copy Receipt Text</button>
        <button class="btn-close-bill" onclick="closeBillModal()">Close</button>
      </div>
    </div>
  </div>

  <!-- Sync Status Toast -->
  <div id="syncToast" class="sync-toast">
    <span id="syncToastIcon">✅</span>
    <span id="syncToastText">Catalog updated!</span>
  </div>

  <script>
    // Embedded Product Data & Cloud Auto-Sync
    const CLOUD_SYNC_URL = 'https://raw.githubusercontent.com/Amritgrover/KMARTNET/master/catalog_sync.json';
    const EMBEDDED_VERSION = '${ver}';
    const EMBEDDED_TIMESTAMP = '${timeStr}';
    const DEFAULT_PRODUCTS = ${jsonPayload};

    let activeVersion = EMBEDDED_VERSION;
    let activeTimestamp = EMBEDDED_TIMESTAMP;
    let products = DEFAULT_PRODUCTS;

    // Check persistent storage for synced catalog
    try {
      const cached = localStorage.getItem('KMART_CATALOG_SYNC_DATA');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
          products = parsed.products;
          activeVersion = parsed.version || EMBEDDED_VERSION;
          activeTimestamp = parsed.timestamp || EMBEDDED_TIMESTAMP;
          console.log('[KMART] Initialized from persistent sync cache:', activeVersion, products.length, 'items');
        }
      }
    } catch (e) {
      console.warn('[KMART] Cache parse error:', e);
    }

    // App State
    let currentBrand = 'ALL';
    let searchQuery = '';
    let currentView = 'grid';
    let currentSort = 'default';
    let cart = JSON.parse(localStorage.getItem('kmart_cart') || '{}');

    // Toast Notification Helper
    let toastTimeout = null;
    function showToast(msg, icon = '✅', duration = 3500) {
      const toast = document.getElementById('syncToast');
      const toastIcon = document.getElementById('syncToastIcon');
      const toastText = document.getElementById('syncToastText');
      if (!toast || !toastText) return;
      toastIcon.textContent = icon;
      toastText.textContent = msg;
      toast.classList.add('show');
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, duration);
    }

    // Dynamic Category Counts Updater
    function updateCategoryCounts() {
      const totalAll = products.length;
      const totalDettol = products.filter(p => (p.mfr || '').toUpperCase().includes('REKITT')).length;
      const totalMarico = products.filter(p => (p.mfr || '').toUpperCase().includes('MARICO')).length;
      const totalSleepy = products.filter(p => (p.mfr || '').toUpperCase().includes('SLEEPY OWL')).length;
      const totalMcVitties = products.filter(p => (p.mfr || '').toUpperCase().includes('MC VITTIES')).length;

      const elAll = document.getElementById('count-all');
      const elDettol = document.getElementById('count-rekitt');
      const elMarico = document.getElementById('count-marico');
      const elSleepy = document.getElementById('count-sleepy');
      const elMcVitties = document.getElementById('count-mcvitties');
      const elHeaderCount = document.getElementById('headerProductCount');

      if (elAll) elAll.textContent = '(' + totalAll + ')';
      if (elDettol) elDettol.textContent = '(' + totalDettol + ')';
      if (elMarico) elMarico.textContent = '(' + totalMarico + ')';
      if (elSleepy) elSleepy.textContent = '(' + totalSleepy + ')';
      if (elMcVitties) elMcVitties.textContent = '(' + totalMcVitties + ')';
      if (elHeaderCount) elHeaderCount.textContent = totalAll + ' Products';
    }

    // Cloud Auto-Sync Function (OTA Update with Zero CDN Lag)
    let isSyncing = false;
    async function syncCatalog(isManual) {
      if (isSyncing) return;
      isSyncing = true;
      const syncBtn = document.getElementById('syncCatalogBtn');
      const syncIcon = document.getElementById('syncIcon');
      const syncLabel = document.getElementById('syncLabel');

      if (syncIcon) syncIcon.classList.add('spinning');
      if (syncLabel) syncLabel.textContent = 'Syncing...';

      try {
        let fetchUrl = CLOUD_SYNC_URL + '?t=' + Date.now();

        // Query GitHub API to get the exact latest commit SHA to completely bypass Fastly CDN edge cache (0s delay)
        try {
          const apiController = new AbortController();
          const apiTimeout = setTimeout(() => apiController.abort(), 4000);
          const apiRes = await fetch('https://api.github.com/repos/Amritgrover/KMARTNET/commits/master', {
            signal: apiController.signal,
            headers: { 'Accept': 'application/vnd.github.v3+json' }
          });
          clearTimeout(apiTimeout);
          if (apiRes.ok) {
            const commitData = await apiRes.json();
            if (commitData && commitData.sha) {
              fetchUrl = 'https://raw.githubusercontent.com/Amritgrover/KMARTNET/' + commitData.sha + '/catalog_sync.json';
              console.log('[KMART] Using zero-cache commit SHA URL:', commitData.sha.substring(0, 7));
            }
          }
        } catch (apiErr) {
          console.log('[KMART] GitHub API commit SHA check skipped, falling back to query param:', apiErr.message);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(fetchUrl, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error('Sync server responded with status ' + res.status);
        }

        const data = await res.json();
        if (!data || !Array.isArray(data.products) || data.products.length === 0) {
          throw new Error('Invalid catalog payload received from cloud.');
        }

        const shouldUpdate = isManual || (data.version && data.version !== activeVersion);

        if (shouldUpdate) {
          // Detect specific price updates for user feedback
          const updatedPrices = [];
          if (products && Array.isArray(products)) {
            data.products.forEach(newP => {
              const oldP = products.find(x => x.itcode === newP.itcode);
              if (oldP && (oldP.saleRate !== newP.saleRate || oldP.mrp !== newP.mrp)) {
                updatedPrices.push({
                  name: newP.name || newP.cleanName || newP.rawName,
                  oldRate: oldP.saleRate,
                  newRate: newP.saleRate,
                  oldMrp: oldP.mrp,
                  newMrp: newP.mrp
                });
              }
            });
          }

          // Update persistent storage and active state
          localStorage.setItem('KMART_CATALOG_SYNC_DATA', JSON.stringify({
            version: data.version,
            timestamp: data.timestamp,
            products: data.products
          }));

          products = data.products;
          activeVersion = data.version;
          activeTimestamp = data.timestamp;

          // Sync updated rates into any existing cart items
          if (cart && typeof cart === 'object') {
            Object.keys(cart).forEach(itcode => {
              const numCode = parseInt(itcode, 10);
              const p = products.find(x => x.itcode === numCode);
              if (p && cart[itcode]) {
                cart[itcode].rate = p.saleRate;
                cart[itcode].name = p.cleanName || p.name || cart[itcode].name;
                cart[itcode].pack = p.pack || cart[itcode].pack;
              }
            });
            saveCart();
          }

          updateCategoryCounts();
          renderProducts();
          updateCartUI();

          if (updatedPrices.length > 0) {
            const first = updatedPrices[0];
            showToast('✅ Updated ' + first.name + ': ₹' + first.newRate.toFixed(2) + ' (MRP ₹' + first.newMrp.toFixed(2) + ')');
          } else {
            showToast('✅ Catalog updated! ' + data.products.length + ' products with latest prices.');
          }
        } else {
          updateCategoryCounts();
          if (isManual) {
            showToast('Catalog is already up to date (' + products.length + ' items).', '✨');
          }
        }
      } catch (err) {
        console.warn('[KMART] Cloud sync error:', err.message);
        if (isManual) {
          showToast('Offline / cannot reach sync server. Using cached catalog.', '📶');
        }
      } finally {
        isSyncing = false;
        if (syncIcon) syncIcon.classList.remove('spinning');
        if (syncLabel) syncLabel.textContent = 'Sync';
      }
    }

    // DOM Elements
    const productsGrid = document.getElementById('productsGrid');
    const tableContainer = document.getElementById('tableContainer');
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const brandPills = document.querySelectorAll('.brand-pill');
    const resultsCount = document.getElementById('resultsCount');
    const stickyBottomBar = document.getElementById('stickyBottomBar');
    const bottomCartPieces = document.getElementById('bottomCartPieces');
    const bottomCartTotal = document.getElementById('bottomCartTotal');
    const bottomCartItems = document.getElementById('bottomCartItems');
    const cartDrawer = document.getElementById('cartDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const cartItemsList = document.getElementById('cartItemsList');
    const drawerCountBadge = document.getElementById('drawerCountBadge');
    const cartSummaryItems = document.getElementById('cartSummaryItems');
    const cartSummaryPieces = document.getElementById('cartSummaryPieces');
    const cartSummaryCases = document.getElementById('cartSummaryCases');
    const cartSummaryTotal = document.getElementById('cartSummaryTotal');
    const savedShopSelect = document.getElementById('savedShopSelect');

    const fallbackSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%23cccccc'><path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/></svg>";

    // Format Case Breakdown Helper
    function formatCaseBreakdown(qty, pack) {
      const packSize = parseInt(pack, 10) || 1;
      if (packSize <= 1) return qty + ' pcs';
      const fullCases = Math.floor(qty / packSize);
      const loose = qty % packSize;

      if (fullCases === 0) {
        return qty + ' pcs (' + loose + ' loose)';
      } else if (loose === 0) {
        return qty + ' pcs (' + fullCases + ' Case' + (fullCases > 1 ? 's' : '') + ')';
      } else {
        return qty + ' pcs (' + fullCases + ' Case' + (fullCases > 1 ? 's' : '') + ' + ' + loose + ' loose)';
      }
    }

    // Dynamic Bulk Chips HTML based on PACK1 & Loose Chips
    function getBulkChipsHtml(p) {
      const pack = parseInt(p.pack, 10) || 1;
      let caseRowHtml = '';
      if (pack > 1) {
        const twoCases = pack * 2;
        const halfCase = Math.round(pack / 2);
        const fiveCases = pack * 5;

        let btn3Text = '+5 Cases (' + fiveCases + ')';
        let btn3Val = fiveCases;
        if (pack >= 48) {
          btn3Text = '+½ Case (' + halfCase + ')';
          btn3Val = halfCase;
        }

        caseRowHtml = \`
          <div class="carton-chips">
            <button class="chip-btn case-chip" onclick="addBulkQty(\${p.itcode}, \${pack})" title="Add 1 Master Case of \${pack} pcs">+1 Case (\${pack})</button>
            <button class="chip-btn case-chip" onclick="addBulkQty(\${p.itcode}, \${twoCases})" title="Add 2 Master Cases of \${twoCases} pcs">+2 Cases (\${twoCases})</button>
            <button class="chip-btn case-chip" onclick="addBulkQty(\${p.itcode}, \${btn3Val})" title="Add \${btn3Text}">\${btn3Text}</button>
          </div>
        \`;
      } else {
        caseRowHtml = \`
          <div class="carton-chips">
            <button class="chip-btn case-chip" onclick="addBulkQty(\${p.itcode}, 1)" title="Add 1 pc">+1 Pc</button>
            <button class="chip-btn case-chip" onclick="addBulkQty(\${p.itcode}, 2)" title="Add 2 pcs">+2 Pcs</button>
            <button class="chip-btn case-chip" onclick="addBulkQty(\${p.itcode}, 3)" title="Add 3 pcs">+3 Pcs</button>
          </div>
        \`;
      }

      const looseRowHtml = \`
        <div class="loose-chips-group">
          <button class="chip-btn loose-chip" onclick="addBulkQty(\${p.itcode}, 6)" title="Add 6 loose pieces">+6 Pcs</button>
          <button class="chip-btn loose-chip" onclick="addBulkQty(\${p.itcode}, 12)" title="Add 12 loose pieces">+12 Pcs</button>
          <button class="chip-btn loose-chip" onclick="addBulkQty(\${p.itcode}, 24)" title="Add 24 loose pieces">+24 Pcs</button>
          <button class="chip-btn loose-chip loose-manual-btn" onclick="toggleLooseRow(\${p.itcode})" title="Enter loose pieces manually (e.g. 1, 2, 25 pcs)">+ Loose ✍️</button>
        </div>
        <div id="loose-row-\${p.itcode}" class="loose-inline-row" style="display:none;">
          <span class="loose-inline-tag">+ Loose:</span>
          <input type="number" min="1" step="1" class="loose-inline-input" id="loose-input-\${p.itcode}" placeholder="e.g. 25" onkeyup="if(event.key==='Enter') applyLooseQty(\${p.itcode})">
          <button class="loose-inline-add" onclick="applyLooseQty(\${p.itcode})">+ Add</button>
          <button class="loose-inline-cancel" onclick="toggleLooseRow(\${p.itcode}, false)">✕</button>
        </div>
      \`;

      return caseRowHtml + looseRowHtml;
    }

    // Initialize App
    function init() {
      loadSavedShopsDropdown();
      updateCategoryCounts();
      renderProducts();
      updateCartUI();

      // Auto-check for cloud catalog updates in background
      setTimeout(() => {
        if (navigator.onLine) {
          syncCatalog(false);
        }
      }, 1200);

      // Search listener
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
        renderProducts();
      });

      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        renderProducts();
      });

      // Brand filter listeners
      brandPills.forEach(pill => {
        pill.addEventListener('click', () => {
          brandPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          currentBrand = pill.getAttribute('data-brand');
          renderProducts();
        });
      });
    }

    // Switch between Grid and Table View
    function switchView(view) {
      currentView = view;
      document.getElementById('btnGridView').classList.toggle('active', view === 'grid');
      document.getElementById('btnTableView').classList.toggle('active', view === 'table');
      productsGrid.style.display = view === 'grid' ? 'grid' : 'none';
      tableContainer.style.display = view === 'table' ? 'block' : 'none';
    }

    // Sort Handler
    function onSortChange(sortVal) {
      currentSort = sortVal;
      renderProducts();
    }

    // Filter & Sort Products
    function getFilteredProducts() {
      let filtered = products.filter(p => {
        const pClean = (p.cleanName || p.name || '');
        const pRaw = (p.rawName || '');
        const pMfr = (p.mfr || '');
        const matchesBrand = (currentBrand === 'ALL') || (pMfr.toUpperCase().includes(currentBrand));
        const matchesSearch = !searchQuery || 
          pClean.toLowerCase().includes(searchQuery) ||
          pRaw.toLowerCase().includes(searchQuery) ||
          pMfr.toLowerCase().includes(searchQuery) ||
          String(p.itcode).includes(searchQuery);

        return matchesBrand && matchesSearch;
      });

      // Apply Sorting
      if (currentSort === 'discount') {
        filtered.sort((a, b) => {
          const discA = a.mrp > a.saleRate ? (a.mrp - a.saleRate) / a.mrp : 0;
          const discB = b.mrp > b.saleRate ? (b.mrp - b.saleRate) / b.mrp : 0;
          return discB - discA;
        });
      } else if (currentSort === 'price_asc') {
        filtered.sort((a, b) => a.saleRate - b.saleRate);
      } else if (currentSort === 'price_desc') {
        filtered.sort((a, b) => b.saleRate - a.saleRate);
      } else if (currentSort === 'name_asc') {
        filtered.sort((a, b) => (a.cleanName || a.name || '').localeCompare(b.cleanName || b.name || ''));
      } else if (currentSort === 'in_cart') {
        filtered = filtered.filter(p => cart[p.itcode] && cart[p.itcode].qty > 0);
      }

      return filtered;
    }

    function getBrandBadgeClass(mfr) {
      const u = mfr.toUpperCase();
      if (u.includes('REKITT')) return 'badge-dettol';
      if (u.includes('MARICO')) return 'badge-marico';
      if (u.includes('SLEEPY OWL')) return 'badge-sleepy';
      if (u.includes('MC VITTIES')) return 'badge-mcvitie';
      return 'badge-default';
    }

    function getShortBrand(mfr) {
      const u = mfr.toUpperCase();
      if (u.includes('REKITT')) return 'Dettol';
      if (u.includes('MARICO')) return 'Marico';
      if (u.includes('SLEEPY OWL')) return 'Sleepy Owl';
      if (u.includes('MC VITTIES')) return "McVitie's";
      return mfr;
    }

    // Render Products Grid & Table
    function renderProducts() {
      const filtered = getFilteredProducts();
      resultsCount.textContent = 'Showing ' + filtered.length + ' of ' + products.length + ' items';

      // 1. Render Cards Grid
      productsGrid.innerHTML = filtered.map(p => {
        const mrpText = p.mrp > 0 ? '₹' + p.mrp.toFixed(2) : '';
        const saleText = '₹' + p.saleRate.toFixed(2);
        const savings = (p.mrp > p.saleRate && p.saleRate > 0) ? (p.mrp - p.saleRate) : 0;
        const discountPct = (p.mrp > p.saleRate && p.mrp > 0) ? Math.round(((p.mrp - p.saleRate) / p.mrp) * 100) : 0;
        const imgSrc = p.imageBase64 || p.imageRelPath || fallbackSvg;
        const pTitle = p.cleanName || p.name || p.rawName || 'FMCG Item';
        const brandBadge = getShortBrand(p.mfr);
        const badgeClass = getBrandBadgeClass(p.mfr);
        const inCartItem = cart[p.itcode];
        const inCartQty = inCartItem ? inCartItem.qty : 0;
        const activeRate = inCartItem ? inCartItem.rate : p.saleRate;
        const caseChipsHtml = getBulkChipsHtml(p);

        return \`
          <div class="product-card" id="card-\${p.itcode}">
            <div class="card-img-wrap">
              <span class="card-brand-badge \${badgeClass}">\${brandBadge}</span>
              \${discountPct > 0 ? \`<span class="card-savings-badge">\${discountPct}% OFF</span>\` : ''}
              <img src="\${imgSrc}" alt="\${pTitle}" class="card-img" loading="lazy" onerror="this.onerror=null;this.src='\${fallbackSvg}'">
            </div>
            <div class="card-body">
              <div>
                <h3 class="product-title" title="\${pTitle}">\${pTitle}</h3>
                <div class="product-raw">\${p.rawName}</div>
                
                <!-- Vision SQL PACK1 Case Size Display -->
                <div class="case-size-badge" title="Master Case / Carton Size from Vision SQL">
                  📦 1 Case = <strong>\${p.pack || 1} \${p.unit || 'PCS'}</strong>
                </div>

                <div class="price-row">
                  <span class="sale-price">\${saleText}</span>
                  \${mrpText ? \`<span class="mrp-price">\${mrpText}</span>\` : ''}
                </div>
              </div>

              <div class="order-controls">
                <div class="rate-edit-pill">
                  <span>Rate: ₹</span>
                  <input type="number" step="0.5" class="card-rate-input" id="price-\${p.itcode}" value="\${activeRate.toFixed(2)}" onchange="updateCardRate(\${p.itcode}, this.value)" title="Negotiated B2B order rate">
                </div>

                <!-- Case Bulk Chips -->
                \${caseChipsHtml}

                <!-- Dynamic Smart Add Pill with Direct Manual Typing -->
                <div id="btn-wrap-\${p.itcode}">
                  \${inCartQty > 0 ? \`
                    <div class="smart-stepper">
                      <button class="smart-step-btn" onclick="quickStepQty(\${p.itcode}, -1)" title="Decrease 1 pc">−</button>
                      <div class="smart-input-wrap">
                        <input type="number" min="0" class="smart-qty-input" id="stepper-input-\${p.itcode}"
                               value="\${inCartQty}"
                               onchange="setCardQtyDirect(\${p.itcode}, this.value)"
                               onfocus="this.select()"
                               title="Click to manually edit total quantity (e.g. 25 pcs)">
                        <span class="smart-qty-unit">pcs in cart</span>
                      </div>
                      <button class="smart-step-btn" onclick="quickStepQty(\${p.itcode}, 1)" title="Increase 1 pc">+</button>
                    </div>
                  \` : \`
                    <button class="btn-smart-add" onclick="quickAdd(\${p.itcode})">
                      + ADD TO ORDER
                    </button>
                  \`}
                </div>
              </div>
            </div>
          </div>
        \`;
      }).join('');

      // 2. Render Table View
      tableBody.innerHTML = filtered.map(p => {
        const imgSrc = p.imageBase64 || p.imageRelPath || fallbackSvg;
        const pTitle = p.cleanName || p.name || p.rawName || 'FMCG Item';
        const inCartItem = cart[p.itcode];
        const inCartQty = inCartItem ? inCartItem.qty : 0;
        const activeRate = inCartItem ? inCartItem.rate : p.saleRate;

        return \`
          <tr>
            <td><img src="\${imgSrc}" class="table-thumb" loading="lazy" onerror="this.onerror=null;this.src='\${fallbackSvg}'"></td>
            <td>
              <strong>\${pTitle}</strong><br>
              <span class="case-size-badge" style="font-size:0.62rem">📦 Case: \${p.pack || 1} \${p.unit || 'PCS'}</span>
            </td>
            <td><small class="text-muted">\${p.rawName}</small></td>
            <td>\${p.mrp > 0 ? '₹' + p.mrp.toFixed(2) : '-'}</td>
            <td>
              <input type="number" step="0.5" class="card-rate-input" id="tbl-price-\${p.itcode}" value="\${activeRate.toFixed(2)}" onchange="updateCardRate(\${p.itcode}, this.value)">
            </td>
            <td>
              <strong style="color:var(--primary)">\${inCartQty > 0 ? inCartQty + ' pcs' : '-'}</strong>
            </td>
            <td>
              \${inCartQty > 0 ? \`
                <div class="smart-stepper" style="height:28px;width:105px;">
                  <button class="smart-step-btn" style="width:26px;font-size:0.9rem;" onclick="quickStepQty(\${p.itcode}, -1)">−</button>
                  <input type="number" min="0" class="smart-qty-input" style="width:38px;height:22px;font-size:0.75rem;" value="\${inCartQty}" onchange="setCardQtyDirect(\${p.itcode}, this.value)" onfocus="this.select()">
                  <button class="smart-step-btn" style="width:26px;font-size:0.9rem;" onclick="quickStepQty(\${p.itcode}, 1)">+</button>
                </div>
              \` : \`
                <button class="btn-smart-add" style="height:28px;width:70px;font-size:0.75rem;" onclick="quickAdd(\${p.itcode})">
                  + Add
                </button>
              \`}
            </td>
          </tr>
        \`;
      }).join('');
    }

    // Quick Add button
    function quickAdd(itcode) {
      const p = products.find(x => x.itcode === itcode);
      if (!p) return;

      const rateInput = document.getElementById('price-' + itcode) || document.getElementById('tbl-price-' + itcode);
      const rate = rateInput ? (parseFloat(rateInput.value) || p.saleRate) : p.saleRate;

      cart[itcode] = {
        itcode: p.itcode,
        name: p.cleanName || p.name || p.rawName,
        mfr: p.mfr,
        pack: parseInt(p.pack, 10) || 1,
        unit: p.unit || 'PCS',
        img: p.imageBase64 || p.imageRelPath || '',
        rate: rate,
        qty: 1
      };

      saveCart();
      renderProducts();
    }

    // Quick Step Quantity
    function quickStepQty(itcode, delta) {
      if (!cart[itcode]) {
        if (delta > 0) quickAdd(itcode);
        return;
      }
      cart[itcode].qty += delta;
      if (cart[itcode].qty <= 0) {
        delete cart[itcode];
      }
      saveCart();
      renderProducts();
    }

    // Bulk Case / Carton Add
    function addBulkQty(itcode, addPieces) {
      const p = products.find(x => x.itcode === itcode);
      if (!p) return;

      const rateInput = document.getElementById('price-' + itcode);
      const rate = rateInput ? (parseFloat(rateInput.value) || p.saleRate) : p.saleRate;

      if (!cart[itcode]) {
        cart[itcode] = {
          itcode: p.itcode,
          name: p.cleanName || p.name || p.rawName,
          mfr: p.mfr,
          pack: parseInt(p.pack, 10) || 1,
          unit: p.unit || 'PCS',
          img: p.imageBase64 || p.imageRelPath || '',
          rate: rate,
          qty: addPieces
        };
      } else {
        cart[itcode].qty += addPieces;
      }

      saveCart();
      renderProducts();
    }

    // Direct manual quantity set (e.g. typing 25 pcs directly)
    function setCardQtyDirect(itcode, val) {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed <= 0) {
        if (cart[itcode]) {
          delete cart[itcode];
          saveCart();
          renderProducts();
        }
        return;
      }
      const p = products.find(x => x.itcode === itcode);
      if (!p) return;

      const rateInput = document.getElementById('price-' + itcode) || document.getElementById('tbl-price-' + itcode);
      const rate = rateInput ? (parseFloat(rateInput.value) || p.saleRate) : p.saleRate;

      if (!cart[itcode]) {
        cart[itcode] = {
          itcode: p.itcode,
          name: p.cleanName || p.name || p.rawName,
          mfr: p.mfr,
          pack: parseInt(p.pack, 10) || 1,
          unit: p.unit || 'PCS',
          img: p.imageBase64 || p.imageRelPath || '',
          rate: rate,
          qty: parsed
        };
      } else {
        cart[itcode].qty = parsed;
      }

      saveCart();
      renderProducts();
    }

    // Toggle inline loose quantity row
    function toggleLooseRow(itcode, forceOpen) {
      const row = document.getElementById('loose-row-' + itcode);
      if (!row) return;
      const isHidden = row.style.display === 'none';
      const shouldOpen = forceOpen !== undefined ? forceOpen : isHidden;
      row.style.display = shouldOpen ? 'flex' : 'none';
      if (shouldOpen) {
        const input = document.getElementById('loose-input-' + itcode);
        if (input) {
          input.value = '';
          setTimeout(() => input.focus(), 60);
        }
      }
    }

    // Apply custom loose quantity (e.g. 25 pcs)
    function applyLooseQty(itcode) {
      const input = document.getElementById('loose-input-' + itcode);
      if (!input) return;
      const addPcs = parseInt(input.value, 10);
      if (!isNaN(addPcs) && addPcs > 0) {
        addBulkQty(itcode, addPcs);
      }
      toggleLooseRow(itcode, false);
    }

    // Update Card Rate
    function updateCardRate(itcode, newRateVal) {
      const parsed = parseFloat(newRateVal) || 0;
      if (cart[itcode]) {
        cart[itcode].rate = Math.max(0, parsed);
        saveCart();
      }
    }

    // Save and Update Cart State
    function saveCart() {
      localStorage.setItem('kmart_cart', JSON.stringify(cart));
      updateCartUI();
    }

    function clearCart() {
      if (confirm('Clear all items from your current order?')) {
        cart = {};
        saveCart();
        renderProducts();
      }
    }

    function updateCartUI() {
      const items = Object.values(cart);
      const totalItems = items.length;
      let totalPieces = 0;
      let grandTotal = 0;
      let fullCasesTally = 0;
      let loosePiecesTally = 0;

      items.forEach(item => {
        totalPieces += item.qty;
        grandTotal += (item.qty * item.rate);
        const pSize = parseInt(item.pack, 10) || 1;
        if (pSize > 1) {
          fullCasesTally += Math.floor(item.qty / pSize);
          loosePiecesTally += (item.qty % pSize);
        }
      });

      // Update Bottom Sticky Bar
      if (totalPieces > 0) {
        stickyBottomBar.style.display = 'flex';
        bottomCartPieces.textContent = totalPieces + ' pcs';
        bottomCartTotal.textContent = '₹' + grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        bottomCartItems.textContent = totalItems + ' product' + (totalItems > 1 ? 's' : '') + ' in order';
      } else {
        stickyBottomBar.style.display = 'none';
      }

      // Update Drawer Badges & Summaries
      drawerCountBadge.textContent = totalPieces + ' Pcs';
      cartSummaryItems.textContent = totalItems + ' items';
      cartSummaryPieces.textContent = totalPieces + ' pcs';

      // Master Case Tally in Drawer
      if (fullCasesTally > 0) {
        let caseTallyText = fullCasesTally + ' Full Case' + (fullCasesTally > 1 ? 's' : '');
        if (loosePiecesTally > 0) caseTallyText += ' + ' + loosePiecesTally + ' loose';
        cartSummaryCases.textContent = caseTallyText;
        document.getElementById('caseSummaryRow').style.display = 'flex';
      } else {
        document.getElementById('caseSummaryRow').style.display = 'none';
      }

      cartSummaryTotal.textContent = '₹' + grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      // Render Drawer Item List
      if (items.length === 0) {
        cartItemsList.innerHTML = \`
          <div class="empty-cart">
            <div class="empty-cart-icon">🛒</div>
            <p>Your order is currently empty.</p>
            <small>Tap "+ ADD" or "+1 Case" on any product to build an order!</small>
          </div>
        \`;
      } else {
        cartItemsList.innerHTML = items.map(item => {
          const lineTotal = (item.qty * item.rate);
          const imgSrc = item.img || fallbackSvg;
          const caseBreakdownText = formatCaseBreakdown(item.qty, item.pack);

          return \`
            <div class="cart-item">
              <img src="\${imgSrc}" class="cart-item-img" onerror="this.onerror=null;this.src='\${fallbackSvg}'">
              <div class="cart-item-info">
                <div class="cart-item-name">\${item.name}</div>
                <div class="cart-item-case-badge">
                  📦 \${caseBreakdownText} (Pack: \${item.pack || 1})
                </div>
                <div class="cart-item-rate-row">
                  <span>Rate ₹</span>
                  <input type="number" step="0.5" class="cart-rate-input" value="\${item.rate.toFixed(2)}" onchange="updateDrawerItemRate(\${item.itcode}, this.value)">
                </div>
                <div class="cart-item-bottom">
                  <div class="cart-item-stepper">
                    <button class="cart-step-btn" onclick="updateCartItemQty(\${item.itcode}, -1)">−</button>
                    <input type="number" class="cart-qty-input" value="\${item.qty}" min="1" onchange="setCartItemQty(\${item.itcode}, this.value)">
                    <button class="cart-step-btn" onclick="updateCartItemQty(\${item.itcode}, 1)">+</button>
                  </div>
                  <div class="cart-item-total">₹\${lineTotal.toFixed(2)}</div>
                  <button class="btn-remove-item" onclick="removeCartItem(\${item.itcode})" title="Remove item">🗑️</button>
                </div>
              </div>
            </div>
          \`;
        }).join('');
      }
    }

    function toggleCart(open) {
      cartDrawer.classList.toggle('open', open);
      drawerOverlay.classList.toggle('open', open);
    }

    function updateCartItemQty(itcode, delta) {
      if (!cart[itcode]) return;
      cart[itcode].qty += delta;
      if (cart[itcode].qty <= 0) delete cart[itcode];
      saveCart();
      renderProducts();
    }

    function setCartItemQty(itcode, val) {
      if (!cart[itcode]) return;
      const parsed = parseInt(val) || 1;
      cart[itcode].qty = Math.max(1, parsed);
      saveCart();
      renderProducts();
    }

    function updateDrawerItemRate(itcode, val) {
      if (!cart[itcode]) return;
      const parsed = parseFloat(val) || 0;
      cart[itcode].rate = Math.max(0, parsed);
      saveCart();
      renderProducts();
    }

    function removeCartItem(itcode) {
      delete cart[itcode];
      saveCart();
      renderProducts();
    }

    // Saved Kirana / Shop Profiles Management
    function loadSavedShopsDropdown() {
      const saved = JSON.parse(localStorage.getItem('kmart_saved_shops') || '[]');
      savedShopSelect.innerHTML = '<option value="">-- Choose frequent store --</option>';
      saved.forEach((shop, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = shop.name + (shop.phone ? ' (' + shop.phone + ')' : '');
        savedShopSelect.appendChild(opt);
      });
    }

    function onSelectSavedShop(indexVal) {
      if (indexVal === '') return;
      const saved = JSON.parse(localStorage.getItem('kmart_saved_shops') || '[]');
      const shop = saved[parseInt(indexVal)];
      if (shop) {
        document.getElementById('custName').value = shop.name || '';
        document.getElementById('custPhone').value = shop.phone || '';
        document.getElementById('custNotes').value = shop.notes || '';
      }
    }

    function saveCurrentShop() {
      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const notes = document.getElementById('custNotes').value.trim();

      if (!name) {
        alert('Please enter a Customer / Shop Name first to save it!');
        return;
      }

      let saved = JSON.parse(localStorage.getItem('kmart_saved_shops') || '[]');
      // check if already exists
      const existingIdx = saved.findIndex(s => s.name.toLowerCase() === name.toLowerCase());
      if (existingIdx >= 0) {
        saved[existingIdx] = { name, phone, notes };
      } else {
        saved.push({ name, phone, notes });
      }

      localStorage.setItem('kmart_saved_shops', JSON.stringify(saved));
      loadSavedShopsDropdown();
      alert('Shop "' + name + '" saved successfully for 1-tap selection!');
    }

    // Bill Receipt Modal Preview
    function generateBillReceiptText() {
      const items = Object.values(cart);
      if (items.length === 0) return 'Your cart is empty.';

      const custName = document.getElementById('custName').value.trim() || 'Valued Store';
      const custPhone = document.getElementById('custPhone').value.trim();
      const custNotes = document.getElementById('custNotes').value.trim();
      const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

      let totalPieces = 0;
      let grandTotal = 0;
      let fullCasesTally = 0;
      let looseTally = 0;

      let bill = '========================================\\n';
      bill += '         KMART WHOLESALE FMCG           \\n';
      bill += '          ORDER BILL ESTIMATE           \\n';
      bill += '========================================\\n';
      bill += 'Store: ' + custName + '\\n';
      if (custPhone) bill += 'Phone: ' + custPhone + '\\n';
      bill += 'Date : ' + now + '\\n';
      bill += '----------------------------------------\\n';
      bill += 'ITEM                           QTY   RATE    TOTAL\\n';
      bill += '----------------------------------------\\n';

      items.forEach((item, idx) => {
        const lineTotal = item.qty * item.rate;
        const packSize = parseInt(item.pack, 10) || 1;
        totalPieces += item.qty;
        grandTotal += lineTotal;

        if (packSize > 1) {
          fullCasesTally += Math.floor(item.qty / packSize);
          looseTally += (item.qty % packSize);
        }

        const nameTrunc = item.name.length > 25 ? item.name.substring(0, 24) + '…' : item.name.padEnd(25, ' ');
        const qtyStr = String(item.qty).padStart(4, ' ');
        const rateStr = item.rate.toFixed(2).padStart(7, ' ');
        const totStr = lineTotal.toFixed(2).padStart(8, ' ');

        bill += nameTrunc + qtyStr + rateStr + totStr + '\\n';
        if (packSize > 1) {
          bill += '  [Case: ' + formatCaseBreakdown(item.qty, packSize) + ']\\n';
        }
      });

      bill += '----------------------------------------\\n';
      bill += 'TOTAL PRODUCTS : ' + items.length + '\\n';
      bill += 'TOTAL QUANTITY : ' + totalPieces + ' pcs';
      if (fullCasesTally > 0) {
        bill += ' (' + fullCasesTally + ' Cases' + (looseTally > 0 ? ' + ' + looseTally + ' loose' : '') + ')';
      }
      bill += '\\n';
      bill += 'GRAND TOTAL    : ₹' + grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '\\n';
      if (custNotes) {
        bill += 'Delivery Note  : ' + custNotes + '\\n';
      }
      bill += '========================================\\n';
      bill += 'Direct dispatch to: +91 98775 70829';

      return bill;
    }

    function openBillPreview() {
      const items = Object.values(cart);
      if (items.length === 0) {
        alert('Your cart is empty! Add products first.');
        return;
      }
      const billText = generateBillReceiptText().replace(/\\\\n/g, '\\n');
      document.getElementById('billModalContent').textContent = billText;
      document.getElementById('billModalOverlay').classList.add('open');
    }

    function closeBillModal(e) {
      document.getElementById('billModalOverlay').classList.remove('open');
    }

    function copyBillText() {
      const text = document.getElementById('billModalContent').textContent;
      navigator.clipboard.writeText(text).then(() => {
        alert('Order receipt copied to clipboard! You can paste it into SMS, Notes, or WhatsApp.');
      }).catch(() => {
        alert('Receipt text ready to copy.');
      });
    }

    // Place Order Directly on WhatsApp (Strictly to +91 98775 70829)
    function placeOrderWhatsApp() {
      const items = Object.values(cart);
      if (items.length === 0) {
        alert('Your order is empty! Please add products before placing an order.');
        return;
      }

      const custName = document.getElementById('custName').value.trim() || 'Valued Customer';
      const custPhone = document.getElementById('custPhone').value.trim();
      const custNotes = document.getElementById('custNotes').value.trim();

      const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

      let totalPieces = 0;
      let grandTotal = 0;
      let totalFullCases = 0;
      let totalLoosePieces = 0;

      let msg = '🛒 *NEW ORDER - KMART FMCG*\\n';
      msg += '━━━━━━━━━━━━━━━━━━━━\\n';
      msg += '👤 *Customer / Shop:* ' + custName + '\\n';
      if (custPhone) msg += '📞 *Phone:* ' + custPhone + '\\n';
      msg += '📅 *Date:* ' + now + '\\n';
      msg += '━━━━━━━━━━━━━━━━━━━━\\n\\n';

      items.forEach((item, index) => {
        const lineTotal = item.qty * item.rate;
        const packSize = parseInt(item.pack, 10) || 1;
        totalPieces += item.qty;
        grandTotal += lineTotal;

        const caseText = formatCaseBreakdown(item.qty, packSize);
        if (packSize > 1) {
          totalFullCases += Math.floor(item.qty / packSize);
          totalLoosePieces += (item.qty % packSize);
        }

        msg += (index + 1) + '. *' + item.name + '*\\n';
        msg += '   • Qty: ' + caseText + ' | Rate: ₹' + item.rate.toFixed(2) + '\\n';
        msg += '   • Subtotal: ₹' + lineTotal.toFixed(2) + '\\n\\n';
      });

      msg += '━━━━━━━━━━━━━━━━━━━━\\n';
      msg += '📦 *Total Products:* ' + items.length + '\\n';
      msg += '🔢 *Total Quantity:* ' + totalPieces + ' pcs';
      if (totalFullCases > 0) {
        msg += ' (' + totalFullCases + ' Full Case' + (totalFullCases > 1 ? 's' : '');
        if (totalLoosePieces > 0) msg += ' + ' + totalLoosePieces + ' loose pcs';
        msg += ')';
      }
      msg += '\\n';
      msg += '💰 *GRAND TOTAL:* ₹' + grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '\\n';
      if (custNotes) {
        msg += '📝 *Note:* ' + custNotes + '\\n';
      }
      msg += '━━━━━━━━━━━━━━━━━━━━\\n';
      msg += 'Order placed via KMART Digital Catalog';

      const encodedMsg = encodeURIComponent(msg);
      const targetPhone = '919877570829';
      const whatsappUrl = 'https://wa.me/' + targetPhone + '?text=' + encodedMsg;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
    }

    // Start App
    window.addEventListener('DOMContentLoaded', init);
  </script>
</body>
</html>`;
}

module.exports = { buildCatalogHtml };
