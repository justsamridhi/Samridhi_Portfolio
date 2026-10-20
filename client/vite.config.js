import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Immediately sync assets and documents to client/public when config is loaded
const rootDir = path.resolve(__dirname, '..');
const clientPublicDir = path.resolve(__dirname, 'public');

const copyRecursive = (src, dest) => {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    if (!fs.existsSync(dest) || fs.statSync(dest).size !== stat.size) {
      fs.copyFileSync(src, dest);
    }
  }
};

try {
  copyRecursive(path.join(rootDir, 'assets'), path.join(clientPublicDir, 'assets'));
  copyRecursive(path.join(rootDir, 'documents'), path.join(clientPublicDir, 'documents'));
} catch (e) {
  console.warn('Syncing static assets:', e.message);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
