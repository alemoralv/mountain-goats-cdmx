'use client';
// Hikes listing page - Mountain Goats CDMX

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Mountain, 
  Calendar, 
  MapPin, 
  Ruler, 
  Clock, 
  TrendingUp,
  Filter,
  ChevronDown,
  Search,
  Sparkles
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================
interface Hike {
  id: string;
  slug: string;
  title: string;
  location: string;
  date: string;
  description: string;
  short_description?: string;
  distance_km: number;
  elevation_gain_m: number;
  max_altitude_msnm: number;
  duration_hours: number;
  difficulty_level: number;
  price_hike_only: number;
  price_training_only: number;
  price_bundle: number;
  max_participants: number;
  current_participants: number;
  featured_image_url?: string;
  map_image_url?: string;
  elevation_chart_url?: string;
  difficulty_image_url?: string;
  is_featured: boolean;
  is_published: boolean;
  route_type: string;
  training_preview?: string;
  training_duration_weeks?: number;
}

// ============================================================================
// SAMPLE HIKES DATA (Matches Supabase structure for easy migration)
// ============================================================================
const SAMPLE_HIKES: Hike[] = [
  {
    id: '1',
    slug: 'mirador-de-coconetla',
    title: 'Mirador de Coconetla',
    location: 'Los Dinamos, CDMX',
    date: '2026-02-15T07:00:00',
    description: 'Descubre el Mirador de Coconetla, una joya natural dentro del Parque de los Dinamos.',
    short_description: 'Un hike perfecto para reconectar contigo mismo y con la energía del bosque.',
    distance_km: 6.5,
    elevation_gain_m: 388,
    max_altitude_msnm: 3423,
    duration_hours: 3.5,
    difficulty_level: 3,
    price_hike_only: 750,
    price_training_only: 450,
    price_bundle: 999,
    max_participants: 20,
    current_participants: 12,
    featured_image_url: '/images/hikes/coconetla-card.jpg',
    map_image_url: '/images/hikes/coconetla-map.jpg',
    elevation_chart_url: '/images/hikes/coconetla-elevation.jpg',
    difficulty_image_url: '/images/hikes/coconetla-difficulty.jpg',
    is_featured: true,
    is_published: true,
    route_type: 'Loop',
    training_preview: 'Prepárate con ejercicios de cardio básico y fortalecimiento de piernas.',
    training_duration_weeks: 2,
  },
  {
    id: '2',
    slug: 'nevado-de-toluca',
    title: 'Nevado de Toluca',
    location: 'Estado de México',
    date: '2026-02-21T05:00:00', // Saturday
    description: 'Conquista el cuarto pico más alto de México con vistas a los lagos del Sol y la Luna.',
    short_description: 'Una aventura de alta montaña con paisajes volcánicos únicos.',
    distance_km: 12,
    elevation_gain_m: 850,
    max_altitude_msnm: 4680,
    duration_hours: 8,
    difficulty_level: 7,
    price_hike_only: 1200,
    price_training_only: 650,
    price_bundle: 1650,
    max_participants: 15,
    current_participants: 8,
    featured_image_url: '/images/hikes/nevado-card.jpg',
    map_image_url: '/images/hikes/nevado-map.jpg',
    elevation_chart_url: '/images/hikes/nevado-elevation.jpg',
    difficulty_image_url: '/images/hikes/nevado-difficulty.jpg',
    is_featured: true,
    is_published: true,
    route_type: 'Out-and-Back',
    training_preview: 'Requiere preparación de 4 semanas con énfasis en aclimatación y resistencia.',
    training_duration_weeks: 4,
  },
  {
    id: '3',
    slug: 'la-malinche',
    title: 'La Malinche',
    location: 'Tlaxcala',
    date: '2026-03-08T04:30:00',
    description: 'Asciende la quinta montaña más alta de México, un volcán dormido con vistas espectaculares.',
    short_description: 'El volcán perfecto para dar el salto a la alta montaña.',
    distance_km: 14,
    elevation_gain_m: 1200,
    max_altitude_msnm: 4461,
    duration_hours: 10,
    difficulty_level: 6,
    price_hike_only: 1100,
    price_training_only: 600,
    price_bundle: 1500,
    max_participants: 18,
    current_participants: 5,
    featured_image_url: '/images/hikes/malinche-card.jpg',
    map_image_url: '/images/hikes/malinche-map.jpg',
    elevation_chart_url: '/images/hikes/malinche-elevation.jpg',
    difficulty_image_url: '/images/hikes/malinche-difficulty.jpg',
    is_featured: true,
    is_published: true,
    route_type: 'Out-and-Back',
    training_preview: 'Incluye técnicas de respiración en altitud y manejo de bastones.',
    training_duration_weeks: 3,
  },
  {
    id: '4',
    slug: 'ajusco-pico-del-aguila',
    title: 'Pico del Águila',
    location: 'Ajusco, CDMX',
    date: '2026-02-07T06:30:00', // Saturday
    description: 'El punto más alto de la Ciudad de México. Ideal para principiantes que buscan su primer reto.',
    short_description: 'Tu primera cumbre en la Ciudad de México.',
    distance_km: 8,
    elevation_gain_m: 600,
    max_altitude_msnm: 3930,
    duration_hours: 5,
    difficulty_level: 4,
    price_hike_only: 650,
    price_training_only: 400,
    price_bundle: 899,
    max_participants: 25,
    current_participants: 18,
    featured_image_url: '/images/hikes/ajusco-card.jpg',
    map_image_url: '/images/hikes/ajusco-map.jpg',
    elevation_chart_url: '/images/hikes/ajusco-elevation.jpg',
    difficulty_image_url: '/images/hikes/ajusco-difficulty.jpg',
    is_featured: false,
    is_published: true,
    route_type: 'Loop',
    training_preview: 'Preparación básica de 2 semanas enfocada en cardio y resistencia.',
    training_duration_weeks: 2,
  },
  {
    id: '5',
    slug: 'iztaccihuatl-rodillas',
    title: 'Iztaccíhuatl - Las Rodillas',
    location: 'Parque Nacional Izta-Popo',
    date: '2026-03-21T03:00:00', // Saturday
    description: 'Alcanza las rodillas de la "Mujer Dormida" en esta expedición de alta montaña.',
    short_description: 'Tu entrada al mundo del montañismo técnico.',
    distance_km: 16,
    elevation_gain_m: 1400,
    max_altitude_msnm: 4740,
    duration_hours: 12,
    difficulty_level: 8,
    price_hike_only: 1500,
    price_training_only: 800,
    price_bundle: 2000,
    max_participants: 12,
    current_participants: 4,
    featured_image_url: '/images/hikes/izta-card.jpg',
    map_image_url: '/images/hikes/izta-map.jpg',
    elevation_chart_url: '/images/hikes/izta-elevation.jpg',
    difficulty_image_url: '/images/hikes/izta-difficulty.jpg',
    is_featured: true,
    is_published: true,
    route_type: 'Out-and-Back',
    training_preview: 'Programa intensivo de 6 semanas con técnicas de crampones y piolet.',
    training_duration_weeks: 6,
  },
  {
    id: '8',
    slug: 'tepozteco',
    title: 'El Tepozteco',
    location: 'Tepoztlán, Morelos',
    date: '2026-02-28T07:00:00', // Saturday
    description: 'Asciende a la pirámide prehispánica del Tepozteco con vistas impresionantes del Valle de Morelos.',
    short_description: 'Aventura mística combinando historia y naturaleza.',
    distance_km: 5,
    elevation_gain_m: 450,
    max_altitude_msnm: 2200,
    duration_hours: 4,
    difficulty_level: 3,
    price_hike_only: 550,
    price_training_only: 300,
    price_bundle: 750,
    max_participants: 30,
    current_participants: 15,
    featured_image_url: '/images/hikes/tepozteco-card.jpg',
    map_image_url: '/images/hikes/tepozteco-map.jpg',
    elevation_chart_url: '/images/hikes/tepozteco-elevation.jpg',
    difficulty_image_url: '/images/hikes/tepozteco-difficulty.jpg',
    is_featured: false,
    is_published: true,
    route_type: 'Out-and-Back',
    training_preview: 'Preparación básica de cardio. Ideal para principiantes.',
    training_duration_weeks: 1,
  },
  {
    id: '9',
    slug: 'pena-de-bernal',
    title: 'Peña de Bernal',
    location: 'Querétaro',
    date: '2026-03-07T06:00:00', // Saturday
    description: 'Conquista el tercer monolito más grande del mundo en el corazón de Querétaro.',
    short_description: 'Un reto vertical con vistas de 360 grados.',
    distance_km: 4,
    elevation_gain_m: 350,
    max_altitude_msnm: 2515,
    duration_hours: 6,
    difficulty_level: 5,
    price_hike_only: 950,
    price_training_only: 450,
    price_bundle: 1250,
    max_participants: 15,
    current_participants: 6,
    featured_image_url: '/images/hikes/bernal-card.jpg',
    map_image_url: '/images/hikes/bernal-map.jpg',
    elevation_chart_url: '/images/hikes/bernal-elevation.jpg',
    difficulty_image_url: '/images/hikes/bernal-difficulty.jpg',
    is_featured: false,
    is_published: true,
    route_type: 'Out-and-Back',
    training_preview: 'Enfocado en técnica de escalada básica y uso de equipo.',
    training_duration_weeks: 2,
  },
  {
    id: '6',
    slug: 'desierto-leones',
    title: 'Desierto de los Leones',
    location: 'CDMX',
    date: '2026-02-01T08:00:00', // Sunday
    description: 'Explora el histórico ex-convento carmelita rodeado de bosques de oyamel en el corazón de la CDMX.',
    short_description: 'Naturaleza e historia a minutos de la ciudad.',
    distance_km: 7,
    elevation_gain_m: 250,
    max_altitude_msnm: 3200,
    duration_hours: 3,
    difficulty_level: 2,
    price_hike_only: 450,
    price_training_only: 250,
    price_bundle: 600,
    max_participants: 35,
    current_participants: 22,
    featured_image_url: '/images/hikes/desierto-card.jpg',
    map_image_url: '/images/hikes/desierto-map.jpg',
    elevation_chart_url: '/images/hikes/desierto-elevation.jpg',
    difficulty_image_url: '/images/hikes/desierto-difficulty.jpg',
    is_featured: false,
    is_published: true,
    route_type: 'Loop',
    training_preview: 'Perfecto para tu primera caminata. Sin entrenamiento especial requerido.',
    training_duration_weeks: 0,
  },
  {
    id: '7',
    slug: 'cerro-tlaloc',
    title: 'Cerro Tláloc',
    location: 'Estado de México',
    date: '2026-02-14T06:00:00', // Saturday
    description: 'Asciende al cerro sagrado de los aztecas dedicado al dios de la lluvia.',
    short_description: 'Una conexión espiritual con la montaña ancestral.',
    distance_km: 10,
    elevation_gain_m: 700,
    max_altitude_msnm: 4120,
    duration_hours: 6,
    difficulty_level: 5,
    price_hike_only: 850,
    price_training_only: 500,
    price_bundle: 1200,
    max_participants: 20,
    current_participants: 11,
    featured_image_url: '/images/hikes/tlaloc-card.jpg',
    map_image_url: '/images/hikes/tlaloc-map.jpg',
    elevation_chart_url: '/images/hikes/tlaloc-elevation.jpg',
    difficulty_image_url: '/images/hikes/tlaloc-difficulty.jpg',
    is_featured: false,
    is_published: true,
    route_type: 'Out-and-Back',
    training_preview: 'Preparación de 3 semanas con enfoque en altitud y resistencia.',
    training_duration_weeks: 3,
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const formatPrice = (price: number) => 
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);

const formatDistance = (km: number) => `${km} km`;
const formatDuration = (hours: number) => hours >= 1 ? `${hours}h` : `${Math.round(hours * 60)}m`;

const getDifficultyConfig = (level: number) => {
  if (level <= 3) return { label: 'Básico', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgLight: 'bg-emerald-50' };
  if (level <= 5) return { label: 'Moderado', color: 'bg-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-50' };
  if (level <= 7) return { label: 'Difícil', color: 'bg-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50' };
  return { label: 'Avanzado', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50' };
};

// ============================================================================
// DIFFICULTY INDICATOR COMPONENT
// ============================================================================
function DifficultyIndicator({ level }: { level: number }) {
  const config = getDifficultyConfig(level);
  
  return (
    <div className="flex flex-col items-center">
      <span className={cn('text-xs font-bold uppercase tracking-wider mb-2', config.textColor)}>
        {config.label}
      </span>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-2 h-4 rounded-sm transition-colors',
              i < level ? config.color : 'bg-gray-200'
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// HIKE CARD COMPONENT (New Design matching reference image)
// ============================================================================
function HikeCard({ hike }: { hike: Hike }) {
  const difficulty = getDifficultyConfig(hike.difficulty_level);
  const spotsRemaining = hike.max_participants - hike.current_participants;

  return (
    <Link href={`/hikes/${hike.slug}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden shadow-elevation-low hover:shadow-elevation-high transition-all duration-300 group-hover:-translate-y-1">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column - Info */}
          <div className="p-6 lg:p-8 flex flex-col">
            {/* Title */}
            <h3 className="font-display text-2xl lg:text-3xl font-bold uppercase tracking-tight text-navy-950 mb-2 group-hover:text-forest-900 transition-colors">
              {hike.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-2 text-forest-700 mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">{hike.location}</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
              {hike.short_description || hike.description.slice(0, 150) + '...'}
            </p>

            {/* Training Badge */}
            {hike.training_duration_weeks && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-forest-50 rounded-xl border border-forest-100">
                <Sparkles className="w-5 h-5 text-forest-700" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-800">Pre-Training</span>
                  <span className="text-sm text-forest-700 ml-2">{hike.training_duration_weeks} semanas</span>
                </div>
              </div>
            )}

            {/* Price & CTA */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Desde</span>
                  <span className="font-display text-2xl font-bold text-navy-950 ml-2">
                    {formatPrice(hike.price_hike_only)}
                  </span>
                </div>
                <span className="px-4 py-2 bg-forest-900 text-white text-sm font-bold uppercase tracking-wider rounded-lg group-hover:bg-forest-800 transition-colors">
                  Ver Detalles
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Visuals */}
          <div className="bg-gray-50 p-4 lg:p-6 space-y-4">
            {/* Map & Elevation Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Map Placeholder */}
              <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 border border-stone-200 relative">
                {hike.map_image_url ? (
                  <img src={hike.map_image_url} alt="Mapa" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                    <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-50">
                      <path d="M20,80 Q30,60 50,70 T80,50 Q70,30 50,40 T20,80" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="35" cy="65" r="3" fill="currentColor"/>
                      <circle cx="65" cy="45" r="3" fill="currentColor"/>
                    </svg>
                    <span className="text-[10px] uppercase tracking-wider mt-1">Mapa de Ruta</span>
                  </div>
                )}
              </div>

              {/* Altimetry & Difficulty */}
              <div className="space-y-3">
                {/* Altimetry */}
                <div className="aspect-[2/1] rounded-xl overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 border border-stone-200 relative">
                  {hike.elevation_chart_url ? (
                    <img src={hike.elevation_chart_url} alt="Altimetría" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                      <span className="text-[10px] uppercase tracking-wider font-bold">Altimetría</span>
                      <TrendingUp className="w-6 h-6 mt-1 opacity-50" />
                    </div>
                  )}
                </div>

                {/* Difficulty */}
                <div className={cn('rounded-xl p-3 text-center', difficulty.bgLight, 'border border-gray-200')}>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 block mb-1">Nivel</span>
                  <span className={cn('font-display text-sm font-bold', difficulty.textColor)}>
                    {difficulty.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white rounded-lg border border-gray-100">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Distancia</span>
                <span className="font-display text-lg font-bold text-navy-950">{formatDistance(hike.distance_km)}</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-100">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Duración</span>
                <span className="font-display text-lg font-bold text-navy-950">{formatDuration(hike.duration_hours)}</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-100">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Desnivel</span>
                <span className="font-display text-lg font-bold text-navy-950">+{hike.elevation_gain_m}m</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-100">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Alt. Máx</span>
                <span className="font-display text-lg font-bold text-navy-950">{hike.max_altitude_msnm.toLocaleString()}m</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-100">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Fecha</span>
                <span className="font-display text-sm font-bold text-navy-950">
                  {new Date(hike.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-100">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Lugares</span>
                <span className={cn(
                  'font-display text-lg font-bold',
                  spotsRemaining <= 5 ? 'text-orange-600' : 'text-navy-950'
                )}>
                  {spotsRemaining}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ============================================================================
// FILTER BAR COMPONENT
// ============================================================================
function FilterBar({ 
  onFilterChange,
  activeFilter 
}: { 
  onFilterChange: (filter: string) => void;
  activeFilter: string;
}) {
  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'basic', label: 'Básico' },
    { id: 'moderate', label: 'Moderado' },
    { id: 'difficult', label: 'Difícil' },
    { id: 'advanced', label: 'Avanzado' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeFilter === filter.id
              ? 'bg-navy-950 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function HikesPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredHikes, setFilteredHikes] = useState(SAMPLE_HIKES);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredHikes(SAMPLE_HIKES);
    } else {
      const filtered = SAMPLE_HIKES.filter((hike) => {
        const level = hike.difficulty_level;
        switch (activeFilter) {
          case 'basic': return level <= 3;
          case 'moderate': return level > 3 && level <= 5;
          case 'difficult': return level > 5 && level <= 7;
          case 'advanced': return level > 7;
          default: return true;
        }
      });
      setFilteredHikes(filtered);
    }
  }, [activeFilter]);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <p className="text-forest-400 text-sm font-bold uppercase tracking-wider mb-4">
            Explora Nuestras Rutas
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white mb-6">
            Hikes
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Desde caminatas de iniciación hasta expediciones de alta montaña. 
            Encuentra tu próxima aventura.
          </p>
        </div>
      </section>

      {/* Filter & Content Section */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-8 border-b border-gray-200">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-navy-950">
                {filteredHikes.length} {filteredHikes.length === 1 ? 'Hike' : 'Hikes'} Disponibles
              </h2>
              <p className="text-gray-500 text-sm">Próximas expediciones programadas</p>
            </div>
            <FilterBar onFilterChange={setActiveFilter} activeFilter={activeFilter} />
          </div>

          {/* Hikes List */}
          <div className="space-y-8">
            {filteredHikes.length > 0 ? (
              filteredHikes.map((hike) => (
                <HikeCard key={hike.id} hike={hike} />
              ))
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-navy-950 mb-2">No hay hikes disponibles</h3>
                <p className="text-gray-500">Prueba con otro filtro o vuelve pronto para nuevas aventuras.</p>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-12 p-6 bg-navy-950 rounded-2xl text-white">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="p-4 rounded-xl bg-white/10">
                <Sparkles className="w-8 h-8 text-forest-400" />
              </div>
              <div className="flex-grow">
                <h3 className="font-display text-xl font-bold uppercase tracking-tight mb-2">
                  ¿Buscas algo específico?
                </h3>
                <p className="text-white/70">
                  Organizamos expediciones privadas y corporativas. Contáctanos para planear tu aventura personalizada.
                </p>
              </div>
              <a
                href="mailto:mountaingoatscdmx@gmail.com"
                className="shrink-0 px-6 py-3 bg-white text-navy-950 font-bold uppercase tracking-wider rounded-xl hover:bg-white/90 transition-all"
              >
                Contáctanos
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

