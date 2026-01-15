import { 
  Mountain, 
  Clock, 
  Ruler, 
  TrendingUp, 
  MapPin, 
  Bus,
  Gauge,
  Route,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistance, formatElevation, formatAltitude, formatDuration, formatDate } from '@/lib/utils';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookingCard } from '@/components/hikes/BookingCard';
import { getHike } from '@/lib/data';
import type { Hike } from '@/types/database';

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}

function StatCard({ icon, label, value, subValue }: StatCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 hover:border-forest-200 hover:shadow-sm transition-all">
      <div className="text-forest-900 mb-2">
        {icon}
      </div>
      <span className="font-display text-xl font-bold text-navy-950 tracking-tight">
        {value}
      </span>
      {subValue && (
        <span className="text-xs text-gray-500">{subValue}</span>
      )}
      <span className="text-xs uppercase tracking-wider text-gray-400 mt-1">
        {label}
      </span>
    </div>
  );
}

// ============================================================================
// DIFFICULTY BADGE COMPONENT
// ============================================================================
function DifficultyBadge({ level }: { level: number }) {
  const getConfig = (level: number) => {
    if (level <= 3) return { label: 'Básico', color: 'bg-green-100 text-green-800', dots: level };
    if (level <= 5) return { label: 'Moderado', color: 'bg-yellow-100 text-yellow-800', dots: level };
    if (level <= 7) return { label: 'Difícil', color: 'bg-orange-100 text-orange-800', dots: level };
    return { label: 'Avanzado', color: 'bg-red-100 text-red-800', dots: level };
  };

  const config = getConfig(level);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100">
      <Gauge className="w-6 h-6 text-forest-900 mb-2" />
      <span className={cn(
        'px-2 py-0.5 rounded-full text-xs font-semibold mb-1',
        config.color
      )}>
        {config.label}
      </span>
      <div className="flex gap-0.5 mt-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-1.5 h-3 rounded-sm',
              i < level ? 'bg-navy-950' : 'bg-gray-200'
            )}
          />
        ))}
      </div>
      <span className="text-xs uppercase tracking-wider text-gray-400 mt-2">
        Nivel {level}/10
      </span>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
interface HikeDetailPageProps {
  params: { id: string };
}

