import Stripe from 'stripe';

/**
 * Server-side Stripe instance
 * Only use in server components, API routes, and server actions
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

/**
 * Helper to format price for Stripe (already in centavos, which = cents)
 * Stripe expects amounts in the smallest currency unit
 */
export function formatPriceForStripe(centavos: number): number {
  // Our DB stores prices in centavos (MXN cents), which is what Stripe expects
  return centavos;
}

/**
 * Package type to product name mapping
 */
export function getProductName(packageType: string, hikeTitle: string): string {
  switch (packageType) {
    case 'hike':
      return `Hike: ${hikeTitle}`;
    case 'training':
      return `Training Plan: ${hikeTitle}`;
    case 'bundle':
      return `The Bundle: ${hikeTitle}`;
    default:
      return `Mountain Goats: ${hikeTitle}`;
  }
}

/**
 * Package type descriptions
 */
export function getProductDescription(packageType: string): string {
  switch (packageType) {
    case 'hike':
      return 'Guided hiking experience including transport, professional guide, snacks, and insurance';
    case 'training':
      return 'Digital training content: technique videos, 4-week training plan, and gear guide';
    case 'bundle':
      return 'Complete package: Guided hike + Full digital training program';
    default:
      return 'Mountain Goats CDMX Experience';
  }
}

