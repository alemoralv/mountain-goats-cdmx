import Link from 'next/link';
import { 
  Mountain, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  Shield,
  Calendar,
  MapPin,
  Clock,
  Ruler,
  Sparkles
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { formatPrice, formatDistance, formatDuration } from '@/lib/utils';
import { getFeaturedHikes, getPlatformStats } from '@/lib/data';
import type { Hike } from '@/types/database';

// ============================================================================
// HIKE CARD COMPONENT
// ============================================================================
function HikeCard({ hike }: { hike: Hike }) {
  const getDifficultyLabel = (level: number) => {
    if (level <= 3) return { label: 'Básico', color: 'bg-green-500' };
    if (level <= 5) return { label: 'Moderado', color: 'bg-yellow-500' };
    if (level <= 7) return { label: 'Difícil', color: 'bg-orange-500' };
    return { label: 'Avanzado', color: 'bg-red-500' };
  };

  const difficulty = getDifficultyLabel(hike.difficulty_level);
  const spotsRemaining = hike.max_participants - hike.current_participants;

  return (
    <Link href={`/hikes/${hike.slug || hike.id}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden shadow-elevation-low hover:shadow-elevation-high transition-all duration-300 group-hover:-translate-y-2">
        {/* Image */}
        <div className="aspect-[4/3] relative bg-gradient-to-br from-navy-900 to-forest-900">
          {hike.featured_image_url ? (
            <img 
              src={hike.featured_image_url} 
              alt={hike.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Mountain className="w-16 h-16 text-white/20" />
            </div>
          )}
          
          {/* Difficulty Badge */}
          <div className="absolute top-4 left-4">
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-bold text-white',
              difficulty.color
            )}>
              {difficulty.label}
            </span>
          </div>

          {/* Spots Badge */}
          {spotsRemaining <= 5 && spotsRemaining > 0 && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-navy-950">
                ¡{spotsRemaining} lugares!
              </span>
            </div>
          )}

          {/* Sold Out Badge */}
          {spotsRemaining <= 0 && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                Agotado
              </span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Date */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">
              {new Date(hike.date).toLocaleDateString('es-MX', { 
                day: 'numeric', 
                month: 'short' 
              })}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title & Location */}
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-navy-950 mb-1 group-hover:text-forest-900 transition-colors">
            {hike.title}
          </h3>
          <div className="flex items-center gap-1 text-forest-700 mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{hike.location?.split(',')[0]}</span>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2 py-3 border-y border-gray-100">
            <div className="text-center">
              <Ruler className="w-4 h-4 mx-auto text-forest-700 mb-1" />
              <span className="block text-xs font-bold text-navy-950">{formatDistance(hike.distance_km)}</span>
            </div>
            <div className="text-center">
              <TrendingUp className="w-4 h-4 mx-auto text-forest-700 mb-1" />
              <span className="block text-xs font-bold text-navy-950">+{hike.elevation_gain_m}m</span>
            </div>
            <div className="text-center">
              <Mountain className="w-4 h-4 mx-auto text-forest-700 mb-1" />
              <span className="block text-xs font-bold text-navy-950">{hike.max_altitude_msnm}m</span>
            </div>
            <div className="text-center">
              <Clock className="w-4 h-4 mx-auto text-forest-700 mb-1" />
              <span className="block text-xs font-bold text-navy-950">{formatDuration(hike.duration_hours)}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">Desde</span>
            <span className="font-display text-2xl font-bold text-navy-950">
              {formatPrice(hike.price_hike_only)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default async function HomePage() {
  // Fetch real data from Supabase
  const [featuredHikes, stats] = await Promise.all([
    getFeaturedHikes(3),
    getPlatformStats(),
  ]);

  // Platform stats with fallbacks
  const STATS = [
    { value: `${stats.totalHikes || 50}+`, label: 'Caminatas realizadas' },
    { value: `${stats.totalParticipants > 0 ? stats.totalParticipants.toLocaleString() : '1,200'}+`, label: 'Goats felices' },
    { value: `${stats.uniqueRoutes || 15}`, label: 'Rutas únicas' },
    { value: `${stats.maxAltitude > 0 ? stats.maxAltitude.toLocaleString() : '4,680'}m`, label: 'Altitud máxima' },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-hero">
          <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-forest-400" />
            <span className="text-white/90 text-sm font-medium">Temporada Alta Montaña 2026</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-white mb-6 leading-none">
            Conquista las
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-forest-400 to-emerald-300">
              Montañas de CDMX
            </span>
          </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            We train. We ascend. We conquer.
            <br className="hidden md:block" /> {/* Optional: Hide break on mobile if you want */}
            <br />
            Entrenamiento. Comunidad. Aventuras.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/hikes"
              className="inline-flex items-center gap-2 bg-white text-navy-950 font-bold uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
            >
              Ver Caminatas
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-white/20 transition-all"
            >
              Conoce a los Goats
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-white/10">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="font-display text-3xl md:text-4xl font-bold text-white block mb-1">
                  {stat.value}
                </span>
                <span className="text-white/60 text-sm uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Hikes Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-forest-700 text-sm font-bold uppercase tracking-wider mb-4">
              Próximas Aventuras
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight text-navy-950 mb-4">
              Hikes Destacados
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Únete a nuestras expediciones guiadas y descubre los paisajes más impresionantes cerca de la Ciudad de México.
            </p>
          </div>

          {/* Hikes Grid */}
          {featuredHikes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredHikes.map((hike) => (
                <HikeCard key={hike.id} hike={hike} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-navy-950 mb-2">Próximamente</h3>
              <p className="text-gray-500">Estamos preparando nuevas aventuras. ¡Vuelve pronto!</p>
            </div>
          )}

          {/* View All CTA */}
          <div className="text-center mt-12">
            <Link
              href="/hikes"
              className="inline-flex items-center gap-2 bg-navy-950 text-white font-semibold uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-navy-900 transition-all"
            >
              Ver Todas las Caminatas
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-20 md:py-32 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight text-white mb-4">
              ¿Por qué Mountain Goats?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Guides */}
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest-900/50 text-forest-400 mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white mb-3">
                Guías Expertos
              </h3>
              <p className="text-white/70 leading-relaxed">
                Todos nuestros guías están certificados en alta montaña y primeros auxilios. Tu seguridad es nuestra prioridad.
              </p>
            </div>

            {/* Training */}
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest-900/50 text-forest-400 mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white mb-3">
                Training Digital
              </h3>
              <p className="text-white/70 leading-relaxed">
                Prepárate con nuestro contenido exclusivo: videos de técnica, planes de entrenamiento y guías de equipo.
              </p>
            </div>

            {/* Safety */}
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest-900/50 text-forest-400 mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white mb-3">
                Seguridad Total
              </h3>
              <p className="text-white/70 leading-relaxed">
                Equipo de comunicación satelital, protocolos de emergencia y seguro incluido en todas las expediciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
