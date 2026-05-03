const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'src', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const backend = process.env.BACKEND_URL || process.env.NG_APP_BACKEND_URL || '';
const replacement = backend || '/api';

content = content.replace(/%BACKEND_URL%/g, replacement);
fs.writeFileSync(indexPath, content, 'utf8');
console.log('set-backend-url: wrote', replacement, 'to src/index.html');
