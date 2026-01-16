-- ============================================================================
-- Migration: Enhanced Goat Profiles
-- Description: Add nickname, gender fields to profiles and create user_training_files table
-- ============================================================================

-- ============================================================================
-- EXTEND PROFILES TABLE
-- ============================================================================

-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS nickname TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
ADD COLUMN IF NOT EXISTS total_distance_km DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_duration_hours DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS show_real_name BOOLEAN DEFAULT false;

-- Add comment for clarity
COMMENT ON COLUMN profiles.nickname IS 'Public display name - only this is visible to other users';
COMMENT ON COLUMN profiles.full_name IS 'Private - only visible to the user and admins';
COMMENT ON COLUMN profiles.gender IS 'Private - only visible to the user and admins';
COMMENT ON COLUMN profiles.date_of_birth IS 'Private - only visible to the user and admins';
COMMENT ON COLUMN profiles.total_distance_km IS 'Total distance hiked in kilometers';
COMMENT ON COLUMN profiles.total_duration_hours IS 'Total time spent hiking in hours';
COMMENT ON COLUMN profiles.show_real_name IS 'Whether to show real name instead of nickname publicly';

-- ============================================================================
-- TABLE: user_training_files
-- Description: Personal training files uploaded by admins for specific users
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_training_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Relationship
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- File Details
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL, -- URL to the file in Supabase Storage
    file_type TEXT NOT NULL DEFAULT 'pdf', -- pdf, video, image, document
    file_size_bytes INTEGER,
    
    -- Metadata
    category TEXT DEFAULT 'general', -- general, workout, nutrition, technique, medical
    uploaded_by UUID REFERENCES profiles(id), -- Admin who uploaded
    
    -- Ordering
    sort_order INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_training_files_user_id ON user_training_files(user_id);
CREATE INDEX IF NOT EXISTS idx_user_training_files_category ON user_training_files(category);

-- Auto-update timestamp trigger
CREATE TRIGGER update_user_training_files_updated_at
    BEFORE UPDATE ON user_training_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on new table
ALTER TABLE user_training_files ENABLE ROW LEVEL SECURITY;

-- Users can only view their own training files
CREATE POLICY "Users can view own training files"
    ON user_training_files FOR SELECT
    USING (auth.uid() = user_id);

-- Only admins can insert/update/delete (handled by service role)
-- For now, we'll allow the service role to manage files

-- ============================================================================
-- FUNCTION: Update user stats after booking completion
-- ============================================================================
CREATE OR REPLACE FUNCTION update_user_hiking_stats()
RETURNS TRIGGER AS $$
DECLARE
    hike_record RECORD;
BEGIN
    -- Only trigger on check_in status change
    IF TG_OP = 'UPDATE' AND 
       OLD.checked_in = false AND 
       NEW.checked_in = true AND
       NEW.payment_status = 'completed' THEN
        
        -- Get hike details
        SELECT distance_km, duration_hours, elevation_gain_m 
        INTO hike_record
        FROM hikes 
        WHERE id = NEW.hike_id;
        
        -- Update user profile stats
        UPDATE profiles 
        SET 
            total_hikes_completed = total_hikes_completed + 1,
            total_distance_km = COALESCE(total_distance_km, 0) + COALESCE(hike_record.distance_km, 0),
            total_duration_hours = COALESCE(total_duration_hours, 0) + COALESCE(hike_record.duration_hours, 0),
            total_elevation_gained = COALESCE(total_elevation_gained, 0) + COALESCE(hike_record.elevation_gain_m, 0),
            updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating stats
DROP TRIGGER IF EXISTS update_stats_on_checkin ON bookings;
CREATE TRIGGER update_stats_on_checkin
    AFTER UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_user_hiking_stats();

-- ============================================================================
-- STORAGE BUCKET: user-training-files
-- ============================================================================
-- Note: Run this in the Supabase dashboard or via CLI:
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('user-training-files', 'user-training-files', false);


