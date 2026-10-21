import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dbConnect, { isConnected } from './config/db.js';
import contactRouter from './routes/contact.js';
import resumeRouter from './routes/resume.js';
import guestbookRouter from './routes/guestbook.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middlewares
app.use(helmet());

const allowedOrigin = process.env.CLIENT_ORIGIN;
app.use(cors({
  // When CLIENT_ORIGIN is set (production), use that specific origin so
  // credentialed requests work. Fall back to '*' only in local dev where
  // credentials aren't needed.
  origin: allowedOrigin || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  // credentials can only be true when origin is not '*'
  credentials: !!allowedOrigin,
}));

// Body parsing (limit to 2kb to accommodate pixel data)
app.use(express.json({ limit: '2kb' }));

// Health check route
app.get('/api/health', async (req, res) => {
  const dbStatus = isConnected ? 'connected' : 'disconnected';
  res.json({ status: 'ok', dbConnected: isConnected, dbStatus });
});

// API routers
app.use('/api/contact', contactRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/guestbook', guestbookRouter);

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
})();
