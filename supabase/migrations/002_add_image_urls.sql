-- ============================================================================
-- Migration: Add image URL columns to hikes table
-- Description: Adds dedicated columns for map, elevation chart, and main images
-- ============================================================================

ALTER TABLE hikes 
ADD COLUMN IF NOT EXISTS main_image_url TEXT,
ADD COLUMN IF NOT EXISTS map_image_url TEXT,
ADD COLUMN IF NOT EXISTS elevation_chart_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN hikes.main_image_url IS 'Primary hero image for the hike';
COMMENT ON COLUMN hikes.map_image_url IS 'Trail map image showing the route';
COMMENT ON COLUMN hikes.elevation_chart_url IS 'Elevation profile/altimetry chart image';

