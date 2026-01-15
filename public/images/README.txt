================================================================================
MOUNTAIN GOATS CDMX - IMAGE ASSETS GUIDE
================================================================================

This folder contains all image assets for the Mountain Goats CDMX website.

--------------------------------------------------------------------------------
FOLDER STRUCTURE:
--------------------------------------------------------------------------------

public/images/
├── README.txt              (this file)
├── hero-pattern.svg        (background pattern for hero sections)
├── og-image.jpg            (Open Graph image for social sharing)
│
├── team/                   (Team member photos)
│   ├── README.txt          (Instructions for team images)
│   ├── alex.jpg
│   ├── mariana.jpg
│   ├── carlos.jpg
│   └── diana.jpg
│
├── hikes/                  (Hike-specific images)
│   ├── README.txt          (Instructions for hike images)
│   ├── {slug}-hero.jpg
│   ├── {slug}-card.jpg
│   ├── {slug}-map.jpg
│   └── {slug}-elevation.jpg
│
├── branding/               (Logos and brand assets)
│   ├── logo-full.svg
│   ├── logo-icon.svg
│   ├── logo-white.svg
│   └── favicon.ico
│
└── misc/                   (Miscellaneous images)
    └── (any other images)

--------------------------------------------------------------------------------
GLOBAL IMAGES NEEDED:
--------------------------------------------------------------------------------

1. og-image.jpg
   - Usage: Social media sharing preview (WhatsApp, Facebook, Twitter)
   - Location: /public/images/og-image.jpg
   - Size: 1200x630px (required for OG)
   - Content: Brand image with "Mountain Goats CDMX" text
   - Current status: MISSING - using default

2. favicon.ico
   - Usage: Browser tab icon
   - Location: /public/favicon.ico
   - Size: 32x32px and 16x16px (multi-size ICO)
   - Current status: MISSING - using default

3. apple-touch-icon.png
   - Usage: iOS home screen icon
   - Location: /public/apple-touch-icon.png
   - Size: 180x180px
   - Current status: MISSING

--------------------------------------------------------------------------------
IMAGE OPTIMIZATION TIPS:
--------------------------------------------------------------------------------

1. Use TinyPNG (tinypng.com) or Squoosh (squoosh.app) to compress
2. Convert large images to WebP for better performance
3. Keep hero images under 500KB
4. Keep card images under 200KB
5. Use JPG for photos, PNG for graphics with transparency, SVG for icons

--------------------------------------------------------------------------------
UPLOADING TO SUPABASE STORAGE (Alternative):
--------------------------------------------------------------------------------

Instead of storing images in /public, you can use Supabase Storage:

1. Go to Supabase Dashboard > Storage
2. Create a bucket called "images" (set to public)
3. Upload images to appropriate folders
4. Use URLs like: https://[project].supabase.co/storage/v1/object/public/images/...

This is better for:
- Dynamic image uploads
- CDN delivery
- Image transformations

