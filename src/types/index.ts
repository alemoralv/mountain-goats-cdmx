/**
 * Mountain Goats: CDMX - Shared Application Types
 * 
 * Re-exports database types and defines additional app-specific types.
 */

// Re-export all database types
export * from './database';

// ============================================================================
// UI / COMPONENT TYPES
// ============================================================================

/**
 * Difficulty level display configuration
 */
export interface DifficultyConfig {
  level: number;
  label: string;
  color: string;
  description: string;
}

/**
 * Navigation item for menus
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  requiresAuth?: boolean;
  children?: NavItem[];
}

/**
 * Hike statistics for display components
 */
export interface HikeStats {
  distanceKm: number;
  elevationGainM: number;
  maxAltitudeMsnm: number;
  durationHours: number;
  difficultyLevel: number;
  routeType: string;
}

/**
 * Price display with formatted values
 */
export interface PriceDisplay {
  hikeOnly: {
    amount: number;
    formatted: string;
  };
  trainingOnly: {
    amount: number;
    formatted: string;
  };
  bundle: {
    amount: number;
    formatted: string;
    savings: number;
    savingsFormatted: string;
  };
}

// ============================================================================
// API / RESPONSE TYPES
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: 'success' | 'error';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Hike filters for list queries
 */
export interface HikeFilters {
  difficulty?: {
    min?: number;
    max?: number;
  };
  date?: {
    from?: string;
    to?: string;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  distance?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
  search?: string;
  sortBy?: 'date' | 'difficulty' | 'price' | 'distance' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// AUTH TYPES
// ============================================================================

/**
 * Authenticated user with profile
 */
export interface AuthUser {
  id: string;
  email: string;
  profile: {
    fullName: string | null;
    avatarUrl: string | null;
    hikingLevel: string;
  } | null;
}

/**
 * Session state
 */
export interface SessionState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ============================================================================
// BOOKING / CHECKOUT TYPES
// ============================================================================

/**
 * Checkout session data
 */
export interface CheckoutData {
  hikeId: string;
  packageType: 'hike' | 'training' | 'bundle';
  quantity: number;
  specialRequests?: string;
}

/**
 * Stripe checkout session response
 */
export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Difficulty level configurations
 */
export const DIFFICULTY_LEVELS: Record<number, DifficultyConfig> = {
  1: { level: 1, label: 'Muy Fácil', color: 'text-green-500', description: 'Apto para principiantes absolutos' },
  2: { level: 2, label: 'Fácil', color: 'text-green-500', description: 'Senderos bien marcados, poca elevación' },
  3: { level: 3, label: 'Fácil-Moderado', color: 'text-lime-500', description: 'Algo de elevación, buena condición básica' },
  4: { level: 4, label: 'Moderado', color: 'text-yellow-500', description: 'Terreno variado, condición física requerida' },
  5: { level: 5, label: 'Moderado-Difícil', color: 'text-yellow-600', description: 'Rutas más largas, mayor desnivel' },
  6: { level: 6, label: 'Difícil', color: 'text-orange-500', description: 'Experiencia previa recomendada' },
  7: { level: 7, label: 'Muy Difícil', color: 'text-orange-600', description: 'Alta elevación, terreno técnico' },
  8: { level: 8, label: 'Avanzado', color: 'text-red-500', description: 'Solo para excursionistas experimentados' },
  9: { level: 9, label: 'Experto', color: 'text-red-600', description: 'Condiciones extremas, máxima preparación' },
  10: { level: 10, label: 'Extremo', color: 'text-red-700', description: 'Expedición de alta montaña' },
} as const;

/**
 * Route type labels in Spanish
 */
export const ROUTE_TYPE_LABELS: Record<string, string> = {
  'Loop': 'Circuito',
  'Out-and-Back': 'Ida y Vuelta',
  'Point-to-Point': 'Punto a Punto',
} as const;

/**
 * Hiking level labels and descriptions
 */
export const HIKING_LEVEL_CONFIG = {
  Beginner: {
    label: 'Principiante',
    description: 'Nuevo en el senderismo o con poca experiencia',
    icon: 'Footprints',
  },
  Intermediate: {
    label: 'Intermedio',
    description: 'Experiencia regular en senderismo de montaña',
    icon: 'Mountain',
  },
  Goat: {
    label: 'Cabra',
    description: 'Experto en alta montaña y terreno técnico',
    icon: 'Crown',
  },
} as const;

/**
 * Package type labels
 */
export const PACKAGE_TYPE_LABELS = {
  hike: 'Solo Caminata',
  training: 'Solo Entrenamiento',
  bundle: 'Paquete Completo',
} as const;

