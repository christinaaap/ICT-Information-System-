/**
 * 🔥 Netlify Serverless Function - v4 (ALL TS FIXED) - MANUAL EXPRESS-NETLIFY BRIDGE
 * ✅ Tidak ada error TypeScript: headers type-safe, reqMock.on compliant
 */
import { config as loadEnv } from 'dotenv';
import { resolve, dirname } from 'path';
import { createServer } from 'http';

// -------- ENV --------
const projectRoot = resolve(process.cwd());
try { loadEnv({ path: resolve(projectRoot, '.env'), override: true }); } catch (_) { /* ignore */ }

console.log('\n🚀 [Netlify Function v4 FINAL] BOOT START');
console.log('   NODE_VERSION  :', process.version);
console.log('   SUPABASE_URL  :', process.env.SUPABASE_URL ? '✅' : '❌ MISSING 🔥');
console.log('   SERVICE_ROLE  :', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌ MISSING 🔥');

// -------- BOOT STATE (singleton) --------
type BootState = 'pending' | 'ready' | 'error';
let bootState: BootState = 'pending';
let bootErrorMsg = '';
let expressApp: any = null;

async function doBoot() {
  try {
    let __dirnameLocal = resolve(projectRoot, 'netlify', 'functions');
    try {
      const metaUrl: string | undefined = (typeof import.meta !== 'undefined') ? import.meta.url : undefined;
      if (metaUrl) {
        const { fileURLToPath } = await import('url');
        __dirnameLocal = dirname(fileURLToPath(metaUrl));
      }
    } catch (_) { /* default fallback */ }

    const expressPkg = await import('express');
    const express = (expressPkg as any).default || expressPkg;
    const apiRouterPkg = await import('../../server/routes');
    const apiRouter = (apiRouterPkg as any).default || apiRouterPkg;

    try {
      const { db } = await import('../../server/db/database');
      if (db && typeof (db as any).seedDefaultUsersIfEmpty === 'function') {
        const seed = await (db as any).seedDefaultUsersIfEmpty();
        console.log('🌱 [Seed] inserted:', seed.inserted, '/ total users:', seed.total);
      }
    } catch (se: any) { console.warn('⚠️  [Seed] Skip:', se?.message); }

    const app = express();
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.get('/api/health', (_req: any, res: any) => {
      res.json({ status: 'ok', service: 'DSLNG ICT v4', ts: new Date().toISOString() });
    });
    app.use('/api', apiRouter);

    const fs = await import('fs');
    const distCandidates = [
      resolve(__dirnameLocal, '..', '..', 'dist'),
      resolve(projectRoot, 'dist'),
      resolve('/var/task/dist'),
    ];
    const distPath = distCandidates.find(p => {
      try { return fs.existsSync(p); } catch { return false; }
    }) || distCandidates[1];
    console.log('📦 dist folder =', distPath);
    app.use(express.static(distPath));
    app.get('*', (_req: any, res: any) => {
      res.sendFile(resolve(distPath, 'index.html'));
    });

    expressApp = app;
    bootState = 'ready';
    console.log('✅ BOOT DONE - EXPRESS APP READY!\n');
  } catch (e: any) {
    bootState = 'error';
    bootErrorMsg = e?.message || 'Boot error';
    console.error('❌ BOOT FAILURE:', bootErrorMsg);
    console.error(e?.stack);
  }
}

void doBoot();

async function waitForReady(timeoutMs = 25000): Promise<void> {
  const start = Date.now();
  while (bootState === 'pending' && (Date.now() - start) < timeoutMs) {
    await new Promise(r => setTimeout(r, 50));
  }
  if (bootState === 'pending') throw new Error('Boot timeout > ' + timeoutMs + 'ms');
  if (bootState === 'error')   throw new Error('Boot error: ' + bootErrorMsg);
  if (!expressApp)             throw new Error('Express app null');
}

// =================================================================
// 🔥 NETLIFY EVENT  ↔  EXPRESS (req, res) — MANUAL BRIDGE
//    Tanpa @codegenie/serverless-express. No TS errors.
// =================================================================
function runExpressOnNetlify(app: any, event: any) {
  const method    = String(event.httpMethod  || event.requestContext?.http?.method || 'GET').toUpperCase();
  const rawPath   = String(event.rawUrl      || event.path || event.requestContext?.http?.path || '/');
  const qs        = new URLSearchParams(event.queryStringParameters || {}).toString();
  const finalUrl  = qs ? `${rawPath}?${qs}` : rawPath;

  // ========= HEADERS: Type-safe for-loop (no Object.fromEntries error!) =========
  const lowerHeaders: Record<string, any> = {};
  const rawHeaders: Record<string, any> = event.headers || {};
  for (const hKey in rawHeaders) {
    if (!Object.prototype.hasOwnProperty.call(rawHeaders, hKey)) continue;
    const val = rawHeaders[hKey];
    if (val === null || val === undefined) continue;
    lowerHeaders[String(hKey).toLowerCase()] = val;
  }

  // ========= Mock IncomingMessage (TANPA error TS! TIPIS TAPI LENGKAP) =========
  const reqMock: any = {
    method,
    url: finalUrl,
    path: rawPath,
    originalUrl: finalUrl,
    headers: lowerHeaders,
    query: event.queryStringParameters || {},
    params: {},
    body: undefined,
    _readableState: { objectMode: false, buffer: { head: null, tail: null, length: 0 }, flowing: true, ended: false, },
    aborted: false,
    httpVersion: '1.1',
    httpVersionMajor: 1,
    httpVersionMinor: 1,
    complete: true,
  };

  // Setup body: jika ada → trigger 'data' kemudian 'end'
  const hasBody = event.body !== null && event.body !== undefined && event.body !== '';
  const rawBody: Buffer = hasBody
    ? (event.isBase64Encoded ? Buffer.from(event.body, 'base64') : Buffer.from(String(event.body)))
    : Buffer.alloc(0);
  reqMock.body = rawBody.length ? rawBody : undefined;

  // Stub .on() EventEmitter (no return type mismatch TS)
  reqMock.on = function (this: any, evName: string, listener: any) {
    if (evName === 'data' && rawBody.length > 0) process.nextTick(() => listener(rawBody));
    if (evName === 'end')                         process.nextTick(listener);
    return this;
  };
  reqMock.once = reqMock.on;
  reqMock.removeListener = function () { return reqMock; };
  reqMock.removeAllListeners = function () { return reqMock; };
  reqMock.emit = function () { return true; };
  reqMock.pipe = function (dest: any) { return dest; };
  reqMock.unpipe = function () { return reqMock; };

  // ========= Mock ServerResponse → tangkap output → format Netlify Response =========
  let statusCodeOut = 200;
  const headersOut: Record<string, any> = {};
  const chunks: Buffer[] = [];
  let finishedResolve: (value: any) => void;
  const finishedPromise = new Promise<any>((r) => { finishedResolve = r; });

  const resMock: any = {
    statusCode: 200,
    statusMessage: 'OK',
    finished: false,
    headersSent: false,

    writeHead(status: number, reasonOrHeaders?: any, maybeHeaders?: any) {
      statusCodeOut = status;
      const h = typeof reasonOrHeaders === 'object' ? reasonOrHeaders : maybeHeaders;
      if (h) { for (const k in h) if (Object.prototype.hasOwnProperty.call(h, k)) { headersOut[String(k).toLowerCase()] = h[k]; } }
      return resMock;
    },
    setHeader(name: string, value: any) {
      headersOut[String(name).toLowerCase()] = value;
      return resMock;
    },
    getHeader(name: string) { return headersOut[String(name).toLowerCase()]; },
    getHeaders()     { return headersOut; },
    hasHeader(name: string) { return Object.prototype.hasOwnProperty.call(headersOut, String(name).toLowerCase()); },
    removeHeader(name: string) { delete headersOut[String(name).toLowerCase()]; return resMock; },
    addTrailers()    { return resMock; },
    assignSocket()   { },
    detachSocket()   { },
    write(chunk: any, encodingOrCb?: any, cb?: any) {
      const piece = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), typeof encodingOrCb === 'string' ? encodingOrCb : undefined);
      chunks.push(piece);
      if (typeof encodingOrCb === 'function') process.nextTick(encodingOrCb);
      else if (typeof cb === 'function')       process.nextTick(cb);
      return true;
    },
    writeContinue(cb?: any) { if (cb) process.nextTick(cb); return resMock; },
    writeProcessing() { return resMock; },
    writeEarlyHints() { return resMock; },
    end(chunkOrEnc?: any, encodingOrCb?: any, cb?: any) {
      if (typeof chunkOrEnc !== 'undefined' && chunkOrEnc !== null && typeof chunkOrEnc !== 'function') {
        const piece = Buffer.isBuffer(chunkOrEnc) ? chunkOrEnc : Buffer.from(String(chunkOrEnc), typeof encodingOrCb === 'string' ? encodingOrCb : undefined);
        chunks.push(piece);
      }
      const finalCb: any = typeof chunkOrEnc === 'function' ? chunkOrEnc : (typeof encodingOrCb === 'function' ? encodingOrCb : cb);
      if (finalCb) process.nextTick(finalCb);
      resMock.finished = true;
      process.nextTick(() => {
        const fullBuf = chunks.length ? Buffer.concat(chunks) : Buffer.alloc(0);
        const ct = String(headersOut['content-type'] || 'text/plain; charset=utf-8');
        const isBinary = /(image|video|audio|octet|pdf|zip|font|woff|binary|x-)/i.test(ct);
        const out: any = {
          statusCode: statusCodeOut,
          headers: headersOut,
          body: isBinary ? fullBuf.toString('base64') : fullBuf.toString('utf8'),
          isBase64Encoded: isBinary,
        };
        finishedResolve(out);
      });
      return resMock;
    },
    flushHeaders() { },
  };

  // Pipe ke Express app
  process.nextTick(() => {
    try { app(reqMock, resMock); } catch (routeErr: any) {
      if (!resMock.finished) {
        resMock.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        resMock.end(JSON.stringify({ error: 'Express route error', reason: routeErr?.message || '' }, null, 2));
      }
    }
  });
  return finishedPromise;
}

// =================================================================
//  FINAL EXPORT HANDLER — Netlify compatible signature
// =================================================================
export async function handler(event: any, context: any) {
  // CORS preflight
  if (String(event.httpMethod || '').toUpperCase() === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'access-control-allow-origin':  '*',
        'access-control-allow-methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'access-control-allow-headers': 'Content-Type, Authorization, Accept',
        'access-control-max-age':       '86400',
      },
      body: '',
    };
  }
  try {
    await waitForReady();
    return await runExpressOnNetlify(expressApp, event);
  } catch (e: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        error: 'Netlify handler v4 failed',
        reason: e?.message || '',
        stack:  (e?.stack || '').slice(0, 800),
      }, null, 2),
    };
  }
}

export default handler;