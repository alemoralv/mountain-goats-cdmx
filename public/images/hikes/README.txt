================================================================================
MOUNTAIN GOATS CDMX - HIKE IMAGES
================================================================================

This folder contains images for individual hikes displayed throughout the site.
Each hike needs 4 key images for the full visual experience.

================================================================================
IMAGE TYPES PER HIKE (4 images each):
================================================================================

For each hike, create these images with the slug prefix:

1. {slug}-card.jpg
   ─────────────────
   Usage: Featured image on listing cards
   Recommended size: 800x600px (4:3 aspect ratio)
   Content: Beautiful landscape shot of the hike destination
   Example: coconetla-card.jpg, nevado-card.jpg

2. {slug}-map.jpg
   ─────────────────
   Usage: Trail map in the stats grid (right column)
   Recommended size: 600x600px (1:1 square)
   Content: Topographic-style trail map showing the route
   Style suggestions:
     - Use contour lines (like the reference image)
     - Mark start/end points with dots
     - Show the trail path clearly
     - Use earth tones (browns, tans) or match brand colors
   Example: coconetla-map.jpg

3. {slug}-elevation.jpg (Altimetría)
   ─────────────────
   Usage: Elevation profile chart
   Recommended size: 600x300px (2:1 aspect ratio)
   Content: Line graph showing elevation change over distance
   Style suggestions:
     - X-axis: Distance (km)
     - Y-axis: Elevation (msnm)
     - Use brand colors (forest green or navy)
     - Clean, minimal design
   Example: coconetla-elevation.jpg

4. {slug}-difficulty.jpg (Nivel)
   ─────────────────
   Usage: Difficulty indicator icon
   Recommended size: 200x200px (1:1 square)
   Content: Visual representation of difficulty level
   Style suggestions:
     - Thermometer style indicator
     - Mountain icon with difficulty bars
     - Use color coding (green=easy, yellow=moderate, orange=hard, red=advanced)
   Example: coconetla-difficulty.jpg
   NOTE: Optional - the code generates a default difficulty indicator

================================================================================
CURRENT HIKES THAT NEED IMAGES:
================================================================================

1. MIRADOR DE COCONETLA (slug: mirador-de-coconetla)
   Location: Los Dinamos, CDMX
   Difficulty: Básico (3/10)
   Files needed:
   - coconetla-card.jpg
   - coconetla-map.jpg
   - coconetla-elevation.jpg

2. NEVADO DE TOLUCA (slug: nevado-de-toluca)
   Location: Estado de México
   Difficulty: Difícil (7/10)
   Files needed:
   - nevado-card.jpg
   - nevado-map.jpg
   - nevado-elevation.jpg

3. LA MALINCHE (slug: la-malinche)
   Location: Tlaxcala
   Difficulty: Moderado-Difícil (6/10)
   Files needed:
   - malinche-card.jpg
   - malinche-map.jpg
   - malinche-elevation.jpg

4. PICO DEL ÁGUILA - AJUSCO (slug: ajusco-pico-del-aguila)
   Location: Ajusco, CDMX
   Difficulty: Moderado (4/10)
   Files needed:
   - ajusco-card.jpg
   - ajusco-map.jpg
   - ajusco-elevation.jpg

5. IZTACCÍHUATL - LAS RODILLAS (slug: iztaccihuatl-rodillas)
   Location: Parque Nacional Izta-Popo
   Difficulty: Avanzado (8/10)
   Files needed:
   - izta-card.jpg
   - izta-map.jpg
   - izta-elevation.jpg

================================================================================
IMAGE SPECIFICATIONS:
================================================================================

Format: JPG (preferred) or PNG
Quality: 80-85% compression for web
Color profile: sRGB

File size limits:
- Card images: Max 300KB
- Map images: Max 200KB
- Elevation charts: Max 150KB
- Difficulty icons: Max 50KB

================================================================================
HOW TO CREATE MAP IMAGES:
================================================================================

Option 1: Use Caltopo or AllTrails
  - Export the route map
  - Apply a topographic/terrain style
  - Crop to square and adjust colors

Option 2: Use Figma/Illustrator
  - Draw contour lines manually
  - Add route path in a contrasting color
  - Mark waypoints (start, summit, etc.)

Option 3: Commission from a designer
  - Provide GPS coordinates and route
  - Request topographic/vintage map style

================================================================================
HOW TO CREATE ELEVATION CHARTS:
================================================================================

Option 1: Export from GPS/Strava
  - Record the hike with a GPS device
  - Export the elevation profile image

Option 2: Use online tools
  - GPS Visualizer (gpsvisualizer.com)
  - Caltopo elevation profile tool

Option 3: Create in Excel/Sheets
  - Input distance and elevation data points
  - Create area chart
  - Style with brand colors

================================================================================
DATABASE FIELDS (Supabase):
================================================================================

Update these fields in the 'hikes' table:

- featured_image_url: Path to card image
- map_image_url: Path to map image
- elevation_chart_url: Path to elevation chart
- difficulty_image_url: Path to difficulty icon (optional)

Example SQL:
UPDATE hikes SET 
  featured_image_url = '/images/hikes/coconetla-card.jpg',
  map_image_url = '/images/hikes/coconetla-map.jpg',
  elevation_chart_url = '/images/hikes/coconetla-elevation.jpg'
WHERE slug = 'mirador-de-coconetla';

================================================================================
TIPS FOR CONSISTENCY:
================================================================================

1. Use the same color palette across all maps:
   - Primary: #022c22 (forest)
   - Secondary: #172554 (navy)
   - Accent: #14532d (forest-900)
   - Background: #f8fafc (off-white)

2. Use consistent line weights and fonts

3. Add a subtle brand watermark if desired

4. Keep the style minimal and modern

================================================================================
