import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase environment variables');
}

// using service role key, DO NOT EXPOSE TO BROWSER (no "admin" client should be exposed)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export type QRCode = {
  id: string;
  created_at: string;
  nome: string;
  destino_url: string;
  tipo: string;
};

export type Acesso = {
  id: number;
  qr_id: string;
  created_at: string;
  device_type: string | null;
  os: string | null;
  browser: string | null;
  user_agent: string | null;
  referrer: string | null;
};
