'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mountain,
  User,
  Edit3,
  Save,
  X,
  Shield,
  Clock,
  MapPin,
  TrendingUp,
  Calendar,
  ChevronRight,
  Award,
  Eye,
  EyeOff,
  FileText,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle,
  Activity,
  Target,
  Footprints,
  Timer,
  Phone,
  Heart,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { formatDate, formatDuration, formatDistance, getInitials } from '@/lib/utils';
import { updateProfile, updateEmergencyContact, type ProfileFormState } from './actions';
import { createClient } from '@/lib/supabase/client';
import type { Profile, Booking, Hike, UserTrainingFile, Gender } from '@/types/database';

// ============================================================================
// TYPES
// ============================================================================
interface BookingWithHike extends Booking {
  hike: Hike;
}

interface ProfileData extends Profile {
  email?: string;
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================
function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  subValue,
  gradient 
}: { 
  icon: any; 
  value: string | number; 
  label: string;
  subValue?: string;
  gradient: string;
}) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl p-6',
      gradient
    )}>
      <div className="absolute top-4 right-4 opacity-20">
        <Icon className="w-16 h-16 text-white" />
      </div>
      <div className="relative z-10">
        <span className="font-display text-4xl font-bold text-white block">
          {value}
        </span>
        {subValue && (
          <span className="text-white/70 text-sm">{subValue}</span>
        )}
        <span className="text-white/80 text-sm uppercase tracking-wider block mt-1">
          {label}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// PRIVACY NOTICE COMPONENT
// ============================================================================
function PrivacyNotice() {
  return (
    <div className="bg-navy-950/5 border border-navy-200 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-navy-100 text-navy-700 shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-navy-950 mb-1">Tu privacidad es importante</h4>
          <p className="text-sm text-gray-600">
            Solo tu <span className="font-medium text-forest-700">apodo (nickname)</span> es visible 
            para otros usuarios. Tu nombre real, edad, género y datos de contacto son{' '}
            <span className="font-medium text-navy-800">completamente privados</span> y solo 
            visibles para ti y el equipo administrativo.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BOOKING MINI CARD
// ============================================================================
function BookingMiniCard({ booking, status }: { booking: BookingWithHike; status: 'past' | 'current' | 'future' }) {
  const hike = booking.hike;
  if (!hike) return null;

  const statusColors = {
    past: 'bg-gray-100 border-gray-200',
    current: 'bg-forest-50 border-forest-200',
    future: 'bg-navy-50 border-navy-200',
  };

  const statusLabels = {
    past: 'Completado',
    current: 'En curso',
    future: 'Próximamente',
  };

  const statusBadgeColors = {
    past: 'bg-gray-500',
    current: 'bg-forest-500',
    future: 'bg-navy-500',
  };

  return (
    <Link 
      href={`/hikes/${hike.slug || hike.id}`}
      className={cn(
        'block rounded-xl border p-4 hover:shadow-md transition-all group',
        statusColors[status]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-semibold text-white',
              statusBadgeColors[status]
            )}>
              {statusLabels[status]}
            </span>
            {booking.package_type === 'bundle' && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                Bundle
              </span>
            )}
          </div>
          <h4 className="font-display font-bold text-navy-950 uppercase tracking-tight truncate group-hover:text-forest-800 transition-colors">
            {hike.title}
          </h4>
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(hike.date, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {hike.location?.split(',')[0]}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-forest-700 transition-colors shrink-0" />
      </div>
    </Link>
  );
}

// ============================================================================
// TRAINING FILE CARD
// ============================================================================
function TrainingFileCard({ file }: { file: UserTrainingFile }) {
  const categoryLabels: Record<string, { label: string; color: string }> = {
    general: { label: 'General', color: 'bg-gray-100 text-gray-700' },
    workout: { label: 'Entrenamiento', color: 'bg-forest-100 text-forest-700' },
    nutrition: { label: 'Nutrición', color: 'bg-orange-100 text-orange-700' },
    technique: { label: 'Técnica', color: 'bg-blue-100 text-blue-700' },
    medical: { label: 'Médico', color: 'bg-red-100 text-red-700' },
  };

  const category = categoryLabels[file.category] || categoryLabels.general;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-navy-100 text-navy-700 shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', category.color)}>
              {category.label}
            </span>
          </div>
          <h4 className="font-semibold text-navy-950 truncate">{file.title}</h4>
          {file.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{file.description}</p>
          )}
        </div>
        <a
          href={file.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-2 rounded-lg bg-forest-100 text-forest-700 hover:bg-forest-200 transition-colors"
          title="Descargar"
        >
          <Download className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

// ============================================================================
// SUBMIT BUTTON
// ============================================================================
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all',
        'bg-forest-900 text-white hover:bg-forest-800',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Guardando...
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          {children}
        </>
      )}
    </button>
  );
}

