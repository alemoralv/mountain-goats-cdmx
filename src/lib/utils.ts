import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format price from centavos to MXN display string
 */
export function formatPrice(centavos: number): string {
  const pesos = centavos / 100;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pesos);
}

/**
 * Format distance with unit
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Format elevation with unit
 */
export function formatElevation(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}k m`;
  }
  return `${meters.toLocaleString('es-MX')} m`;
}

/**
 * Format altitude (MSNM = meters above sea level)
 */
export function formatAltitude(msnm: number): string {
  return `${msnm.toLocaleString('es-MX')} msnm`;
}

/**
 * Format duration in hours to human readable
 */
export function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  const fullHours = Math.floor(hours);
  const minutes = Math.round((hours - fullHours) * 60);
  
  if (minutes === 0) {
    return `${fullHours}h`;
  }
  return `${fullHours}h ${minutes}m`;
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('es-MX', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get relative time string
 */
export function getRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  if (diffDays === -1) return 'Ayer';
  if (diffDays > 0 && diffDays <= 7) return `En ${diffDays} días`;
  if (diffDays < 0 && diffDays >= -7) return `Hace ${Math.abs(diffDays)} días`;
  
  return formatDate(d, { month: 'short', day: 'numeric' });
}

/**
 * Calculate bundle savings
 */
export function calculateBundleSavings(
  hikePrice: number,
  trainingPrice: number,
  bundlePrice: number
): { amount: number; percentage: number } {
  const individualTotal = hikePrice + trainingPrice;
  const savings = individualTotal - bundlePrice;
  const percentage = Math.round((savings / individualTotal) * 100);
  
  return { amount: savings, percentage };
}

/**
 * Generate URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get initials from full name
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
}

/**
 * Check if a hike is sold out
 */
export function isSoldOut(currentParticipants: number, maxParticipants: number): boolean {
  return currentParticipants >= maxParticipants;
}

/**
 * Get spots remaining
 */
export function getSpotsRemaining(currentParticipants: number, maxParticipants: number): number {
  return Math.max(0, maxParticipants - currentParticipants);
}

/**
 * Get difficulty color class based on level
 */
export function getDifficultyColor(level: number): string {
  if (level <= 2) return 'text-difficulty-easy';
  if (level <= 4) return 'text-yellow-500';
  if (level <= 6) return 'text-difficulty-moderate';
  if (level <= 8) return 'text-difficulty-hard';
  return 'text-difficulty-extreme';
}

/**
 * Get difficulty background color class
 */
export function getDifficultyBgColor(level: number): string {
  if (level <= 2) return 'bg-green-500/10 text-green-700';
  if (level <= 4) return 'bg-yellow-500/10 text-yellow-700';
  if (level <= 6) return 'bg-orange-500/10 text-orange-700';
  if (level <= 8) return 'bg-red-500/10 text-red-700';
  return 'bg-red-900/10 text-red-900';
}

