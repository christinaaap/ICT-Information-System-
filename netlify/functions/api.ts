/**
 * 🔥 Netlify Serverless Function - REWRITTEN v2 - FIX fileURLToPath UNDEFINED
 * Sumber: Process Boot TIDAK pakai import.meta.url lagi (CJS compatible)
 */
import { config as loadEnv } from 'dotenv';
import { resolve, dirname } from 'path';

// ============================================================
// 1. ENVIRONMENT VARS (LOAD AWAL, TANPA import.meta)
// ============================================================
const projectRoot = resolve(process.cwd());
try { loadEnv({ path: resolve(projectRoot, '.env'), override: true }); } catch (_) { /* ignore */ }

console.log('\n🚀 [Netlify Function v2] BOOT START');
console.log('   CWD / projectRoot        :', projectRoot);
console.log('   NODE_VERSION             :', process.version);
console.log('   SUPABASE_URL             :', process.env.SUPABASE_URL ? '✅ ADA (' + String(process.env.SUPABASE_URL).slice(8, 28) + '...)' : '❌ TIDAK ADA 🔥');
console.log('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ ADA (panjang=' + String(process.env.SUPABASE_SERVICE_ROLE_KEY).length + ')' : '❌ TIDAK ADA 🔥');
console.log('   SUPABASE_ANON_KEY        :', process.env.SUPABASE_ANON_KEY ? '✅ ADA' : '⚠️  TIDAK ADA');

// ============================================================
// 2. HANDLER FACTORY DENGAN POLLING BOOT
//    Menunggu Promise main() selesai sebelum menerima request
// ============================================================
let bootDone = false;
let bootError: Error | null = null;
let handlerInner: any = null;

// IIFE Async main() - BOOT SEQUENCE (ESM dynamic import -> tidak ada top level crash)
(async function main() {
  try {
    // Hitung __dirnameLocal dengan 3 fallback (TIDAK PERLU import.meta.url di top-level)
    let __dirnameLocal = resolve(projectRoot, 'netlify', 'functions');
    try {
      const metaUrl: string | undefined = (typeof import.meta !== 'undefined') ? import.meta.url : undefined;
      if (metaUrl) {
        const { fileURLToPath } = await import('url');
        __dirnameLocal = dirname(fileURLToPath(metaUrl));
      }
    } catch (_ignore) {
      // Pakai default di atas
    }
    console.log('   __dirname Local          :', __dirnameLocal);

    // Dynamic Import (tidak di-eval sebelum try)
    const serverlessExpressModule = await import('@codegenie/serverless-express');
    const serverlessExpress = (serverlessExpressModule as any).default || serverlessExpressModule;
    const express = (await import('express')).default;
    const apiRouter = (await import('../../server/routes')).default;
    const { db } = await import('../../server/db/database');

    // (Opsional) Seed Users Default
    try {
      // @ts-ignore: optional method
      if (typeof (db as any).seedDefaultUsersIfEmpty === 'function') {
        const seedRes = await (db as any).seedDefaultUsersIfEmpty();
        console.log('🌱 [Seed Users] OK. Inserted:', seedRes.inserted, 'Total:', seedRes.total);
      } else {
        console.log('ℹ️  [Seed Users] Method tidak ada, skip (tidak masalah).');
      }
    } catch (seedErr: any) {
      console.warn('⚠️  [Seed Users] Skip (non-fatal):', seedErr?.message);
    }

    // Init Express
    const app = express();
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Health Check endpoint (mudah test)
    app.get('/api/health', (_req: any, res: any) => {
      res.json({
        status: 'ok',
        service: 'DSLNG ICT Backend - Netlify Function v2',
        timestamp: new Date().toISOString(),
        supabase: process.env.SUPABASE_URL ? 'ready' : 'missing',
        root: projectRoot,
      });
    });

    // Mount API routes dari project asli
    app.use('/api', apiRouter);

    // Static files Vite build + SPA fallback (3 kandidat path)
    const fs = await import('fs');
    const distCandidates = [
      resolve(__dirnameLocal, '..', '..', 'dist'),
      resolve(projectRoot, 'dist'),
      resolve('/var/task/dist'),
    ];
    const distPath = distCandidates.find(p => { try { return fs.existsSync(p); } catch { return false; } }) || distCandidates[1];
    console.log('📦 Folder dist (static React):', distPath);
    app.use(express.static(distPath));
    app.get('*', (_req: any, res: any) => {
      res.sendFile(resolve(distPath, 'index.html'));
    });

    handlerInner = serverlessExpress({ app });
    bootDone = true;
    console.log('✅ [Netlify Function v2] BOOT SELESAI - SIAP MENERIMA REQUEST!\n');

  } catch (fatal: any) {
    bootDone = true;
    bootError = fatal instanceof Error ? fatal : new Error(String(fatal));
    console.error('\n❌❌❌ [FATAL BOOT ERROR v2] ❌❌❌');
    console.error('   Message:', bootError.message);
    console.error('   Stack  :', bootError.stack);
    console.error('❌❌❌ [END FATAL BOOT ERROR] ❌❌❌\n');

    // Fallback handler - kasih error JSON ke browser (bukan 502 diam)
    handlerInner = async () => ({
      statusCode: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        error: '[Netlify Function v2] BOOT FAILURE. Lihat Function Logs di Netlify Dashboard.',
        reason: bootError?.message || '',
        stack: bootError?.stack || '',
        envCheck: {
          SUPABASE_URL: process.env.SUPABASE_URL ? 'OK' : 'MISSING',
          SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'OK' : 'MISSING',
          SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'OK' : 'MISSING',
        },
      }, null, 2),
    });
  }
})();

// ============================================================
// 3. TOP-LEVEL EXPORT HANDLER - Netlify manggil ini
// ============================================================
function waitForReady(timeoutMs = 20000): Promise<any> {
  return new Promise((resFn, rejFn) => {
    const startTs = Date.now();
    const tick = () => {
      if (handlerInner) {
        resFn(handlerInner);
      } else if (bootDone && bootError) {
        // Sudah selesai boot tapi error - return fallback handler secepatnya
        resFn(async () => ({
          statusCode: 500,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ error: 'Boot failed', reason: bootError?.message }),
        }));
      } else if (Date.now() - startTs > timeoutMs) {
        rejFn(new Error('Boot Function timeout (> ' + timeoutMs + 'ms)'));
      } else {
        setTimeout(tick, 50);
      }
    };
    tick();
  });
}

async function handler(event: any, context: any) {
  const impl = await waitForReady();
  return impl(event, context);
}

// ESM + CJS Compatible Export
export { handler };
export default handler;