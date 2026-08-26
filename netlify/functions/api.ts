/**
 * Netlify Serverless Function
 * Menghubungkan route /api/* ke Express app kita (server.ts)
 */
import 'dotenv/config';
import serverlessExpress from '@codegenie/serverless-express';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from '../../server/routes';
import { db } from '../../server/db/database';

// ESM compatible dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parse JSON & URL-encoded (support foto base64 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 🌱 Seed users default (pastikan admin selalu ada)
(async () => {
  try {
    // @ts-ignore - method sudah ditambahkan via diff sebelumnya
    if (db.seedDefaultUsersIfEmpty) await db.seedDefaultUsersIfEmpty();
  } catch (e) {
    console.warn('[Seed] Skip seed default users:', e);
  }
})();

// Mount API routes dari project asli
app.use('/api', apiRouter);

// Static assets hasil Vite build (ada di folder dist/)
const distPath = path.resolve(__dirname, '..', '..', 'dist');
app.use(express.static(distPath));

// SPA Fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Export handler untuk Netlify
export const handler = serverlessExpress({ app });