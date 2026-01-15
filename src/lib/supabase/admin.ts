import { createClient } from '@supabase/supabase-js';

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
 * 
 * Note: Uses untyped client for flexibility. For full type safety,
 * generate types using: npx supabase gen types typescript
 */
export function createAdminClient() {
  return createClient(
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

