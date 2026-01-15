import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Mountain,
  Dumbbell,
  Play,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { signOut } from '@/app/login/actions';
import { cn } from '@/lib/utils';
import { formatDate, formatPrice, getInitials } from '@/lib/utils';

// ============================================================================
// DATA FETCHING
// ============================================================================
async function getDashboardData() {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch all bookings with hike data
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select(`
      *,
      hike:hikes (
        id,
        title,
        slug,
        date,
        location,
        difficulty_level,
        distance_km,
        duration_hours,
        featured_image_url
      )
    `)
    .eq('user_id', user.id)
    .eq('payment_status', 'completed')
    .order('created_at', { ascending: false });

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError);
  }

  // Get training content for bookings with training/bundle packages
  const trainingBookings = (bookings || []).filter(
    (b) => b.package_type === 'training' || b.package_type === 'bundle'
  );

  const hikeIds = trainingBookings.map((b) => b.hike_id);

  let trainingContent: any[] = [];
  if (hikeIds.length > 0) {
    const { data: content } = await supabase
      .from('training_content')
      .select('*')
      .in('hike_id', hikeIds)
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    trainingContent = content || [];
  }

  // Separate upcoming and past hikes
  const now = new Date();
  const upcomingBookings = (bookings || []).filter(
    (b) => b.hike && new Date(b.hike.date) >= now
  );
  const pastBookings = (bookings || []).filter(
    (b) => b.hike && new Date(b.hike.date) < now
  );

  return {
    user,
    profile,
    upcomingBookings,
    pastBookings,
    trainingBookings,
    trainingContent,
  };
}

