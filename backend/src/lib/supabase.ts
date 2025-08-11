// src/lib/supabase.ts
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

// ⚠️ Service Role key – server only!
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
  
)

// Optional: a public client you can use on the server for re-auth checks
// (uses anon key; still safe to keep server-side)
export const supabasePublic = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export const supabaseRecoverPassword = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // never expose this to the browser
  { auth: { persistSession: false } }
);
