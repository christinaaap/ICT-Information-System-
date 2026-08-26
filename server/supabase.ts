// ⚠️ Load dotenv DI FILE INI SENDIRI! Paling aman supaya TERBAKA SEBELUM cek process.env
// (Mengatasi masalah urutan import di ES Modules)
import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/supabase';

// Force load .env dari root project (process.cwd())
loadEnv({ path: resolve(process.cwd(), '.env'), override: true });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug: kasih tau mana yang hilang biar gak bingung
const missing: string[] = [];
if (!supabaseUrl) missing.push('SUPABASE_URL');
if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');

if (missing.length > 0) {
  console.error('\n❌ ==============================================');
  console.error('   KESALAHAN KONFIGURASI ENVIRONMENT SUPABASE');
  console.error('   Variabel yang HILANG:', missing.join(', '));
  console.error('   Lokasi .env dicari:', resolve(process.cwd(), '.env'));
  console.error('   Solusi: Buka file .env lalu pastikan variabel di atas diisi.');
  console.error('   ==============================================\n');
  throw new Error(`Missing Supabase env vars: ${missing.join(', ')}`);
}

export const supabase = createClient<Database>(supabaseUrl!, supabaseServiceKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

console.log('✅ [Supabase] Config loaded OK. Project:', new URL(supabaseUrl!).hostname.split('.')[0]);