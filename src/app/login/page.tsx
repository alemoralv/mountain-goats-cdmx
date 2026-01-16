'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Mountain, Mail, Lock, User, Loader2, ArrowRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signIn, signUp, signInWithGoogle, type AuthState } from './actions';

// ============================================================================
// SUBMIT BUTTON COMPONENT
// ============================================================================
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all',
        'bg-gradient-to-r from-forest-900 to-forest-800 text-white',
        'hover:from-forest-800 hover:to-forest-700 hover:shadow-lg',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          {children}
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  );
}

// ============================================================================
// GOOGLE SIGN IN BUTTON
// ============================================================================
function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signInWithGoogle();
      
      if ('error' in result) {
        setError(result.error);
        setIsLoading(false);
      } else if ('url' in result) {
        // Redirect to Google OAuth
        window.location.href = result.url;
      }
    } catch (err) {
      setError('Ocurrió un error inesperado. Intenta de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className={cn(
          'w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl',
          'border border-gray-200 bg-white hover:bg-gray-50 transition-all',
          'text-navy-950 font-medium',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {isLoading ? 'Conectando...' : 'Continuar con Google'}
      </button>
    </div>
  );
}

// ============================================================================
// MAIN LOGIN PAGE
// ============================================================================
export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  const initialState: AuthState = { error: null, success: false };
  const [signInState, signInAction] = useFormState(signIn, initialState);
  const [signUpState, signUpAction] = useFormState(signUp, initialState);

  const currentError = activeTab === 'signin' ? signInState.error : signUpState.error;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-hero overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
              <Mountain className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold uppercase tracking-wider text-white">
                Mountain Goats
              </span>
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">
                CDMX
              </span>
            </div>
          </Link>

          {/* Hero Text */}
          <div className="max-w-md">
            <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight text-white mb-6 leading-tight">
              Únete a la
              <span className="block text-forest-400">Comunidad</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Accede a expediciones exclusivas, entrenamiento personalizado y una 
              comunidad de excursionistas apasionados.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-12">
            <div>
              <span className="font-display text-3xl font-bold text-white block">1,200+</span>
              <span className="text-white/60 text-sm">Goats Activos</span>
            </div>
            <div>
              <span className="font-display text-3xl font-bold text-white block">50+</span>
              <span className="text-white/60 text-sm">Expediciones</span>
            </div>
            <div>
              <span className="font-display text-3xl font-bold text-white block">4,680m</span>
              <span className="text-white/60 text-sm">Altitud Máxima</span>
            </div>
          </div>
        </div>

        {/* Decorative Mountain Silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-navy-950/50 to-transparent" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 bg-background">
        <div className="mx-auto w-full max-w-md">
          {/* Back Link (mobile) */}
          <Link 
            href="/" 
            className="lg:hidden inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy-950 mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-navy-950">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-lg font-bold uppercase tracking-wider text-navy-950">
              Mountain Goats
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-navy-950">
              {activeTab === 'signin' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
            </h2>
            <p className="mt-2 text-gray-600">
              {activeTab === 'signin' 
                ? 'Ingresa tus credenciales para acceder' 
                : 'Únete a la comunidad de excursionistas'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              onClick={() => setActiveTab('signin')}
              className={cn(
                'flex-1 py-3 text-sm font-semibold rounded-lg transition-all',
                activeTab === 'signin'
                  ? 'bg-white text-navy-950 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={cn(
                'flex-1 py-3 text-sm font-semibold rounded-lg transition-all',
                activeTab === 'signup'
                  ? 'bg-white text-navy-950 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Registrarse
            </button>
          </div>

          {/* Error Message */}
          {currentError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{currentError}</p>
            </div>
          )}

          {/* Sign In Form */}
          {activeTab === 'signin' && (
            <form action={signInAction} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signin-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="tu@email.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signin-password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
                  />
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-forest-700 hover:text-forest-900 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit */}
              <SubmitButton>Iniciar Sesión</SubmitButton>
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <form action={signUpAction} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Juan Pérez"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="tu@email.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
                  />
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500">
                Al registrarte, aceptas nuestros{' '}
                <Link href="/terms" className="text-forest-700 hover:underline">
                  Términos de Servicio
                </Link>{' '}
                y{' '}
                <Link href="/privacy" className="text-forest-700 hover:underline">
                  Política de Privacidad
                </Link>.
              </p>

              {/* Submit */}
              <SubmitButton>Crear Cuenta</SubmitButton>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-gray-500">o continúa con</span>
            </div>
          </div>

          {/* Google Sign In */}
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}

