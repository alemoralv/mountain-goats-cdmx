/**
 * Mountain Goats: CDMX - Database Types
 * 
 * Manual TypeScript definitions mirroring the Supabase schema.
 * These can be replaced with auto-generated types once codegen is set up.
 * 
 * @see supabase/schema.sql for the source of truth
 */

// ============================================================================
// ENUM TYPES
// ============================================================================

export type HikingLevel = 'Beginner' | 'Intermediate' | 'Goat';

export type PackageType = 'hike' | 'training' | 'bundle';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export type RouteType = 'Loop' | 'Out-and-Back' | 'Point-to-Point';

export type ContentType = 'video' | 'pdf' | 'article' | 'audio';

export type WaiverType = 'standard' | 'medical' | 'minor';

// ============================================================================
// JSON TYPES
// ============================================================================

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

// ============================================================================
// TABLE TYPES
// ============================================================================

/**
 * User profile linked to Supabase auth.users
 */
export interface Profile {
  id: string; // UUID - references auth.users(id)
  full_name: string | null;
  avatar_url: string | null;
  hiking_level: HikingLevel;
  emergency_contact: EmergencyContact | null;
  phone: string | null;
  date_of_birth: string | null; // ISO date string
  bio: string | null;
  total_hikes_completed: number;
  total_elevation_gained: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Core hiking event with full statistics and pricing
 */
export interface Hike {
  id: string; // UUID
  created_at: string;
  updated_at: string;
  
  // Basic Information
  title: string;
  slug: string;
  description: string;
  short_description: string | null;
  date: string; // ISO timestamp
  end_date: string | null;
  location: string;
  meeting_point: string | null;
  meeting_point_coordinates: GeoCoordinates | null;
  
  // Pricing (in centavos MXN)
  price_hike_only: number;
  price_training_only: number;
  price_bundle: number;
  
  // Hike Statistics
  distance_km: number;
  elevation_gain_m: number;
  elevation_loss_m: number | null;
  max_altitude_msnm: number; // Meters above sea level
  min_altitude_msnm: number | null;
  difficulty_level: number; // 1-10
  route_type: RouteType;
  duration_hours: number;
  
  // Capacity
  max_participants: number;
  current_participants: number;
  
  // Content & Media
  featured_image_url: string | null;
  main_image_url: string | null;
  map_image_url: string | null;
  elevation_chart_url: string | null;
  gallery_urls: string[];
  training_preview: string | null;
  gpx_file_url: string | null;
  
  // Metadata
  is_published: boolean;
  is_featured: boolean;
  tags: string[];
}

/**
 * User booking for a hike
 */
export interface Booking {
  id: string; // UUID
  created_at: string;
  updated_at: string;
  
  // Relationships
  user_id: string; // FK -> profiles.id
  hike_id: string; // FK -> hikes.id
  
  // Booking Details
  package_type: PackageType;
  quantity: number;
  
  // Pricing at time of booking
  unit_price: number; // centavos
  total_amount: number; // centavos
  currency: string;
  
  // Payment
  payment_status: PaymentStatus;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  
  // Confirmation
  confirmation_code: string | null;
  confirmation_sent_at: string | null;
  
  // Attendance
  checked_in: boolean;
  checked_in_at: string | null;
  
  // Cancellation
  cancelled_at: string | null;
  cancellation_reason: string | null;
  refund_amount: number | null;
  
  // Notes
  special_requests: string | null;
  admin_notes: string | null;
}

/**
 * Digital training content for a hike
 */
export interface TrainingContent {
  id: string; // UUID
  created_at: string;
  updated_at: string;
  
  // Relationship
  hike_id: string; // FK -> hikes.id
  
  // Content Details
  title: string;
  description: string | null;
  content_type: ContentType;
  content_url: string;
  thumbnail_url: string | null;
  
  // Ordering
  section: string | null;
  sort_order: number;
  duration_minutes: number | null;
  
  // Access Control
  is_published: boolean;
  is_preview: boolean;
  
  // Engagement
  view_count: number;
}

/**
 * User progress through training content
 */
export interface TrainingProgress {
  id: string; // UUID
  created_at: string;
  updated_at: string;
  
  user_id: string; // FK -> profiles.id
  content_id: string; // FK -> training_content.id
  
  started_at: string;
  completed_at: string | null;
  progress_percent: number; // 0-100
  last_position_seconds: number;
}

/**
 * Legal waiver signed by user
 */
export interface Waiver {
  id: string; // UUID
  created_at: string;
  
  // Relationship
  user_id: string; // FK -> profiles.id
  
  // Waiver Details
  waiver_version: string;
  waiver_type: WaiverType;
  
  // Signature
  signed_at: string;
  signature_data: string | null;
  ip_address: string;
  user_agent: string | null;
  
