import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Auth callback handler for PKCE flow
 * This route handles the redirect from Supabase after email confirmation
 * or OAuth sign-in.
 * 
 * For new users, redirects to onboarding to collect fitness assessment.
 * For returning users with completed assessment, redirects to dashboard.
 * 
 * GET /auth/callback?code=xxx
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');
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

    // If there's a specific next page requested, go there
    if (next) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Check if user has completed fitness assessment
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: assessment } = await supabase
        .from('fitness_assessments')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // If no assessment exists, redirect to onboarding
      if (!assessment) {
        return NextResponse.redirect(`${origin}/onboarding`);
      }
    }
  }

  // Redirect to the dashboard for returning users
  return NextResponse.redirect(`${origin}/dashboard`);
}

