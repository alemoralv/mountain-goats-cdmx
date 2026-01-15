/**
 * Mountain Goats: CDMX - Application Constants
 */

// ============================================================================
// APP CONFIGURATION
// ============================================================================

export const APP_NAME = 'Mountain Goats: CDMX';
export const APP_DESCRIPTION = 'Premium hiking experiences in and around Mexico City. Conquer peaks, build community, and discover the mountains that surround CDMX.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ============================================================================
// NAVIGATION
// ============================================================================

export const NAV_ITEMS = [
  { label: 'Inicio', href: '/' },
  { label: 'Caminatas', href: '/hikes' },
  { label: 'Sobre Nosotros', href: '/about' },
] as const;

export const AUTH_NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Mis Reservas', href: '/bookings' },
  { label: 'Perfil', href: '/profile' },
] as const;

// ============================================================================
// HIKE CONFIGURATION
// ============================================================================

export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 10;

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Muy Fácil',
  2: 'Fácil',
  3: 'Fácil+',
  4: 'Moderado',
  5: 'Moderado+',
  6: 'Difícil',
  7: 'Muy Difícil',
  8: 'Avanzado',
  9: 'Experto',
  10: 'Extremo',
};

// ============================================================================
// PRICING
// ============================================================================

export const CURRENCY = 'MXN';
export const CURRENCY_SYMBOL = '$';
export const CURRENCY_LOCALE = 'es-MX';

// ============================================================================
// PAGINATION
// ============================================================================

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

// ============================================================================
// VALIDATION
// ============================================================================

export const VALIDATION = {
  phone: {
    pattern: /^(\+52)?[0-9]{10}$/,
    message: 'Ingresa un número de teléfono válido (10 dígitos)',
  },
  name: {
    minLength: 2,
    maxLength: 100,
  },
  bio: {
    maxLength: 500,
  },
  review: {
    titleMaxLength: 100,
    contentMaxLength: 2000,
  },
} as const;

// ============================================================================
// EXTERNAL LINKS
// ============================================================================

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/mountaingoatscdmx',
  facebook: 'https://facebook.com/mountaingoatscdmx',
  whatsapp: 'https://wa.me/521234567890',
} as const;

// ============================================================================
// SEO
// ============================================================================

export const DEFAULT_SEO = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: APP_NAME,
  },
  twitter: {
    card: 'summary_large_image',
  },
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  reviews: true,
  training: true,
  waivers: true,
  socialLogin: false,
} as const;

