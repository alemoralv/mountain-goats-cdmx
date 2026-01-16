-- ============================================================================
-- Migration: Add fitness_assessments table
-- Description: Stores user fitness assessment data collected during onboarding
-- ============================================================================

-- Strength training types as an array (multiple can be selected)
-- Values: 'legs_core', 'upper_body', 'full_body', 'none'

-- Hike difficulty levels
CREATE TYPE hike_difficulty_level AS ENUM ('1', '2', '3', '4');

-- Session duration options
CREATE TYPE session_duration AS ENUM ('short', 'medium', 'long');

-- ============================================================================
-- TABLE: fitness_assessments
-- Description: User fitness data collected during signup for training plan creation
-- ============================================================================
CREATE TABLE fitness_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- User relationship
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    
    -- Personal Information
    first_name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 16 AND age <= 100),
    
    -- Current Fitness Level
    max_running_distance_km DECIMAL(5,2) NOT NULL, -- Max non-stop running distance in km
    comfortable_pace TEXT NOT NULL, -- Minutes per km (e.g., "6:30", "7:00")
    hikes_last_3_months INTEGER NOT NULL DEFAULT 0, -- Number of hikes in last 3 months
    typical_elevation_gain_m INTEGER DEFAULT 0, -- Typical elevation per hike in meters
    strength_training_frequency INTEGER NOT NULL DEFAULT 0 CHECK (strength_training_frequency >= 0 AND strength_training_frequency <= 7),
    strength_training_types TEXT[] DEFAULT '{}', -- Array: 'legs_core', 'upper_body', 'full_body', 'none'
    
    -- Availability & Preferences
    available_days_per_week INTEGER NOT NULL CHECK (available_days_per_week >= 1 AND available_days_per_week <= 7),
    preferred_training_days TEXT[] DEFAULT '{}', -- Array of days: 'monday', 'tuesday', etc.
    session_duration session_duration NOT NULL DEFAULT 'medium',
    
    -- Target Hike Information
    target_hike_name TEXT NOT NULL,
    target_hike_level hike_difficulty_level NOT NULL,
    target_hike_distance_km DECIMAL(5,2) NOT NULL,
    target_hike_elevation_m INTEGER NOT NULL,
    target_hike_date DATE NOT NULL,
    
    -- Calculated Fields (stored for reference)
    weeks_until_hike INTEGER GENERATED ALWAYS AS (
        GREATEST(0, (target_hike_date - CURRENT_DATE) / 7)
    ) STORED,
    
    -- Training plan email sent
    training_plan_sent_at TIMESTAMPTZ,
    training_plan_email TEXT -- Email address where plan was sent
);

-- Index for user lookup
CREATE INDEX idx_fitness_assessments_user_id ON fitness_assessments(user_id);

-- Auto-update timestamp trigger
CREATE TRIGGER update_fitness_assessments_updated_at
    BEFORE UPDATE ON fitness_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS POLICIES: fitness_assessments
-- ============================================================================

ALTER TABLE fitness_assessments ENABLE ROW LEVEL SECURITY;

-- Users can view their own assessment
CREATE POLICY "Users can view own fitness assessment"
    ON fitness_assessments FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own assessment
CREATE POLICY "Users can create own fitness assessment"
    ON fitness_assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own assessment
CREATE POLICY "Users can update own fitness assessment"
    ON fitness_assessments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

