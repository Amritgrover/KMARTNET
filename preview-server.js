const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  // Normalize URL paths to prevent directory traversal
  let safeUrl = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, safeUrl === '/' ? 'index.html' : safeUrl);
  
  // SPA routing: if file doesn't exist and has no extension, fallback to index.html
  if (!fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    if (!ext) {
      filePath = path.join(DIST_DIR, 'index.html');
    }
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}\n`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 KMART Preview Server started!`);
  console.log(`👉 Access the app at: http://localhost:${PORT}/`);
  console.log(`==================================================\n`);
});
