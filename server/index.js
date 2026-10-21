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

// Security middlewares - Configured for cross-origin API access
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigin = process.env.CLIENT_ORIGIN;

// Support multiple allowed origins via comma-separated CLIENT_ORIGIN
// e.g. "https://samridhi.vercel.app,https://samridhi-git-main-justsamridhi.vercel.app"
const allowedOrigins = allowedOrigin
  ? allowedOrigin.split(',').map(o => o.trim()).filter(Boolean)
  : [];

// Debug logging for CORS issues
console.log(CORS allowed origins: );

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, same-origin server calls)
    if (!origin) return callback(null, true);
    // No CLIENT_ORIGIN set ? dev mode, allow everything
    if (allowedOrigins.length === 0) return callback(null, true);
    // Allow exact matches or any *.vercel.app preview subdomain
    const allowed =
      allowedOrigins.includes(origin) ||
      /^https:\/\/[^.]+\.vercel\.app$/.test(origin);
    if (allowed) return callback(null, true);
    callback(new Error(CORS: origin  not allowed));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'x-admin-secret', 'Authorization'],
}));

// Body parsing — 10kb comfortably fits the 256-cell pixel grid payload (~3kb)
// while still blocking unreasonably large requests.
app.use(express.json({ limit: '10kb' }));

// Health check route
app.get('/api/health', async (req, res) => {
  const dbStatus = isConnected ? 'connected' : 'disconnected';
  res.json({ status: 'ok', dbConnected: isConnected, dbStatus });
});

app.get('/api/deploy-check', (req, res) => {
  res.json({
    deployed: true,
    service: 'samridhi-portfolio-backend',
    marker: 'deploy-check-v2-guestbook-fix'
  });
});

// API routers - ALL THREE should be mounted
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
      console.log(Server listening on http://localhost:);
    });
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
})();