// ============================================================================
// MAIN PROFILE PAGE
// ============================================================================
export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [bookings, setBookings] = useState<BookingWithHike[]>([]);
  const [trainingFiles, setTrainingFiles] = useState<UserTrainingFile[]>([]);
  
  const initialState: ProfileFormState = { error: null, success: false };
  const [profileState, profileAction] = useFormState(updateProfile, initialState);
  const [emergencyState, emergencyAction] = useFormState(updateEmergencyContact, initialState);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        router.push('/login');
        return;
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData && typeof profileData === 'object') {
        setProfile({ 
          ...(profileData as Record<string, unknown>), 
          email: user.email 
        } as ProfileData);
      }

      // Fetch bookings with hikes
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          hike:hikes (*)
        `)
        .eq('user_id', user.id)
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false });

      if (bookingsData) {
        setBookings(bookingsData as BookingWithHike[]);
      }

      // Fetch user training files
      const { data: filesData } = await supabase
        .from('user_training_files')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true });

      if (filesData) {
        setTrainingFiles(filesData as UserTrainingFile[]);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [router]);

  // Handle successful profile update
  useEffect(() => {
    if (profileState.success) {
      setIsEditing(false);
      // Refetch profile
      const refetch = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          if (data && typeof data === 'object') {
            setProfile({ ...(data as Record<string, unknown>), email: user.email } as ProfileData);
          }
        }
      };
      refetch();
    }
  }, [profileState.success]);

  // Categorize bookings
  const now = new Date();
  const pastBookings = bookings.filter(b => b.hike && new Date(b.hike.date) < now);
  const currentBookings = bookings.filter(b => {
    if (!b.hike) return false;
    const hikeDate = new Date(b.hike.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return hikeDate.toDateString() === today.toDateString();
  });
  const futureBookings = bookings.filter(b => {
    if (!b.hike) return false;
    const hikeDate = new Date(b.hike.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return hikeDate > today;
  });

  // Calculate stats
  const totalHikes = profile?.total_hikes_completed || pastBookings.length || 0;
  const totalElevation = profile?.total_elevation_gained || 0;
  const totalDistance = profile?.total_distance_km || 0;
  const totalDuration = profile?.total_duration_hours || 0;

  // Format stats
  const formatMountainTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const formatTotalElevation = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}k`;
    }
    return meters.toLocaleString('es-MX');
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-forest-700 mx-auto mb-4" />
            <p className="text-gray-500">Cargando tu perfil...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-500">No se pudo cargar tu perfil.</p>
            <Link href="/login" className="text-forest-700 hover:underline mt-2 inline-block">
              Iniciar sesión
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const displayName = profile.nickname || profile.full_name || profile.email?.split('@')[0] || 'Goat';
  const genderLabels: Record<string, string> = {
    male: 'Masculino',
    female: 'Femenino',
    other: 'Otro',
    prefer_not_to_say: 'Prefiero no decir',
  };

  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-hero pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Profile Avatar & Name */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white font-display text-4xl md:text-5xl font-bold border-2 border-white/20">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={displayName}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    getInitials(profile.full_name || profile.nickname)
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-forest-500 text-white">
                  <Mountain className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-white/60 text-sm uppercase tracking-wider">
                  Tu Perfil de Goat
                </span>
                <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-white">
                  {displayName}
                </h1>
                <p className="text-white/70 mt-1">
                  Miembro desde {formatDate(profile.created_at, { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                'flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all',
                isEditing
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-white text-navy-950 hover:bg-white/90'
              )}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancelar
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Editar Perfil
                </>
              )}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <StatCard
              icon={Award}
              value={totalHikes}
              label="Cumbres Conquistadas"
              gradient="bg-gradient-to-br from-forest-800 to-forest-950"
            />
            <StatCard
              icon={Timer}
              value={formatMountainTime(totalDuration)}
              label="Tiempo en Montaña"
              gradient="bg-gradient-to-br from-navy-700 to-navy-950"
            />
            <StatCard
              icon={Footprints}
              value={totalDistance > 0 ? `${totalDistance.toFixed(1)}` : '0'}
              subValue="km"
              label="Distancia Recorrida"
              gradient="bg-gradient-to-br from-cyan-700 to-cyan-950"
            />
            <StatCard
              icon={TrendingUp}
              value={formatTotalElevation(totalElevation)}
              subValue="m"
              label="Desnivel Acumulado"
              gradient="bg-gradient-to-br from-purple-700 to-purple-950"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Profile Form or Display */}
              <div className="bg-white rounded-2xl shadow-elevation-low p-6">
                <h2 className="font-display text-xl font-bold uppercase tracking-tight text-navy-950 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-forest-700" />
                  Información Personal
                </h2>

                <PrivacyNotice />

                {profileState.error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-sm text-red-600">{profileState.error}</p>
                  </div>
                )}

                {profileState.success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <p className="text-sm text-green-600">{profileState.message}</p>
                  </div>
                )}

                {isEditing ? (
                  <form action={profileAction} className="space-y-4">
                    {/* Nickname (required) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apodo (público) <span className="text-red-500">*</span>
                        <span className="flex items-center gap-1 text-xs text-forest-600 mt-0.5">
                          <Eye className="w-3 h-3" /> Visible para otros
                        </span>
                      </label>
                      <input
                        name="nickname"
                        type="text"
                        required
                        minLength={2}
                        defaultValue={profile.nickname || ''}
                        placeholder="Tu apodo de Goat"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all"
                      />
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo
                        <span className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <EyeOff className="w-3 h-3" /> Solo visible para ti
                        </span>
                      </label>
                      <input
                        name="fullName"
                        type="text"
                        defaultValue={profile.full_name || ''}
                        placeholder="Tu nombre real"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                        <span className="flex items-center gap-1 text-xs text-forest-600 mt-0.5">
                          <Eye className="w-3 h-3" /> Visible para otros
                        </span>
                      </label>
                      <textarea
                        name="bio"
                        rows={3}
                        defaultValue={profile.bio || ''}
                        placeholder="Cuéntanos un poco sobre ti..."
                        maxLength={300}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all resize-none"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Género
                        <span className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <EyeOff className="w-3 h-3" /> Solo visible para ti
                        </span>
                      </label>
                      <select
                        name="gender"
                        defaultValue={profile.gender || ''}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                        <option value="prefer_not_to_say">Prefiero no decir</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de nacimiento
                        <span className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <EyeOff className="w-3 h-3" /> Solo visible para ti
                        </span>
                      </label>
                      <input
                        name="dateOfBirth"
                        type="date"
                        defaultValue={profile.date_of_birth || ''}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                        <span className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <EyeOff className="w-3 h-3" /> Solo visible para ti
                        </span>
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        defaultValue={profile.phone || ''}
                        placeholder="+52 55 1234 5678"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all"
                      />
                    </div>

                    <SubmitButton>Guardar Cambios</SubmitButton>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {/* Display Profile Info */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500 text-sm">Apodo</span>
                      <span className="font-medium text-navy-950">{profile.nickname || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Nombre
                      </span>
                      <span className="font-medium text-navy-950">{profile.full_name || '—'}</span>
                    </div>
                    {profile.bio && (
                      <div className="py-3 border-b border-gray-100">
                        <span className="text-gray-500 text-sm block mb-1">Bio</span>
                        <p className="text-navy-950">{profile.bio}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Género
                      </span>
                      <span className="font-medium text-navy-950">
                        {profile.gender ? genderLabels[profile.gender] : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Fecha de nacimiento
                      </span>
                      <span className="font-medium text-navy-950">
                        {profile.date_of_birth 
                          ? formatDate(profile.date_of_birth, { day: 'numeric', month: 'long', year: 'numeric' })
                          : '—'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Teléfono
                      </span>
                      <span className="font-medium text-navy-950">{profile.phone || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-500 text-sm">Email</span>
                      <span className="font-medium text-navy-950">{profile.email}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-2xl shadow-elevation-low p-6">
                <h2 className="font-display text-xl font-bold uppercase tracking-tight text-navy-950 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Contacto de Emergencia
                </h2>
                
                <p className="text-sm text-gray-500 mb-4">
                  Esta información solo se usará en caso de emergencia durante una expedición.
                </p>

                {emergencyState.success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <p className="text-sm text-green-600">{emergencyState.message}</p>
                  </div>
                )}

                <form action={emergencyAction} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del contacto
                    </label>
                    <input
                      name="contactName"
                      type="text"
                      defaultValue={profile.emergency_contact?.name || ''}
                      placeholder="Nombre completo"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono del contacto
                    </label>
                    <input
                      name="contactPhone"
                      type="tel"
                      defaultValue={profile.emergency_contact?.phone || ''}
                      placeholder="+52 55 1234 5678"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relación
                    </label>
                    <input
                      name="contactRelationship"
                      type="text"
                      defaultValue={profile.emergency_contact?.relationship || ''}
                      placeholder="Ej: Esposo/a, Padre/Madre, Hermano/a"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all"
                    />
                  </div>
                  <SubmitButton>Actualizar Contacto</SubmitButton>
                </form>
              </div>
            </div>

            {/* Right Column - Bookings & Training */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Future Hikes */}
              <section className="bg-white rounded-2xl shadow-elevation-low p-6">
                <h2 className="font-display text-xl font-bold uppercase tracking-tight text-navy-950 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-navy-700" />
                  Próximos Hikes
                  {futureBookings.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-navy-100 text-navy-700 text-xs font-semibold">
                      {futureBookings.length}
                    </span>
                  )}
                </h2>

                {futureBookings.length > 0 ? (
                  <div className="space-y-3">
                    {futureBookings.map((booking) => (
                      <BookingMiniCard key={booking.id} booking={booking} status="future" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <Mountain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No tienes hikes programados</p>
                    <Link
                      href="/hikes"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-navy-950 text-white font-semibold rounded-lg hover:bg-navy-900 transition-colors"
                    >
                      Explorar Hikes
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </section>

              {/* Current Hikes (Today) */}
              {currentBookings.length > 0 && (
                <section className="bg-forest-50 border-2 border-forest-200 rounded-2xl p-6">
                  <h2 className="font-display text-xl font-bold uppercase tracking-tight text-forest-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-forest-700" />
                    ¡Hoy tienes hike!
                  </h2>
                  <div className="space-y-3">
                    {currentBookings.map((booking) => (
                      <BookingMiniCard key={booking.id} booking={booking} status="current" />
                    ))}
                  </div>
                </section>
              )}

              {/* Past Hikes (History) */}
              <section className="bg-white rounded-2xl shadow-elevation-low p-6">
                <h2 className="font-display text-xl font-bold uppercase tracking-tight text-navy-950 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-gray-600" />
                  Historial de Cumbres
                  {pastBookings.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                      {pastBookings.length}
                    </span>
                  )}
                </h2>

                {pastBookings.length > 0 ? (
                  <div className="space-y-3">
                    {pastBookings.slice(0, 5).map((booking) => (
                      <BookingMiniCard key={booking.id} booking={booking} status="past" />
                    ))}
                    {pastBookings.length > 5 && (
                      <p className="text-center text-sm text-gray-500 pt-2">
                        Y {pastBookings.length - 5} hikes más completados...
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aún no has completado ningún hike</p>
                    <p className="text-sm text-gray-400 mt-1">
                      ¡Reserva tu primera aventura y comienza tu historial de Goat!
                    </p>
                  </div>
                )}
              </section>

              {/* My Pre-Trainings */}
              <section className="bg-white rounded-2xl shadow-elevation-low p-6">
                <h2 className="font-display text-xl font-bold uppercase tracking-tight text-navy-950 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-forest-700" />
                  Mis Pre-Entrenamientos
                  {trainingFiles.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 text-xs font-semibold">
                      {trainingFiles.length}
                    </span>
                  )}
                </h2>

                <p className="text-sm text-gray-500 mb-4">
                  Archivos de entrenamiento personalizados subidos por el equipo de Mountain Goats específicamente para ti.
                </p>

                {trainingFiles.length > 0 ? (
                  <div className="space-y-3">
                    {trainingFiles.map((file) => (
                      <TrainingFileCard key={file.id} file={file} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aún no tienes archivos de pre-entrenamiento</p>
                    <p className="text-sm text-gray-400 mt-1">
                      El equipo subirá tu plan personalizado aquí cuando reserves un paquete de entrenamiento.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

