import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Hike, HikeWithStats } from '@/types/database';

/**
 * Get a single hike by ID or slug
 * Returns 404 if not found or not published
 */
export async function getHike(idOrSlug: string): Promise<Hike> {
  const supabase = await createClient();

  // Try to find by ID first, then by slug
  const { data: hike, error } = await supabase
    .from('hikes')
    .select('*')
    .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
    .eq('is_published', true)
    .single();

  if (error || !hike) {
    console.error('Error fetching hike:', error?.message);
    notFound();
  }

  return hike as Hike;
}

/**
 * Get a single hike by ID (admin - includes unpublished)
 */
export async function getHikeAdmin(id: string): Promise<Hike | null> {
  const supabase = await createClient();

  const { data: hike, error } = await supabase
    .from('hikes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching hike (admin):', error.message);
    return null;
  }

  return hike as Hike;
}

/**
 * Get all upcoming hikes (date > now)
 * Ordered by date ascending
 */
export async function getUpcomingHikes(limit?: number): Promise<Hike[]> {
  const supabase = await createClient();

  let query = supabase
    .from('hikes')
    .select('*')
    .eq('is_published', true)
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data: hikes, error } = await query;

  if (error) {
    console.error('Error fetching upcoming hikes:', error.message);
    return [];
  }

  return (hikes || []) as Hike[];
}

/**
 * Get featured hikes
 */
export async function getFeaturedHikes(limit: number = 3): Promise<Hike[]> {
  const supabase = await createClient();

  const { data: hikes, error } = await supabase
    .from('hikes')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured hikes:', error.message);
    return [];
  }

  // If not enough featured hikes, fill with upcoming hikes
  if ((hikes?.length || 0) < limit) {
    const upcomingHikes = await getUpcomingHikes(limit);
    const featuredIds = new Set(hikes?.map(h => h.id) || []);
    const additionalHikes = upcomingHikes.filter(h => !featuredIds.has(h.id));
    return [...(hikes || []), ...additionalHikes].slice(0, limit) as Hike[];
  }

  return (hikes || []) as Hike[];
}

/**
 * Get all published hikes with optional filters
 */
export async function getHikes(options?: {
  difficulty?: { min?: number; max?: number };
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ hikes: Hike[]; total: number }> {
  const supabase = await createClient();

  let query = supabase
    .from('hikes')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .order('date', { ascending: true });

  // Apply filters
  if (options?.difficulty?.min !== undefined) {
    query = query.gte('difficulty_level', options.difficulty.min);
  }
  if (options?.difficulty?.max !== undefined) {
    query = query.lte('difficulty_level', options.difficulty.max);
  }
  if (options?.search) {
    query = query.or(`title.ilike.%${options.search}%,location.ilike.%${options.search}%`);
  }

  // Pagination
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data: hikes, error, count } = await query;

  if (error) {
    console.error('Error fetching hikes:', error.message);
    return { hikes: [], total: 0 };
  }

  return { 
    hikes: (hikes || []) as Hike[], 
    total: count || 0 
  };
}

/**
 * Get hike with computed stats
 */
export async function getHikeWithStats(idOrSlug: string): Promise<HikeWithStats> {
  const supabase = await createClient();

  // Fetch hike
  const { data: hike, error: hikeError } = await supabase
    .from('hikes')
    .select('*')
    .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
    .eq('is_published', true)
    .single();

  if (hikeError || !hike) {
    notFound();
  }

  // Fetch reviews for this hike
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('hike_id', hike.id)
    .eq('is_published', true);

  // Calculate average rating
  let averageRating: number | null = null;
  const reviewCount = reviews?.length || 0;
  
  if (reviews && reviews.length > 0) {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    averageRating = Math.round((sum / reviews.length) * 10) / 10;
  }

  // Calculate spots remaining
  const spotsRemaining = Math.max(0, hike.max_participants - hike.current_participants);

  return {
    ...hike,
    average_rating: averageRating,
    review_count: reviewCount,
    spots_remaining: spotsRemaining,
  } as HikeWithStats;
}

/**
 * Get platform stats for homepage
 */
export async function getPlatformStats(): Promise<{
  totalHikes: number;
  totalParticipants: number;
  uniqueRoutes: number;
  maxAltitude: number;
}> {
  const supabase = await createClient();

  // Get total hikes count
  const { count: totalHikes } = await supabase
    .from('hikes')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);

  // Get sum of participants and max altitude
  const { data: stats } = await supabase
    .from('hikes')
    .select('current_participants, max_altitude_msnm')
    .eq('is_published', true);

  const totalParticipants = stats?.reduce((sum, h) => sum + (h.current_participants || 0), 0) || 0;
  const maxAltitude = stats?.reduce((max, h) => Math.max(max, h.max_altitude_msnm || 0), 0) || 0;

  return {
    totalHikes: totalHikes || 0,
    totalParticipants,
    uniqueRoutes: totalHikes || 0, // Could be refined based on location
    maxAltitude,
  };
}

