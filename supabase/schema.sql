-- ============================================================================
-- Mountain Goats: CDMX - Database Schema
-- Version: 1.0.0
-- Description: Complete PostgreSQL schema for the hiking platform
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CUSTOM TYPES (ENUMS)
-- ============================================================================

-- Hiking experience level for user profiles
CREATE TYPE hiking_level AS ENUM ('Beginner', 'Intermediate', 'Goat');

-- Package type for bookings
CREATE TYPE package_type AS ENUM ('hike', 'training', 'bundle');

-- Payment status for bookings
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'cancelled');

-- Route type for hikes
CREATE TYPE route_type AS ENUM ('Loop', 'Out-and-Back', 'Point-to-Point');

-- ============================================================================
-- TABLE: profiles
-- Description: User profile data linked to Supabase auth.users
-- ============================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    hiking_level hiking_level DEFAULT 'Beginner',
    emergency_contact JSONB DEFAULT '{}'::jsonb,
    -- emergency_contact structure:
    -- {
    --   "name": "string",
    --   "phone": "string",
    --   "relationship": "string"
    -- }
    phone TEXT,
    date_of_birth DATE,
    bio TEXT,
    total_hikes_completed INTEGER DEFAULT 0,
    total_elevation_gained INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for faster queries on hiking level
CREATE INDEX idx_profiles_hiking_level ON profiles(hiking_level);

-- ============================================================================
-- TABLE: hikes
-- Description: Core hiking event data with full statistics and pricing
-- ============================================================================
CREATE TABLE hikes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Basic Information
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ, -- For multi-day hikes
    location TEXT NOT NULL,
    meeting_point TEXT,
    meeting_point_coordinates JSONB, -- { "lat": number, "lng": number }
    
    -- Pricing (in Mexican Pesos - MXN, stored as cents/centavos)
    price_hike_only INTEGER NOT NULL DEFAULT 0,
    price_training_only INTEGER NOT NULL DEFAULT 0,
    price_bundle INTEGER NOT NULL DEFAULT 0,
    
    -- Hike Statistics (Crucial for the platform)
    distance_km DECIMAL(5,2) NOT NULL, -- e.g., 12.50 km
    elevation_gain_m INTEGER NOT NULL, -- Total positive elevation gain
    elevation_loss_m INTEGER, -- Total negative elevation (for point-to-point)
    max_altitude_msnm INTEGER NOT NULL, -- Meters above sea level (CDMX context)
    min_altitude_msnm INTEGER,
    difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 10),
    route_type route_type NOT NULL DEFAULT 'Loop',
    duration_hours DECIMAL(4,2) NOT NULL, -- e.g., 6.5 hours
    
    -- Capacity
    max_participants INTEGER DEFAULT 20,
    current_participants INTEGER DEFAULT 0,
    
    -- Content & Media
    featured_image_url TEXT,
    gallery_urls TEXT[] DEFAULT '{}',
    training_preview TEXT, -- Teaser content for the training package
    gpx_file_url TEXT, -- GPS track file
    
    -- Metadata
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    
    -- Constraints
    CONSTRAINT valid_bundle_pricing CHECK (
        price_bundle <= (price_hike_only + price_training_only)
    )
);

-- Indexes for common queries
CREATE INDEX idx_hikes_date ON hikes(date);
CREATE INDEX idx_hikes_difficulty ON hikes(difficulty_level);
CREATE INDEX idx_hikes_is_published ON hikes(is_published);
CREATE INDEX idx_hikes_is_featured ON hikes(is_featured);
CREATE INDEX idx_hikes_slug ON hikes(slug);

-- Full-text search index
CREATE INDEX idx_hikes_search ON hikes USING GIN(to_tsvector('spanish', title || ' ' || description || ' ' || location));

-- ============================================================================
-- TABLE: bookings
-- Description: User bookings for hikes with payment tracking
-- ============================================================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Relationships
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    hike_id UUID NOT NULL REFERENCES hikes(id) ON DELETE CASCADE,
    
    -- Booking Details
    package_type package_type NOT NULL,
    quantity INTEGER DEFAULT 1,
    
    -- Pricing at time of booking (immutable record)
    unit_price INTEGER NOT NULL, -- Price per unit in centavos
    total_amount INTEGER NOT NULL, -- Total charged in centavos
    currency TEXT DEFAULT 'MXN',
    
    -- Payment
    payment_status payment_status DEFAULT 'pending',
    stripe_session_id TEXT,
    stripe_payment_intent_id TEXT,
    paid_at TIMESTAMPTZ,
    
    -- Confirmation
    confirmation_code TEXT UNIQUE,
    confirmation_sent_at TIMESTAMPTZ,
    
    -- Attendance
    checked_in BOOLEAN DEFAULT false,
    checked_in_at TIMESTAMPTZ,
    
    -- Cancellation
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    refund_amount INTEGER,
    
    -- Notes
    special_requests TEXT,
    admin_notes TEXT,
    
    -- Prevent duplicate bookings for same hike
    CONSTRAINT unique_user_hike_booking UNIQUE (user_id, hike_id)
);

