import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/bookings',
  '/training',
];

// Routes only for non-authenticated users
const AUTH_ROUTES = [
  '/login',
  '/signup',
];

export async function middleware(request: NextRequest) {
  // Update the session first
  const response = await updateSession(request);
  
  // The updateSession helper already handles redirects for protected routes
  // This is just the config to ensure the middleware runs on the right paths
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     * - api/webhooks (webhook routes shouldn't have session handling)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

