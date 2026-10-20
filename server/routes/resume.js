import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve document folder (one level up from server)
const documentsDir = path.resolve(__dirname, '..', 'documents');

router.get('/pdf', (req, res) => {
  const filePath = path.join(documentsDir, 'Resume.pdf');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).json({ error: 'Resume PDF not found' });
    }
  });
});

router.get('/docx', (req, res) => {
  const filePath = path.join(documentsDir, 'Resume.docx');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).json({ error: 'Resume DOCX not found' });
    }
  });
});

export default router;