// ============================================================================
// BOOKING CARD COMPONENT
// ============================================================================
function BookingCard({ booking, isPast = false }: { booking: any; isPast?: boolean }) {
  const hike = booking.hike;
  if (!hike) return null;

  const packageLabels: Record<string, string> = {
    hike: 'Caminata',
    training: 'Entrenamiento',
    bundle: 'Paquete Completo',
  };

  return (
    <div className={cn(
      'bg-white rounded-2xl overflow-hidden shadow-elevation-low hover:shadow-elevation-medium transition-all',
      isPast && 'opacity-70'
    )}>
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-48 h-32 md:h-auto bg-gradient-to-br from-navy-900 to-forest-900 relative flex-shrink-0">
          {hike.featured_image_url ? (
            <img 
              src={hike.featured_image_url} 
              alt={hike.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Mountain className="w-12 h-12 text-white/30" />
            </div>
          )}
          {/* Status Badge */}
          <div className={cn(
            'absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold',
            isPast 
              ? 'bg-gray-500/80 text-white' 
              : booking.checked_in 
                ? 'bg-green-500/80 text-white'
                : 'bg-forest-500/80 text-white'
          )}>
            {isPast ? 'Completada' : booking.checked_in ? 'Check-in ✓' : 'Confirmada'}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-navy-950">
                {hike.title}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-forest-700" />
                  {formatDate(hike.date, { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-forest-700" />
                  {hike.location?.split(',')[0]}
                </span>
              </div>
            </div>

            {/* Package Type */}
            <span className="px-3 py-1 bg-navy-100 text-navy-800 text-xs font-semibold rounded-full shrink-0">
              {packageLabels[booking.package_type] || booking.package_type}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Código: {booking.confirmation_code}</span>
            </div>
            <Link
              href={`/hikes/${hike.slug || hike.id}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-forest-700 hover:text-forest-900 transition-colors"
            >
              Ver detalles
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TRAINING CONTENT CARD
// ============================================================================
function TrainingContentCard({ content, hikeName }: { content: any; hikeName: string }) {
  const contentTypeIcons: Record<string, any> = {
    video: Play,
    pdf: FileText,
    article: FileText,
    audio: Play,
  };
  const Icon = contentTypeIcons[content.content_type] || FileText;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:border-forest-200 hover:shadow-sm transition-all">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-forest-100 text-forest-700 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-forest-600 uppercase tracking-wider mb-1">
            {hikeName}
          </p>
          <h4 className="font-semibold text-navy-950 truncate">
            {content.title}
          </h4>
          {content.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {content.description}
            </p>
          )}
          {content.duration_minutes && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {content.duration_minutes} min
            </div>
          )}
        </div>
        <a
          href={content.content_url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2 bg-navy-950 text-white text-sm font-semibold rounded-lg hover:bg-navy-900 transition-colors"
        >
          {content.content_type === 'video' ? 'Ver' : 'Abrir'}
        </a>
      </div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================
function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: { 
  icon: any; 
  title: string; 
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="text-center py-12 px-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-semibold text-navy-950 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-sm mx-auto">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-forest-900 text-white font-semibold rounded-xl hover:bg-forest-800 transition-colors"
        >
          {action.label}
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD PAGE
// ============================================================================
export default async function DashboardPage() {
  const { 
    user, 
    profile, 
    upcomingBookings, 
    pastBookings, 
    trainingBookings,
    trainingContent 
  } = await getDashboardData();

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Goat';

  // Group training content by hike
  const trainingByHike = trainingBookings.map((booking) => ({
    booking,
    content: trainingContent.filter((c) => c.hike_id === booking.hike_id),
  }));

  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-hero pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Welcome */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white font-display text-2xl font-bold">
                {getInitials(profile?.full_name)}
              </div>
              <div>
                <p className="text-white/60 text-sm">Bienvenido de vuelta,</p>
                <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-white">
                  {displayName}
                </h1>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Perfil</span>
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Salir</span>
                </button>
              </form>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
            <div className="text-center">
              <span className="font-display text-2xl font-bold text-white block">
                {upcomingBookings.length}
              </span>
              <span className="text-white/60 text-sm">Próximas</span>
            </div>
            <div className="text-center">
              <span className="font-display text-2xl font-bold text-white block">
                {pastBookings.length}
              </span>
              <span className="text-white/60 text-sm">Completadas</span>
            </div>
            <div className="text-center">
              <span className="font-display text-2xl font-bold text-white block">
                {trainingContent.length}
              </span>
              <span className="text-white/60 text-sm">Entrenamientos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Upcoming Hikes Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-forest-100 text-forest-700">
                  <Calendar className="w-5 h-5" />
                </div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-navy-950">
                  Próximos Hikes
                </h2>
              </div>
              <Link
                href="/hikes"
                className="text-sm font-semibold text-forest-700 hover:text-forest-900 flex items-center gap-1 transition-colors"
              >
                Ver todos
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Mountain}
                title="Sin caminatas próximas"
                description="Aún no tienes caminatas programadas. Explora nuestras expediciones y únete a la aventura."
                action={{ label: 'Explorar Hikes', href: '/hikes' }}
              />
            )}
          </section>

          {/* Training & Preparation Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-navy-100 text-navy-700">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-navy-950">
                Entrenamiento & Preparación
              </h2>
            </div>

            {trainingByHike.length > 0 && trainingByHike.some(t => t.content.length > 0) ? (
              <div className="space-y-8">
                {trainingByHike.map(({ booking, content }) => {
                  if (content.length === 0) return null;
                  const hikeName = booking.hike?.title || 'Entrenamiento';
                  
                  return (
                    <div key={booking.id}>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        {hikeName}
                      </h3>
                      <div className="grid gap-4">
                        {content.map((item) => (
                          <TrainingContentCard 
                            key={item.id} 
                            content={item} 
                            hikeName={hikeName}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : trainingBookings.length > 0 ? (
              <EmptyState
                icon={AlertCircle}
                title="Contenido en preparación"
                description="Tu entrenamiento está en camino. Pronto tendrás acceso al contenido exclusivo para tu caminata."
              />
            ) : (
              <EmptyState
                icon={Dumbbell}
                title="Sin planes de entrenamiento activos"
                description="Los planes de entrenamiento se desbloquean al reservar paquetes de Entrenamiento o Bundle."
                action={{ label: 'Ver Paquetes', href: '/hikes' }}
              />
            )}
          </section>

          {/* Past Hikes Section */}
          {pastBookings.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gray-100 text-gray-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-navy-950">
                  Historial de Caminatas
                </h2>
              </div>
              <div className="space-y-4">
                {pastBookings.slice(0, 3).map((booking) => (
                  <BookingCard key={booking.id} booking={booking} isPast />
                ))}
              </div>
              {pastBookings.length > 3 && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Y {pastBookings.length - 3} caminatas más...
                </p>
              )}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

