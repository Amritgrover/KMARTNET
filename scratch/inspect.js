const fs = require('fs');
const path = require('path');

const jsPath1 = path.join(__dirname, '../dist/assets/index-DYXXu0wA.js');
const jsPath2 = path.join(__dirname, '../dist/assets/index-D0CI6L84.js');

const code1 = fs.readFileSync(jsPath1, 'utf8');
const code2 = fs.readFileSync(jsPath2, 'utf8');

console.log('Are bundle files identical?', code1 === code2);

const keywords = [
  'image_url', 'Staples', 'Biscuits', 'Beverages', 'Snacks',
  'disclosure', 'tooltip', 'details', 'summary',
  'bottom-nav', 'Home/Catalogue', 'Search', 'Profile', 'Orders',
  'scroll', 'gradient', 'pill', 'count',
  'skeleton', 'shimmer', 'fade-in',
  'checkmark', 'fly-to-cart', 'success',
  'badge', 'red', 'circular',
  'FAB', 'floating-cart', 'pulse',
  'keypad', 'shake', 'spinner', 'PIN',
  'forest', '#2d6a4f', '#1b4332', '#d4a843', '#e65c00', 'box-shadow', 'border-radius',
  'autocomplete', 'recent', '✕',
  'online', 'offline', 'cached catalog',
  'Install KMART App', 'dismissible',
  'sparkline', 'SVG', 'pie', 'bar', 'low stock', 'warning'
];

console.log('\n--- Keyword Search Results in index-DYXXu0wA.js ---');
for (const kw of keywords) {
  const count = (code1.match(new RegExp(kw.replace(/[#-.]/g, '\\$&'), 'gi')) || []).length;
  console.log(`Keyword "${kw}": ${count} matches`);
}
