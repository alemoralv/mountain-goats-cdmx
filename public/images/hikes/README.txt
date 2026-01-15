================================================================================
MOUNTAIN GOATS CDMX - HIKE IMAGES
================================================================================

This folder contains images for individual hikes displayed throughout the site.

--------------------------------------------------------------------------------
IMAGE TYPES PER HIKE:
--------------------------------------------------------------------------------

For each hike, you may want to include:

1. {slug}-hero.jpg
   - Usage: Hero banner on hike detail page
   - Recommended size: 1920x1080px (16:9)
   - Example: nevado-de-toluca-hero.jpg

2. {slug}-card.jpg
   - Usage: Hike card on listing pages
   - Recommended size: 800x600px (4:3)
   - Example: nevado-de-toluca-card.jpg

3. {slug}-map.jpg
   - Usage: Trail map in stats grid
   - Recommended size: 600x600px (1:1 square)
   - Example: nevado-de-toluca-map.jpg

4. {slug}-elevation.jpg
   - Usage: Elevation profile chart
   - Recommended size: 600x600px (1:1 square)
   - Example: nevado-de-toluca-elevation.jpg

5. {slug}-gallery-{n}.jpg
   - Usage: Photo gallery on detail page
   - Recommended size: 1200x800px
   - Example: nevado-de-toluca-gallery-1.jpg

--------------------------------------------------------------------------------
CURRENT HIKES (from seed data):
--------------------------------------------------------------------------------

1. mirador-de-coconetla
   - mirador-de-coconetla-hero.jpg
   - mirador-de-coconetla-card.jpg
   - mirador-de-coconetla-map.jpg
   - mirador-de-coconetla-elevation.jpg

2. nevado-de-toluca-crater-summit
   - nevado-de-toluca-hero.jpg
   - nevado-de-toluca-card.jpg
   - nevado-de-toluca-map.jpg
   - nevado-de-toluca-elevation.jpg

3. pico-del-aguila-ajusco
   - pico-del-aguila-hero.jpg
   - pico-del-aguila-card.jpg
   - pico-del-aguila-map.jpg
   - pico-del-aguila-elevation.jpg

4. desierto-de-los-leones
   - desierto-de-los-leones-hero.jpg
   - desierto-de-los-leones-card.jpg

5. la-malinche-cumbre
   - la-malinche-hero.jpg
   - la-malinche-card.jpg
   - la-malinche-map.jpg
   - la-malinche-elevation.jpg

--------------------------------------------------------------------------------
IMAGE SPECIFICATIONS:
--------------------------------------------------------------------------------

- Format: JPG (preferred) or WebP
- Quality: 80-85% compression for web
- Max file size: 300KB for cards, 500KB for heroes
- Color profile: sRGB

--------------------------------------------------------------------------------
DATABASE FIELDS:
--------------------------------------------------------------------------------

Update these fields in the Supabase 'hikes' table:
- featured_image_url: URL or path to card image
- main_image_url: URL or path to hero image  
- map_image_url: URL or path to map image
- elevation_chart_url: URL or path to elevation chart

Example (SQL):
UPDATE hikes SET 
  featured_image_url = '/images/hikes/nevado-de-toluca-card.jpg',
  main_image_url = '/images/hikes/nevado-de-toluca-hero.jpg',
  map_image_url = '/images/hikes/nevado-de-toluca-map.jpg',
  elevation_chart_url = '/images/hikes/nevado-de-toluca-elevation.jpg'
WHERE slug = 'nevado-de-toluca-crater-summit';