-- Indexes for common queries
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_hike_id ON bookings(hike_id);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_stripe_session ON bookings(stripe_session_id);
CREATE INDEX idx_bookings_confirmation ON bookings(confirmation_code);

-- ============================================================================
-- TABLE: training_content
-- Description: Digital training content linked to specific hikes
-- ============================================================================
CREATE TABLE training_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Relationship
    hike_id UUID NOT NULL REFERENCES hikes(id) ON DELETE CASCADE,
    
    -- Content Details
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL DEFAULT 'video', -- video, pdf, article, audio
    content_url TEXT NOT NULL, -- URL to the hosted content
    thumbnail_url TEXT,
    
    -- Ordering & Organization
    section TEXT, -- e.g., 'preparation', 'technique', 'gear'
    sort_order INTEGER DEFAULT 0,
    duration_minutes INTEGER, -- For video/audio content
    
    -- Access Control
    is_published BOOLEAN DEFAULT false,
    is_preview BOOLEAN DEFAULT false, -- Can be viewed without purchase
    
    -- Engagement Tracking
    view_count INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX idx_training_content_hike_id ON training_content(hike_id);
CREATE INDEX idx_training_content_is_published ON training_content(is_published);
CREATE INDEX idx_training_content_section ON training_content(section);

-- ============================================================================
-- TABLE: training_progress
-- Description: Track user progress through training content
-- ============================================================================
CREATE TABLE training_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES training_content(id) ON DELETE CASCADE,
    
    -- Progress tracking
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    last_position_seconds INTEGER DEFAULT 0, -- For resuming video/audio
    
    CONSTRAINT unique_user_content_progress UNIQUE (user_id, content_id)
);

-- Indexes
CREATE INDEX idx_training_progress_user ON training_progress(user_id);
CREATE INDEX idx_training_progress_content ON training_progress(content_id);

