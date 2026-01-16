'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export interface AuthState {
  error: string | null;
  success: boolean;
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Google sign in error:', error.message);
    return { error: 'No se pudo iniciar sesión con Google. Intenta de nuevo.' };
  }

  if (data.url) {
    return { url: data.url };
  }

  return { error: 'No se pudo obtener la URL de autenticación.' };
}

/**
 * Sign in with email and password
 */
export async function signIn(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos', success: false };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error.message);
    return { 
      error: getAuthErrorMessage(error.message), 
      success: false 
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

/**
 * Sign up with email and password
 */
export async function signUp(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos', success: false };
  }

  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres', success: false };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || '',
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    console.error('Sign up error:', error.message);
    return { 
      error: getAuthErrorMessage(error.message), 
      success: false 
    };
  }

  // For development, auto-confirm is usually enabled
  // In production with email confirmation, show success message
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

/**
 * Translate Supabase auth errors to Spanish
 */
function getAuthErrorMessage(message: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Email o contraseña incorrectos',
    'Email not confirmed': 'Por favor confirma tu email antes de iniciar sesión',
    'User already registered': 'Este email ya está registrado',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    'Unable to validate email address: invalid format': 'Formato de email inválido',
    'Signup requires a valid password': 'Se requiere una contraseña válida',
    'Email rate limit exceeded': 'Demasiados intentos. Intenta de nuevo más tarde',
  };

  return errorMap[message] || 'Ocurrió un error. Intenta de nuevo.';
}

