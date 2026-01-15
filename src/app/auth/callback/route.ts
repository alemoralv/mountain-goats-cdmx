import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Auth callback handler for PKCE flow
 * This route handles the redirect from Supabase after email confirmation
 * or OAuth sign-in.
 * 
 * GET /auth/callback?code=xxx
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error.message);
      // Redirect to login with error
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent('No se pudo verificar tu cuenta. Intenta de nuevo.')}`
      );
    }
  }

  // Redirect to the dashboard or requested page
  return NextResponse.redirect(`${origin}${next}`);
}