export default async function HikeDetailPage({ params }: HikeDetailPageProps) {
  // Fetch real hike data from Supabase
  const hike = await getHike(params.id);

  // Estimate transfer time based on location (placeholder logic)
  const transferTimeMinutes = hike.location?.toLowerCase().includes('cdmx') ? 45 : 90;

  // Get hero image (prioritize main_image_url, then featured_image_url)
  const heroImage = (hike as any).main_image_url || hike.featured_image_url;
  const mapImage = (hike as any).map_image_url;
  const elevationChart = (hike as any).elevation_chart_url;

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        {/* Background Image or Gradient */}
        <div className="absolute inset-0 bg-gradient-hero">
          {heroImage ? (
            <img 
              src={heroImage} 
              alt={hike.title}
              className="w-full h-full object-cover opacity-40"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link href="/hikes" className="hover:text-white transition-colors">
                Caminatas
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white/80">{hike.title}</span>
            </nav>

            {/* Date Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <Calendar className="w-4 h-4 text-forest-400" />
                <span className="text-white font-medium">
                  {formatDate(hike.date)}
                </span>
              </div>
              {hike.is_featured && (
                <span className="inline-flex items-center gap-1 bg-forest-900/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Destacada
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white mb-4">
              {hike.title}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-2 text-forest-400">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{hike.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column - Content */}
            <div className="lg:col-span-7 space-y-10">
              {/* Description */}
              <section>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-navy-950 mb-6">
                  Sobre esta Caminata
                </h2>
                <div 
                  className="prose prose-lg prose-gray max-w-none
                    prose-headings:font-display prose-headings:text-navy-950 prose-headings:uppercase prose-headings:tracking-tight
                    prose-p:text-gray-600 prose-p:leading-relaxed
                    prose-li:text-gray-600
                    prose-strong:text-navy-950"
                  dangerouslySetInnerHTML={{ __html: hike.description }}
                />
              </section>

              {/* Training Edge Box */}
              {hike.training_preview && (
                <section className="border-2 border-forest-200 bg-forest-50/30 rounded-2xl p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-forest-900 text-white shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold uppercase tracking-tight text-navy-950 mb-3">
                        The Training Edge
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {hike.training_preview}
                      </p>
                      <ul className="space-y-2">
                        {['Videos de técnica paso a paso', 'Plan de entrenamiento de 4 semanas', 'Guía completa de equipo', 'Acceso de por vida'].map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              )}

              {/* Meeting Point */}
              {hike.meeting_point && (
                <section>
                  <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-navy-950 mb-6">
                    Punto de Encuentro
                  </h2>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="w-6 h-6 text-forest-900 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-navy-950">{hike.meeting_point}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Hora de salida: {new Date(hike.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Right Column - Visual Grid & Booking */}
            <div className="lg:col-span-5 space-y-8">
              {/* Visual Grid */}
              <div className="space-y-4">
                {/* Map & Elevation Images */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Map */}
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    {mapImage ? (
                      <img 
                        src={mapImage} 
                        alt="Trail Map"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <Route className="w-10 h-10 mb-2" />
                        <span className="text-xs uppercase tracking-wider">Mapa</span>
                      </div>
                    )}
                  </div>

                  {/* Elevation Chart */}
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    {elevationChart ? (
                      <img 
                        src={elevationChart} 
                        alt="Elevation Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <TrendingUp className="w-10 h-10 mb-2" />
                        <span className="text-xs uppercase tracking-wider">Altimetría</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Grid - 2x3 */}
                <div className="grid grid-cols-3 gap-3">
                  <StatCard
                    icon={<Ruler className="w-6 h-6" />}
                    label="Distancia"
                    value={formatDistance(hike.distance_km)}
                  />
                  <StatCard
                    icon={<Clock className="w-6 h-6" />}
                    label="Duración"
                    value={formatDuration(hike.duration_hours)}
                  />
                  <StatCard
                    icon={<Bus className="w-6 h-6" />}
                    label="Traslado"
                    value={`${transferTimeMinutes}m`}
                    subValue="desde CDMX"
                  />
                  <StatCard
                    icon={<TrendingUp className="w-6 h-6" />}
                    label="Desnivel"
                    value={formatElevation(hike.elevation_gain_m)}
                    subValue="positivo"
                  />
                  <StatCard
                    icon={<Mountain className="w-6 h-6" />}
                    label="Altitud Máx"
                    value={formatAltitude(hike.max_altitude_msnm).replace(' msnm', '')}
                    subValue="msnm"
                  />
                  <DifficultyBadge level={hike.difficulty_level} />
                </div>
              </div>

              {/* Sticky Booking Card */}
              <div className="lg:sticky lg:top-24">
                <BookingCard hike={{
                  id: hike.id,
                  title: hike.title,
                  slug: hike.slug,
                  price_hike_only: hike.price_hike_only,
                  price_training_only: hike.price_training_only,
                  price_bundle: hike.price_bundle,
                  max_participants: hike.max_participants,
                  current_participants: hike.current_participants,
                  date: hike.date,
                }} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

// ============================================================================
// METADATA
// ============================================================================
export async function generateMetadata({ params }: HikeDetailPageProps) {
  try {
    const hike = await getHike(params.id);
    return {
      title: hike.title,
      description: hike.short_description || hike.description?.slice(0, 160),
      openGraph: {
        title: `${hike.title} | Mountain Goats CDMX`,
        description: hike.short_description || hike.description?.slice(0, 160),
        images: hike.featured_image_url ? [hike.featured_image_url] : [],
      },
    };
  } catch {
    return {
      title: 'Caminata no encontrada',
    };
  }
}
