import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Create a Supabase admin client with service role
 * This client bypasses Row Level Security (RLS)
 * 
 * ⚠️ ONLY use in secure server-side contexts:
 * - Webhook handlers
 * - Server actions that need admin access
 * - Background jobs
 * 
 * NEVER expose this client to the browser
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

