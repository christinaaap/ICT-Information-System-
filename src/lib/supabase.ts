import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/supabase';

export const createClient = () =>
  createBrowserClient<Database>(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );