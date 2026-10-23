import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const clientPublicDir = path.resolve(__dirname, 'public');

const assetsSrc = path.join(rootDir, 'assets');
const documentsSrc = path.join(rootDir, 'documents');
const artSrc = path.join(rootDir, 'art');

const assetsDest = path.join(clientPublicDir, 'assets');
const documentsDest = path.join(clientPublicDir, 'documents');
const artDest = path.join(clientPublicDir, 'art');

fs.mkdirSync(clientPublicDir, { recursive: true });

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying assets, documents, and art to client/public...');
copyRecursive(assetsSrc, assetsDest);
copyRecursive(documentsSrc, documentsDest);
copyRecursive(artSrc, artDest);
console.log('Successfully copied assets, documents, and art to client/public!');