  // Legal
  full_legal_name: string;
  is_valid: boolean;
  expires_at: string | null;
  
  // Optional hike association
  hike_id: string | null;
}

/**
 * User review for a completed hike
 */
export interface Review {
  id: string; // UUID
  created_at: string;
  updated_at: string;
  
  // Relationships
  user_id: string; // FK -> profiles.id
  hike_id: string; // FK -> hikes.id
  booking_id: string | null; // FK -> bookings.id
  
  // Review Content
  rating: number; // 1-5
  title: string | null;
  content: string | null;
  
  // Specific Ratings
  rating_difficulty_accuracy: number | null;
  rating_guide_quality: number | null;
  rating_value: number | null;
  
  // Media
  photo_urls: string[];
  
  // Moderation
  is_verified: boolean;
  is_published: boolean;
  is_featured: boolean;
  
  // Admin Response
  admin_response: string | null;
  admin_response_at: string | null;
}

// ============================================================================
// COMPOSITE TYPES (for queries with joins)
// ============================================================================

/**
 * Booking with related hike data
 */
export interface BookingWithHike extends Booking {
  hike: Hike;
}

/**
 * Booking with related user profile
 */
export interface BookingWithProfile extends Booking {
  profile: Profile;
}

/**
 * Full booking with all relations
 */
export interface BookingFull extends Booking {
  hike: Hike;
  profile: Profile;
}

/**
 * Review with author profile
 */
export interface ReviewWithProfile extends Review {
  profile: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'hiking_level'>;
}

/**
 * Training content with progress (for authenticated users)
 */
export interface TrainingContentWithProgress extends TrainingContent {
  progress: TrainingProgress | null;
}

/**
 * Hike with computed stats
 */
export interface HikeWithStats extends Hike {
  average_rating: number | null;
  review_count: number;
  spots_remaining: number;
}

// ============================================================================
// INSERT/UPDATE TYPES
// ============================================================================

/**
 * Data required to create a new profile
 */
export type ProfileInsert = Pick<Profile, 'id'> & Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Data allowed when updating a profile
 */
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Data required to create a new hike
 */
export type HikeInsert = Omit<Hike, 'id' | 'created_at' | 'updated_at' | 'current_participants'>;

/**
 * Data allowed when updating a hike
 */
export type HikeUpdate = Partial<Omit<Hike, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Data required to create a new booking
 */
export type BookingInsert = Omit<Booking, 
  'id' | 'created_at' | 'updated_at' | 'confirmation_code' | 'confirmation_sent_at' | 
  'checked_in' | 'checked_in_at' | 'cancelled_at' | 'cancellation_reason' | 'refund_amount'
>;

/**
 * Data allowed when updating a booking
 */
export type BookingUpdate = Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'hike_id'>>;

/**
 * Data required to create training content
 */
export type TrainingContentInsert = Omit<TrainingContent, 'id' | 'created_at' | 'updated_at' | 'view_count'>;

/**
 * Data allowed when updating training content
 */
export type TrainingContentUpdate = Partial<Omit<TrainingContent, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Data required to create a waiver
 */
export type WaiverInsert = Omit<Waiver, 'id' | 'created_at'>;

/**
 * Data required to create a review
 */
export type ReviewInsert = Omit<Review, 'id' | 'created_at' | 'updated_at' | 'is_verified' | 'is_featured' | 'admin_response' | 'admin_response_at'>;

/**
 * Data allowed when updating a review
 */
export type ReviewUpdate = Partial<Pick<Review, 'title' | 'content' | 'rating' | 'rating_difficulty_accuracy' | 'rating_guide_quality' | 'rating_value' | 'photo_urls'>>;

// ============================================================================
// SUPABASE DATABASE TYPE (for use with createClient<Database>)
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      hikes: {
        Row: Hike;
        Insert: HikeInsert;
        Update: HikeUpdate;
      };
      bookings: {
        Row: Booking;
        Insert: BookingInsert;
        Update: BookingUpdate;
      };
      training_content: {
        Row: TrainingContent;
        Insert: TrainingContentInsert;
        Update: TrainingContentUpdate;
      };
      training_progress: {
        Row: TrainingProgress;
        Insert: Omit<TrainingProgress, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TrainingProgress, 'id' | 'created_at' | 'updated_at'>>;
      };
      waivers: {
        Row: Waiver;
        Insert: WaiverInsert;
        Update: never; // Waivers should not be updated
      };
      reviews: {
        Row: Review;
        Insert: ReviewInsert;
        Update: ReviewUpdate;
      };
    };
    Enums: {
      hiking_level: HikingLevel;
      package_type: PackageType;
      payment_status: PaymentStatus;
      route_type: RouteType;
    };
  };
}

