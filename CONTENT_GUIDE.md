# 🏔️ Mountain Goats CDMX - Content & Configuration Guide

A complete guide to editing, updating, and managing all content on the Mountain Goats CDMX website.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure Overview](#project-structure-overview)
3. [Pages & Where to Edit Content](#pages--where-to-edit-content)
4. [Images Guide](#images-guide)
5. [Legal Documents & PDFs](#legal-documents--pdfs)
6. [Database & Supabase](#database--supabase)
7. [Styling Cheat Sheet](#styling-cheat-sheet)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Running the Development Server

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Quick Reference - Where to Edit What

| What to Edit | File Location |
|--------------|---------------|
| Hikes data | `src/app/hikes/page.tsx` → `SAMPLE_HIKES` array |
| Packages info | `src/app/packages/page.tsx` → `PACKAGES` array |
| Training content | `src/app/training/page.tsx` → `TRAINING_PILLARS`, `TRAINING_LEVELS`, etc. |
| Team members | `src/app/about/page.tsx` → `TEAM_MEMBERS` array |
| Navigation links | `src/components/layout/Navbar.tsx` → `NAV_LINKS` |
| Footer links | `src/components/layout/Footer.tsx` → `FOOTER_LINKS` |
| Legal PDFs & FAQ | `public/docs/` folder |
| Global colors | `tailwind.config.ts` |
| Site fonts | `src/app/layout.tsx` |

---

## Project Structure Overview

```
GOATS_CDMX/
├── public/
│   ├── images/
│   │   ├── hikes/           # Hike images (cards, maps, elevation charts)
│   │   ├── team/            # Team member photos
│   │   ├── branding/        # Logos and brand assets
│   │   └── hero-pattern.svg # Background pattern
│   └── docs/                # Legal PDFs and FAQ documents
│       ├── MG_tds.pdf       # Términos de Servicio
│       ├── MG_pdp.pdf       # Política de Privacidad
│       ├── MG_pde.pdf       # Política de Exención
│       ├── MG_pdr.pdf       # Política de Reembolso
│       └── MG_faq.pdf       # Preguntas Frecuentes (FAQ)
├── src/
│   ├── app/
│   │   ├── page.tsx         # Homepage
│   │   ├── about/page.tsx   # The Goats (team) page
│   │   ├── hikes/
│   │   │   ├── page.tsx     # Hikes listing page
│   │   │   └── [id]/page.tsx # Individual hike detail page
│   │   ├── packages/page.tsx # Packages page
│   │   ├── training/page.tsx # Pre-Training program page
│   │   ├── calendar/page.tsx # Calendar page
│   │   ├── login/page.tsx    # Login/Register page
│   │   ├── profile/page.tsx  # User profile page
│   │   └── layout.tsx        # Global layout & fonts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx   # Navigation bar
│   │   │   └── Footer.tsx   # Footer
│   │   └── hikes/           # Hike-specific components
│   ├── lib/
│   │   ├── supabase/        # Database connections
│   │   ├── utils.ts         # Utility functions
│   │   └── data.ts          # Data fetching functions
│   └── types/
│       └── database.ts      # TypeScript type definitions
├── supabase/
│   ├── schema.sql           # Database schema
│   └── seed_data.sql        # Sample data for database
└── tailwind.config.ts       # Tailwind CSS configuration (colors, fonts)
```

---

## Pages & Where to Edit Content

### 1. Homepage (`src/app/page.tsx`)

The main landing page with hero section, featured hikes, and call-to-action sections.

**What you can edit:**
- Hero section text (title, subtitle)
- Featured hikes section
- Statistics/counters
- CTA buttons

**Location in file:**
```tsx
// Hero Section - Around line 50-100
<h1>MOUNTAIN GOATS</h1>  // Main title
<p>Hiking experiences...</p>  // Subtitle

// Stats - Look for the stats array
const STATS = [
  { label: 'Cumbres', value: '50+' },
  ...
];
```

---

### 2. Hikes Page (`src/app/hikes/page.tsx`)

**Location:** `src/app/hikes/page.tsx`

This page displays all available hikes. The data is currently stored in a `SAMPLE_HIKES` array.

**To add/edit a hike, find the `SAMPLE_HIKES` array (around line 57):**

```tsx
const SAMPLE_HIKES: Hike[] = [
  {
    id: '1',                           // Unique identifier
    slug: 'mirador-de-coconetla',      // URL-friendly name
    title: 'Mirador de Coconetla',     // Display name
    location: 'Los Dinamos, CDMX',     // Location text
    date: '2026-02-15T07:00:00',       // Date & time (ISO format)
    description: 'Full description...',
    short_description: 'Brief preview text for cards',
    distance_km: 6.5,                  // Distance in kilometers
    elevation_gain_m: 388,             // Elevation gain in meters
    max_altitude_msnm: 3423,           // Maximum altitude
    duration_hours: 3.5,               // Duration in hours
    difficulty_level: 3,               // 1-10 scale
    price_hike_only: 750,              // Price for hike only (MXN)
    price_training_only: 450,          // Price for training only
    price_bundle: 999,                 // Bundle price
    max_participants: 20,              // Maximum capacity
    current_participants: 12,          // Current bookings
    featured_image_url: '/images/hikes/coconetla-card.jpg',
    map_image_url: '/images/hikes/coconetla-map.jpg',
    elevation_chart_url: '/images/hikes/coconetla-elevation.jpg',
    is_featured: true,                 // Show in featured section
    is_published: true,                // Visible on site
    route_type: 'Loop',                // Loop, Out-and-Back, Point-to-Point
    training_preview: 'Brief training description',
    training_duration_weeks: 2,        // Weeks of pre-training
  },
  // Add more hikes here...
];
```

**Adding a New Hike:**
1. Copy an existing hike object
2. Change the `id` to be unique
3. Update the `slug` (URL-friendly, no spaces, lowercase)
4. Update all other fields
5. Add corresponding images (see Images Guide)

---

### 3. Packages Page (`src/app/packages/page.tsx`)

**Location:** `src/app/packages/page.tsx`

Contains package information, pricing, and comparison table.

**To edit packages, find the `PACKAGES` array (around line 19):**

```tsx
const PACKAGES = [
  {
    id: 'hike-only',
    name: 'Hike Only',
    tagline: 'La experiencia pura',
    description: 'Full description...',
    price: 'Desde $550',
    priceNote: 'Varía según la ruta',
    color: 'forest',           // Options: 'forest', 'navy', 'gradient'
    icon: Mountain,            // Lucide icon component
    popular: false,            // Shows "Más Popular" badge
    features: [
      { text: 'Feature description', included: true },
      { text: 'Not included feature', included: false },
    ],
    cta: 'Ver Hikes Disponibles',
    ctaLink: '/hikes',
  },
];
```

**To edit the Season Pass, find `MEMBERSHIP` object:**

```tsx
const MEMBERSHIP = {
  name: 'Goat Season Pass',
  price: '$4,999',
  priceNote: 'por temporada (6 meses)',
  benefits: [...],
};
```

**To edit the comparison table, find `COMPARISON_FEATURES`:**

```tsx
const COMPARISON_FEATURES = [
  { name: 'Feature Name', hikeOnly: true, training: false, bundle: true },
];
```

---

### 4. The Goats / About Page (`src/app/about/page.tsx`)

**Location:** `src/app/about/page.tsx`

**To edit team members, find `TEAM_MEMBERS` array (around line 22):**

```tsx
const TEAM_MEMBERS = [
  {
    id: 1,
    nickname: 'Alex',
    fullName: 'Alejandro Morera Alvarez',
    image: '/images/team/alex.jpg',
    bio: 'Biography text...',
    instagram: '@alexmorera',
  },
];
```

**Adding a new team member:**
1. Add a new object to the array
2. Give it a unique `id`
3. Add the team photo to `public/images/team/`
4. Reference the image path in `image`

---

### 5. Navigation & Footer

**Navbar Links:** `src/components/layout/Navbar.tsx`

```tsx
// Around line 10
const NAV_LINKS = [
  { label: 'The Goats', href: '/about' },
  { label: 'Hikes', href: '/hikes' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Packages', href: '/packages' },
];
```

**Footer Links:** `src/components/layout/Footer.tsx`

```tsx
// Around line 4
const FOOTER_LINKS = {
  explore: [
    { label: 'Próximas Caminatas', href: '/hikes' },
    // ...
  ],
  company: [...],
  legal: [...],
};
```

---

### 6. Training Page (`src/app/training/page.tsx`)

**Location:** `src/app/training/page.tsx`

The pre-training program page explaining the training methodology, levels, and content.

**Key data arrays to edit:**

```tsx
// Training Pillars - 4 core training areas (around line 30)
const TRAINING_PILLARS = [
  {
    icon: Heart,                          // Lucide icon
    title: 'Cardio & Resistencia',
    description: 'Exercise description...',
    color: 'text-red-500',                // Icon color
    bgColor: 'bg-red-50',                 // Background color
  },
  // ... more pillars
];

// Training Levels - difficulty-based programs (around line 55)
const TRAINING_LEVELS = [
  {
    level: 'Básico',
    duration: '1-2 semanas',
    description: 'Para hikes de dificultad 1-3',
    hikes: ['Desierto de los Leones', 'El Tepozteco'],  // Example hikes
    color: 'bg-emerald-500',                            // Header color
    features: [
      'Cardio básico (caminata, trote suave)',
      // ... more features
    ],
  },
  // ... more levels
];

// Content Types - what's included (around line 95)
const CONTENT_TYPES = [
  {
    icon: Video,
    title: 'Videos HD',
    description: 'Tutoriales paso a paso...',
    count: '20+',
  },
  // ... more content types
];

// Testimonials (around line 115)
const TESTIMONIALS = [
  {
    quote: 'El pre-training marcó la diferencia...',
    author: 'Roberto M.',
    hike: 'Nevado de Toluca',
  },
  // ... more testimonials
];
```

**To update FAQ questions (around line 450):**
```tsx
{[
  {
    question: '¿Necesito experiencia previa para el Pre-Training?',
    answer: 'No, el programa está diseñado para todos los niveles...',
  },
  // Add or edit questions here
].map((faq, index) => (
  // ...
))}
```

---

## Images Guide

### Image Locations

| Image Type | Location | Recommended Size |
|------------|----------|------------------|
| Hike card images | `public/images/hikes/` | 800x600px |
| Hike map images | `public/images/hikes/` | 400x400px (square) |
| Elevation charts | `public/images/hikes/` | 400x200px |
| Team photos | `public/images/team/` | 800x1000px (4:5 ratio) |
| Logos/branding | `public/images/branding/` | Varies |

### Image Naming Convention

For hikes, use this pattern:
- Card/featured image: `{slug}-card.jpg` (e.g., `coconetla-card.jpg`)
- Map image: `{slug}-map.jpg` (e.g., `coconetla-map.jpg`)
- Elevation chart: `{slug}-elevation.jpg` (e.g., `coconetla-elevation.jpg`)

For team:
- Use lowercase names: `alex.jpg`, `mariana.jpg`

### Adding Images

1. **Prepare your image:**
   - Optimize for web (use tools like TinyPNG or Squoosh)
   - Use JPG for photos, PNG for graphics with transparency
   - Keep file sizes under 200KB when possible

2. **Add to the correct folder:**
   ```
   public/images/hikes/your-hike-card.jpg
   public/images/team/new-member.jpg
   ```

3. **Reference in code:**
   ```tsx
   featured_image_url: '/images/hikes/your-hike-card.jpg'
   ```

### Placeholder Images

If an image doesn't exist, the components show placeholder graphics. To add the actual image later, just:
1. Create the image file with the correct name
2. The site will automatically use it (no code changes needed if paths match)

---

## Legal Documents & PDFs

### Location

All legal documents and FAQ PDFs are stored in: `public/docs/`

### File Naming Convention

| Document | File Name |
|----------|-----------|
| Términos de Servicio | `MG_tds.pdf` |
| Política de Privacidad | `MG_pdp.pdf` |
| Política de Exención | `MG_pde.pdf` |
| Política de Reembolso | `MG_pdr.pdf` |
| Preguntas Frecuentes (FAQ) | `MG_faq.pdf` |

### How to Upload/Update PDFs

1. **Create your PDF** with the correct naming convention
2. **Place the file** in `public/docs/` folder
3. **Deploy the site** using the standard deploy command:
   ```bash
   git add . && git commit -m "Update legal docs" && git push && npx vercel deploy --prod --yes --force
   ```

### How Links Work

The footer links in `src/components/layout/Footer.tsx` automatically point to these PDF files:

```tsx
const FOOTER_LINKS = {
  // ...
  legal: [
    { label: 'Términos de Servicio', href: '/docs/MG_tds.pdf' },
    { label: 'Política de Privacidad', href: '/docs/MG_pdp.pdf' },
    { label: 'Política de Exención', href: '/docs/MG_pde.pdf' },
    { label: 'Política de Reembolso', href: '/docs/MG_pdr.pdf' },
  ],
  company: [
    // ...
    { label: 'FAQ', href: '/docs/MG_faq.pdf' },
  ],
};
```

PDFs open in a **new browser tab** automatically.

### Important Notes

- **Do not rename files** - the links in the footer expect these exact file names
- **File names are case-sensitive** - use exactly `MG_tds.pdf`, not `mg_tds.pdf`
- **No code changes needed** - just replace the PDF files and redeploy

---

## Database & Supabase

### Current Setup

The site can work in two modes:
1. **Static mode:** Data stored in code (current setup for hikes)
2. **Database mode:** Data stored in Supabase (used for bookings, user profiles)

### Database Schema

Located at: `supabase/schema.sql`

Key tables:
- `profiles` - User profiles
- `hikes` - Hike information
- `bookings` - User bookings
- `training_content` - Training materials
- `user_training_files` - Personalized training files

### Migration to Database

When ready to move hike data to the database:

1. Run the schema: `supabase/schema.sql`
2. Insert data using: `supabase/seed_data.sql`
3. Update `src/app/hikes/page.tsx` to fetch from database

### User Training Files

Admin can upload personalized training files for users. See: `docs/ADMIN_TRAINING_FILES.md`

Storage location: Supabase Storage bucket `user-training-files`

---

## Styling Cheat Sheet

### Color Palette

Defined in `tailwind.config.ts`:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRIMARY COLORS                           │
├─────────────────────────────────────────────────────────────┤
│ Navy (Primary Brand)                                        │
│ ├── navy-50:  #f0f4f8  (lightest)                          │
│ ├── navy-100: #d9e2ec                                       │
│ ├── navy-200: #bcccdc                                       │
│ ├── navy-300: #9fb3c8                                       │
│ ├── navy-400: #829ab1                                       │
│ ├── navy-500: #627d98                                       │
│ ├── navy-600: #486581                                       │
│ ├── navy-700: #334e68                                       │
│ ├── navy-800: #243b53                                       │
│ ├── navy-900: #102a43                                       │
│ └── navy-950: #0a1929  (darkest - main headers/footers)    │
├─────────────────────────────────────────────────────────────┤
│ Forest (Accent/CTA)                                         │
│ ├── forest-50:  #f0fdf4  (lightest)                        │
│ ├── forest-100: #dcfce7                                     │
│ ├── forest-200: #bbf7d0                                     │
│ ├── forest-300: #86efac                                     │
│ ├── forest-400: #4ade80                                     │
│ ├── forest-500: #22c55e                                     │
│ ├── forest-600: #16a34a                                     │
│ ├── forest-700: #15803d                                     │
│ ├── forest-800: #166534                                     │
│ ├── forest-900: #14532d  (main CTA buttons)                │
│ └── forest-950: #052e16  (darkest)                         │
└─────────────────────────────────────────────────────────────┘
```

### Color Usage Guidelines

| Use Case | Color Class |
|----------|-------------|
| Main headings | `text-navy-950` |
| Body text | `text-gray-600` |
| Links | `text-forest-700 hover:text-forest-900` |
| Primary buttons | `bg-forest-900 hover:bg-forest-800` |
| Secondary buttons | `bg-navy-950 hover:bg-navy-900` |
| Light backgrounds | `bg-background` (cream) or `bg-gray-50` |
| Dark sections | `bg-navy-950` |
| Accent backgrounds | `bg-forest-50` |
| Success states | `text-green-600` or `text-forest-600` |
| Error states | `text-red-600` |
| Warning states | `text-amber-600` |

### Typography Scale

```
┌──────────────────────────────────────────────────────────────┐
│                    FONT FAMILIES                             │
├──────────────────────────────────────────────────────────────┤
│ Display Font: "Bebas Neue"                                   │
│   - Used for: Headings, titles, navigation                   │
│   - Class: font-display                                      │
│   - Always UPPERCASE with tracking-tight                     │
│                                                              │
│ Body Font: "Plus Jakarta Sans"                               │
│   - Used for: Body text, descriptions, UI elements           │
│   - Class: font-sans (default)                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    TEXT SIZES                                │
├──────────────────────────────────────────────────────────────┤
│ Hero Titles (H1)                                             │
│   text-5xl md:text-6xl lg:text-7xl                          │
│   font-display font-bold uppercase tracking-tight            │
│                                                              │
│ Section Headers (H2)                                         │
│   text-3xl md:text-4xl                                       │
│   font-display font-bold uppercase tracking-tight            │
│                                                              │
│ Card Titles (H3)                                             │
│   text-xl md:text-2xl                                        │
│   font-display font-bold uppercase tracking-tight            │
│                                                              │
│ Subtitles/Labels                                             │
│   text-sm font-bold uppercase tracking-wider                 │
│                                                              │
│ Body Text                                                    │
│   text-base or text-lg                                       │
│   leading-relaxed                                            │
│                                                              │
│ Small/Caption Text                                           │
│   text-xs or text-sm                                         │
│   text-gray-500 or text-gray-400                            │
└──────────────────────────────────────────────────────────────┘
```

### Component Patterns

**Cards:**
```tsx
// Standard card
<div className="bg-white rounded-2xl shadow-elevation-low hover:shadow-elevation-high transition-all">

// Dark card
<div className="bg-navy-950 rounded-2xl text-white">

// Accent card
<div className="bg-forest-50 border border-forest-200 rounded-2xl">
```

**Buttons:**
```tsx
// Primary CTA
<button className="bg-gradient-to-r from-forest-900 to-forest-800 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-xl hover:from-forest-800 hover:to-forest-700 transition-all">

// Secondary
<button className="bg-navy-950 text-white font-semibold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-navy-900 transition-all">

// Outline
<button className="border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:border-gray-300 transition-all">

// Ghost (transparent)
<button className="text-gray-600 hover:text-navy-950 transition-colors">
```

**Badges:**
```tsx
// Difficulty badges
<span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">Básico</span>
<span className="bg-yellow-100 text-yellow-800 ...">Moderado</span>
<span className="bg-orange-100 text-orange-800 ...">Difícil</span>
<span className="bg-red-100 text-red-800 ...">Avanzado</span>
```

**Sections:**
```tsx
// Light section
<section className="py-20 bg-background">

// Dark section
<section className="py-20 bg-navy-950">

// Hero section
<section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
```

### Spacing Scale

```
p-1  = 4px     px-4  = 16px (horizontal padding)
p-2  = 8px     py-4  = 16px (vertical padding)
p-3  = 12px    m-4   = 16px (margin)
p-4  = 16px    gap-4 = 16px (flex/grid gap)
p-5  = 20px
p-6  = 24px
p-8  = 32px
p-10 = 40px
p-12 = 48px
p-16 = 64px
p-20 = 80px

max-w-7xl = 80rem (1280px) - main content width
max-w-5xl = 64rem (1024px) - narrower sections
max-w-3xl = 48rem (768px)  - text-focused sections
max-w-xl  = 36rem (576px)  - small containers
```

### Icons

Using **Lucide React** icons. Import like:
```tsx
import { Mountain, ChevronRight, Calendar } from 'lucide-react';

// Use in JSX
<Mountain className="w-6 h-6 text-forest-700" />
```

Browse icons at: https://lucide.dev/icons/

---

## Common Tasks

### Adding a New Page

1. Create folder: `src/app/your-page/`
2. Create file: `src/app/your-page/page.tsx`
3. Use template:

```tsx
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function YourPage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white">
            Page Title
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          {/* Your content */}
        </div>
      </section>

      <Footer />
    </>
  );
}
```

4. Add to navigation in `Navbar.tsx` if needed

### Updating Prices

1. **Hike prices:** Edit `SAMPLE_HIKES` in `src/app/hikes/page.tsx`
2. **Package prices:** Edit `PACKAGES` in `src/app/packages/page.tsx`
3. **Season Pass:** Edit `MEMBERSHIP` in `src/app/packages/page.tsx`

### Changing Contact Information

- **Email:** Search for `mountaingoatscdmx@gmail.com` and replace
- **Phone:** Search for `+52 55 4453 5014` and replace
- **Instagram:** Edit in `Footer.tsx` (around line 54)

### Adding a New Hike (Step by Step)

1. **Prepare images:**
   - Card image: `{slug}-card.jpg` (800x600px)
   - Map image: `{slug}-map.jpg` (400x400px)
   - Elevation chart: `{slug}-elevation.jpg` (400x200px)

2. **Add images to:** `public/images/hikes/`

3. **Edit** `src/app/hikes/page.tsx`:
   - Find `SAMPLE_HIKES` array
   - Copy an existing hike object
   - Update all fields with new hike data
   - Make sure `id` is unique

4. **Save and test** at `http://localhost:3000/hikes`

---

## Troubleshooting

### Common Issues

**"Module not found" error:**
- Run `npm install` to install dependencies
- Check import paths use `@/` prefix correctly

**Images not showing:**
- Verify file is in `public/images/` folder
- Check path starts with `/images/` (no `public/`)
- Check filename spelling and case sensitivity

**Styles not applying:**
- Restart dev server (`npm run dev`)
- Check Tailwind class names are correct
- Clear browser cache

**TypeScript errors:**
- Check type definitions in `src/types/database.ts`
- Ensure all required fields are provided

### Getting Help

1. Check existing code for patterns
2. Review this guide
3. Contact the development team

---

## File Quick Reference

```
MOST COMMONLY EDITED FILES:
├── src/app/
│   ├── hikes/page.tsx            ← Hike data (SAMPLE_HIKES)
│   ├── packages/page.tsx         ← Package data (PACKAGES)
│   ├── training/page.tsx         ← Training content (TRAINING_PILLARS, TRAINING_LEVELS)
│   └── about/page.tsx            ← Team data (TEAM_MEMBERS)
├── src/components/layout/
│   ├── Navbar.tsx                ← Navigation links
│   └── Footer.tsx                ← Footer links, contact info
├── public/
│   ├── images/
│   │   ├── hikes/                ← Hike images
│   │   └── team/                 ← Team photos
│   └── docs/                     ← Legal PDFs & FAQ
│       ├── MG_tds.pdf            ← Términos de Servicio
│       ├── MG_pdp.pdf            ← Política de Privacidad
│       ├── MG_pde.pdf            ← Política de Exención
│       ├── MG_pdr.pdf            ← Política de Reembolso
│       └── MG_faq.pdf            ← FAQ
└── tailwind.config.ts            ← Colors, fonts (advanced)
```

---

## Deployment Commands

### Full Deploy Pipeline

```powershell
git add . ; git commit -m "Your changes here" ; git push ; npx vercel deploy --prod --yes --force
```

### Step by Step

```bash
# 1. Stage all changes
git add .

# 2. Commit with a descriptive message
git commit -m "Add new hike: Nevado de Toluca"

# 3. Push to GitHub
git push

# 4. Deploy to Vercel (production)
npx vercel deploy --prod --yes --force
```

---

*Last updated: January 2026*
*Mountain Goats CDMX - Hiking experiences in Mexico City*