-- ============================================================================
-- TABLE: waivers
-- Description: Legal waivers signed by users before hiking
-- ============================================================================
CREATE TABLE waivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Relationship
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Waiver Details
    waiver_version TEXT NOT NULL DEFAULT '1.0', -- Track waiver document versions
    waiver_type TEXT DEFAULT 'standard', -- standard, medical, minor
    
    -- Signature Information
    signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    signature_data TEXT, -- Base64 encoded signature image or typed name
    ip_address INET NOT NULL,
    user_agent TEXT,
    
    -- Legal
    full_legal_name TEXT NOT NULL,
    is_valid BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ, -- Some waivers may expire annually
    
    -- Related hike (optional - for hike-specific waivers)
    hike_id UUID REFERENCES hikes(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_waivers_user_id ON waivers(user_id);
CREATE INDEX idx_waivers_signed_at ON waivers(signed_at);
CREATE INDEX idx_waivers_is_valid ON waivers(is_valid);

-- ============================================================================
-- TABLE: reviews
-- Description: User reviews for completed hikes
-- ============================================================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Relationships
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    hike_id UUID NOT NULL REFERENCES hikes(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    
    -- Review Content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    
    -- Specific Ratings (optional)
    rating_difficulty_accuracy INTEGER CHECK (rating_difficulty_accuracy >= 1 AND rating_difficulty_accuracy <= 5),
    rating_guide_quality INTEGER CHECK (rating_guide_quality >= 1 AND rating_guide_quality <= 5),
    rating_value INTEGER CHECK (rating_value >= 1 AND rating_value <= 5),
    
    -- Media
    photo_urls TEXT[] DEFAULT '{}',
    
    -- Moderation
    is_verified BOOLEAN DEFAULT false, -- Verified = completed the hike
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Admin
    admin_response TEXT,
    admin_response_at TIMESTAMPTZ,
    
    CONSTRAINT unique_user_hike_review UNIQUE (user_id, hike_id)
);

-- Indexes
CREATE INDEX idx_reviews_hike_id ON reviews(hike_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_is_published ON reviews(is_published);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to auto-update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate confirmation code
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.confirmation_code IS NULL THEN
        NEW.confirmation_code = 'MG-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update hike participant count
CREATE OR REPLACE FUNCTION update_hike_participants()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.payment_status = 'completed' THEN
        UPDATE hikes 
        SET current_participants = current_participants + NEW.quantity
        WHERE id = NEW.hike_id;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle status change to completed
        IF OLD.payment_status != 'completed' AND NEW.payment_status = 'completed' THEN
            UPDATE hikes 
            SET current_participants = current_participants + NEW.quantity
            WHERE id = NEW.hike_id;
        -- Handle cancellation/refund
        ELSIF OLD.payment_status = 'completed' AND NEW.payment_status IN ('cancelled', 'refunded') THEN
            UPDATE hikes 
            SET current_participants = current_participants - NEW.quantity
            WHERE id = NEW.hike_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.payment_status = 'completed' THEN
        UPDATE hikes 
        SET current_participants = current_participants - OLD.quantity
        WHERE id = OLD.hike_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update timestamps
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hikes_updated_at
    BEFORE UPDATE ON hikes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_content_updated_at
    BEFORE UPDATE ON training_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_progress_updated_at
    BEFORE UPDATE ON training_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate confirmation code for bookings
CREATE TRIGGER generate_booking_confirmation
    BEFORE INSERT ON bookings
    FOR EACH ROW EXECUTE FUNCTION generate_confirmation_code();

-- Update participant count on booking changes
CREATE TRIGGER update_participants_on_booking
    AFTER INSERT OR UPDATE OR DELETE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_hike_participants();

-- Auto-create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE waivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: profiles
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Public profiles are viewable (for reviews, etc.)
CREATE POLICY "Public profiles are viewable"
    ON profiles FOR SELECT
    USING (true);

-- ============================================================================
-- RLS POLICIES: hikes
-- ============================================================================

-- Anyone can view published hikes
CREATE POLICY "Published hikes are viewable by everyone"
    ON hikes FOR SELECT
    USING (is_published = true);

-- Admin can manage all hikes (requires custom role/claim)
-- CREATE POLICY "Admins can manage hikes"
--     ON hikes FOR ALL
--     USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- RLS POLICIES: bookings
-- ============================================================================

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own bookings
CREATE POLICY "Users can create own bookings"
    ON bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending bookings
CREATE POLICY "Users can update own pending bookings"
    ON bookings FOR UPDATE
    USING (auth.uid() = user_id AND payment_status = 'pending')
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES: training_content
-- ============================================================================

-- Anyone can view published training previews
CREATE POLICY "Published previews are public"
    ON training_content FOR SELECT
    USING (is_published = true AND is_preview = true);

-- Users with valid bookings can view training content
CREATE POLICY "Purchasers can view training content"
    ON training_content FOR SELECT
    USING (
        is_published = true AND
        EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.user_id = auth.uid()
            AND bookings.hike_id = training_content.hike_id
            AND bookings.package_type IN ('training', 'bundle')
            AND bookings.payment_status = 'completed'
        )
    );

-- ============================================================================
-- RLS POLICIES: training_progress
-- ============================================================================

-- Users can manage their own progress
CREATE POLICY "Users can manage own progress"
    ON training_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES: waivers
-- ============================================================================

-- Users can view their own waivers
CREATE POLICY "Users can view own waivers"
    ON waivers FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own waivers
CREATE POLICY "Users can create own waivers"
    ON waivers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES: reviews
-- ============================================================================

-- Anyone can view published reviews
CREATE POLICY "Published reviews are public"
    ON reviews FOR SELECT
    USING (is_published = true);

-- Users can create reviews for hikes they've completed
CREATE POLICY "Users can create reviews for completed hikes"
    ON reviews FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.user_id = auth.uid()
            AND bookings.hike_id = reviews.hike_id
            AND bookings.payment_status = 'completed'
            AND bookings.checked_in = true
        )
    );

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- SEED DATA: Sample Hike (for development)
-- ============================================================================

-- Uncomment to insert sample data
/*
INSERT INTO hikes (
    title,
    slug,
    description,
    short_description,
    date,
    location,
    meeting_point,
    price_hike_only,
    price_training_only,
    price_bundle,
    distance_km,
    elevation_gain_m,
    max_altitude_msnm,
    min_altitude_msnm,
    difficulty_level,
    route_type,
    duration_hours,
    max_participants,
    training_preview,
    is_published,
    is_featured,
    tags
) VALUES (
    'Nevado de Toluca: Cráter Summit',
    'nevado-de-toluca-crater-summit',
    'Conquer the fourth-highest peak in Mexico! This challenging expedition takes you to the crater rim of Nevado de Toluca (Xinantécatl) at 4,680 meters. You''ll experience the stunning crater lakes - the Sun and Moon lakes - while pushing your limits at extreme altitude. Our expert guides will lead you through volcanic terrain, teaching high-altitude techniques and safety protocols.',
    'Summit the majestic Nevado de Toluca and witness the legendary Sun and Moon crater lakes at 4,680m.',
    '2025-02-15 06:00:00+00',
    'Nevado de Toluca National Park, Estado de México',
    'Parking lot at km 22, Nevado de Toluca road',
    189900, -- $1,899 MXN
    99900,  -- $999 MXN
    249900, -- $2,499 MXN
    12.5,
    1200,
    4680,
    3800,
    8,
    'Out-and-Back',
    8.5,
    12,
    'In this training module, you''ll learn essential high-altitude hiking techniques including proper pacing, breathing exercises, and acclimatization strategies. We''ll cover the specific challenges of volcanic terrain and how to navigate the crater safely.',
    true,
    true,
    ARRAY['high-altitude', 'volcanic', 'advanced', 'crater-lakes', 'summit']
);
*/

