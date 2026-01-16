import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Layout for onboarding page - ensures user is authenticated
 * If not authenticated, redirects to login
 * If already completed assessment, redirects to dashboard
 */
export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Not authenticated - redirect to login
    redirect('/login');
  }

  // Check if user has already completed fitness assessment
  const { data: assessment } = await supabase
    .from('fitness_assessments')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (assessment) {
    // Already completed - redirect to dashboard
    redirect('/dashboard');
  }

  return <>{children}</>;
}

