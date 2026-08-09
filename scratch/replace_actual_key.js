const fs = require('fs');

const validKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVreHprYmduZXF3aHVrZ2JoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgxNTc1OCwiZXhwIjoyMDk2MzkxNzU4fQ.AqoLdTgNGrsC1eCmKriAV1K8cPeRny4ORaT26V4Gexc';
const searchStr = 'https://kmfekxzkbgneqwhukgbh.supabase.co","';

['dist/assets/index-DYXXu0wA.js', 'dist/assets/index-D0CI6L84.js'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const idx = content.indexOf(searchStr);
    if (idx !== -1) {
      const start = idx + searchStr.length;
      const end = content.indexOf('"', start);
      const oldKey = content.substring(start, end);
      console.log(`Replacing key in ${filePath} (old key length: ${oldKey.length})...`);
      content = content.substring(0, start) + validKey + content.substring(end);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Successfully updated ${filePath}`);
    } else {
      console.log(`Search pattern not found in ${filePath}`);
    }
  }
});
