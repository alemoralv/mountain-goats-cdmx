'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  X,
  Calendar as CalendarIcon,
  Users,
  Mail,
  Phone,
  User,
  MessageSquare,
  Mountain,
  MapPin,
  Clock,
  Send,
  CheckCircle
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
  difficulty_level: number;
  price_hike_only: number;
  duration_hours: number;
}

interface RequestFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  participants: number;
  preferredDifficulty: string;
  preferredLocation: string;
  message: string;
}

// ============================================================================
// SAMPLE HIKES DATA (Same as hikes page for consistency)
// ============================================================================
const SAMPLE_HIKES: Hike[] = [
  {
    id: '1',
    slug: 'mirador-de-coconetla',
    title: 'Mirador de Coconetla',
    location: 'Los Dinamos, CDMX',
    date: '2026-02-15',
    difficulty_level: 3,
    price_hike_only: 750,
    duration_hours: 3.5,
  },
  {
    id: '2',
    slug: 'nevado-de-toluca',
    title: 'Nevado de Toluca',
    location: 'Estado de México',
    date: '2026-02-22',
    difficulty_level: 7,
    price_hike_only: 1200,
    duration_hours: 8,
  },
  {
    id: '3',
    slug: 'la-malinche',
    title: 'La Malinche',
    location: 'Tlaxcala',
    date: '2026-03-08',
    difficulty_level: 6,
    price_hike_only: 1100,
    duration_hours: 10,
  },
  {
    id: '4',
    slug: 'ajusco-pico-del-aguila',
    title: 'Pico del Águila',
    location: 'Ajusco, CDMX',
    date: '2026-02-08',
    difficulty_level: 4,
    price_hike_only: 650,
    duration_hours: 5,
  },
  {
    id: '5',
    slug: 'iztaccihuatl-rodillas',
    title: 'Iztaccíhuatl - Las Rodillas',
    location: 'Parque Nacional Izta-Popo',
    date: '2026-03-22',
    difficulty_level: 8,
    price_hike_only: 1500,
    duration_hours: 12,
  },
  // Add more dates for demo
  {
    id: '6',
    slug: 'desierto-leones',
    title: 'Desierto de los Leones',
    location: 'CDMX',
    date: '2026-02-01',
    difficulty_level: 2,
    price_hike_only: 450,
    duration_hours: 3,
  },
  {
    id: '7',
    slug: 'cerro-tlaloc',
    title: 'Cerro Tláloc',
    location: 'Estado de México',
    date: '2026-02-15',
    difficulty_level: 5,
    price_hike_only: 850,
    duration_hours: 6,
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const getDifficultyColor = (level: number) => {
  if (level <= 3) return 'bg-emerald-500'; // Básico
  if (level <= 5) return 'bg-orange-500';  // Moderado
  if (level <= 7) return 'bg-red-500';     // Difícil
  return 'bg-gray-900';                     // Avanzado
};

const getDifficultyLabel = (level: number) => {
  if (level <= 3) return 'Básico';
  if (level <= 5) return 'Moderado';
  if (level <= 7) return 'Difícil';
  return 'Avanzado';
};

const formatPrice = (price: number) => 
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);

const getMonthName = (month: number) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[month];
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  const day = new Date(year, month, 1).getDay();
  // Convert Sunday (0) to 7 for Monday-start week
  return day === 0 ? 6 : day - 1;
};

// ============================================================================
// REQUEST FORM MODAL COMPONENT
// ============================================================================
function RequestFormModal({ 
  isOpen, 
  onClose, 
  selectedDate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  selectedDate: Date | null;
}) {
  const [formData, setFormData] = useState<RequestFormData>({
    name: '',
    email: '',
    phone: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    participants: 1,
    preferredDifficulty: 'any',
    preferredLocation: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update date when selectedDate changes
  useState(() => {
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate.toISOString().split('T')[0] }));
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create mailto link with form data
    const subject = encodeURIComponent(`Solicitud de Hike - ${formData.date}`);
    const body = encodeURIComponent(`
SOLICITUD DE HIKE PRIVADO
========================

Nombre: ${formData.name}
Email: ${formData.email}
Teléfono: ${formData.phone}

Fecha solicitada: ${formData.date}
Número de participantes: ${formData.participants}
Nivel preferido: ${formData.preferredDifficulty === 'any' ? 'Cualquiera' : formData.preferredDifficulty}
Ubicación preferida: ${formData.preferredLocation || 'Sin preferencia'}

Mensaje adicional:
${formData.message || 'N/A'}

---
Enviado desde el calendario de Mountain Goats CDMX
    `);

    // Open mailto
    window.location.href = `mailto:mountaingoatscdmx@gmail.com?subject=${subject}&body=${body}`;

    // Show success state
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-forest-900 to-navy-950 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-tight">
                Solicitar un Hike
              </h2>
              <p className="text-white/70 text-sm">
                {selectedDate?.toLocaleDateString('es-MX', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest-100 text-forest-700 mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-navy-950 mb-2">
              ¡Solicitud Enviada!
            </h3>
            <p className="text-gray-600 mb-6">
              Se abrirá tu cliente de correo para enviar la solicitud. 
              Nos pondremos en contacto contigo pronto.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-navy-950 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-navy-900 transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-navy-950 mb-2">
                Nombre completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all"
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-navy-950 mb-2">
                Correo electrónico *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-navy-950 mb-2">
                Teléfono (WhatsApp) *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all"
                  placeholder="+52 55 1234 5678"
                />
              </div>
            </div>

            {/* Participants */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-navy-950 mb-2">
                Número de participantes *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  required
                  min="1"
                  max="50"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 1 })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Para grupos mayores a 15 personas, contáctanos directamente.</p>
            </div>

            {/* Preferred Difficulty */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-navy-950 mb-2">
                Nivel de dificultad preferido
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'any', label: 'Cualquiera', color: 'bg-gray-100 border-gray-300' },
                  { value: 'basico', label: 'Básico', color: 'bg-emerald-50 border-emerald-300' },
                  { value: 'moderado', label: 'Moderado', color: 'bg-orange-50 border-orange-300' },
                  { value: 'dificil', label: 'Difícil', color: 'bg-red-50 border-red-300' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredDifficulty: option.value })}
                    className={cn(
                      'p-3 rounded-xl border-2 text-sm font-medium transition-all',
                      formData.preferredDifficulty === option.value
                        ? 'border-navy-950 bg-navy-950 text-white'
                        : option.color + ' text-gray-700 hover:border-gray-400'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Location */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-navy-950 mb-2">
                Ubicación preferida (opcional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.preferredLocation}
                  onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all"
                  placeholder="ej. Cerca de CDMX, Nevado de Toluca..."
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-navy-950 mb-2">
                Mensaje adicional (opcional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-all resize-none"
                  placeholder="Cuéntanos más sobre lo que buscas..."
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-wider transition-all',
                isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-forest-900 text-white hover:bg-forest-800'
              )}
            >
              {isSubmitting ? (
                <>Enviando...</>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Solicitud
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Al enviar, se abrirá tu cliente de correo con los datos pre-llenados.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// DAY DETAIL MODAL COMPONENT
// ============================================================================
function DayDetailModal({
  isOpen,
  onClose,
  selectedDate,
  hikes,
  onRequestHike,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  hikes: Hike[];
  onRequestHike: () => void;
}) {
  if (!isOpen || !selectedDate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-navy-950 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-tight">
                {selectedDate.toLocaleDateString('es-MX', { weekday: 'long' })}
              </h2>
              <p className="text-white/70">
                {selectedDate.toLocaleDateString('es-MX', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {hikes.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-4">
                {hikes.length} hike{hikes.length > 1 ? 's' : ''} disponible{hikes.length > 1 ? 's' : ''}
              </p>
              {hikes.map((hike) => (
                <Link
                  key={hike.id}
                  href={`/hikes/${hike.slug}`}
                  className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-bold text-navy-950 group-hover:text-forest-900 transition-colors">
                        {hike.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{hike.location}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-bold text-white',
                          getDifficultyColor(hike.difficulty_level)
                        )}>
                          {getDifficultyLabel(hike.difficulty_level)}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {hike.duration_hours}h
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-lg font-bold text-navy-950">
                        {formatPrice(hike.price_hike_only)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                <Mountain className="w-8 h-8" />
              </div>
              <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                No hay hikes disponibles
              </h3>
              <p className="text-gray-500 mb-6">
                No tenemos hikes programados para este día, pero podemos organizar uno para ti.
              </p>
              <button
                onClick={onRequestHike}
                className="w-full py-3 bg-forest-900 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-forest-800 transition-colors"
              >
                ¡Solicitar un Hike!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CALENDAR COMPONENT
// ============================================================================
function Calendar({ 
  hikes,
  onDayClick,
}: { 
  hikes: Hike[];
  onDayClick: (date: Date, dayHikes: Hike[]) => void;
}) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Create a map of dates to hikes
  const hikesByDate = useMemo(() => {
    const map = new Map<string, Hike[]>();
    hikes.forEach((hike) => {
      const dateKey = hike.date.split('T')[0];
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(hike);
    });
    return map;
  }, [hikes]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Format date as YYYY-MM-DD without timezone issues
  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleDayClick = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const dateKey = formatDateKey(currentYear, currentMonth, day);
    const dayHikes = hikesByDate.get(dateKey) || [];
    onDayClick(date, dayHikes);
  };

  // Days of week header
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="bg-white rounded-2xl shadow-elevation-medium overflow-hidden">
      {/* Month Navigation */}
      <div className="flex items-center justify-between p-4 bg-navy-950 text-white">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="font-display text-xl font-bold uppercase tracking-wider">
          {getMonthName(currentMonth)} {currentYear}
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Week Days Header */}
      <div 
        className="bg-gray-50 border-b border-gray-200"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}
      >
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {/* Empty cells for days before the first day of month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square border-b border-r border-gray-100 bg-gray-50/50" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = new Date(currentYear, currentMonth, day);
          const dateKey = formatDateKey(currentYear, currentMonth, day);
          const dayHikes = hikesByDate.get(dateKey) || [];
          const isToday = 
            today.getDate() === day && 
            today.getMonth() === currentMonth && 
            today.getFullYear() === currentYear;
          const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

          // Get unique difficulty levels for this day
          const difficultyLevels = [...new Set(dayHikes.map(h => {
            if (h.difficulty_level <= 3) return 'basico';
            if (h.difficulty_level <= 5) return 'moderado';
            if (h.difficulty_level <= 7) return 'dificil';
            return 'avanzado';
          }))];

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={cn(
                'aspect-square p-2 border-b border-r border-gray-100 flex flex-col transition-all relative group',
                isToday && 'bg-forest-50',
                isPast ? 'bg-gray-50/50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer',
                dayHikes.length > 0 && !isPast && 'hover:shadow-inner'
              )}
              disabled={isPast}
            >
              {/* Day Number - Top Right */}
              <span className={cn(
                'absolute top-2 right-2 text-sm font-bold',
                isToday ? 'text-forest-700' : isPast ? 'text-gray-300' : 'text-navy-950'
              )}>
                {day}
              </span>

              {/* Today indicator */}
              {isToday && (
                <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-forest-500" />
              )}

              {/* Difficulty Indicators - Bottom */}
              {dayHikes.length > 0 && !isPast && (
                <div className="mt-auto flex items-center justify-center gap-1">
                  {difficultyLevels.includes('basico') && (
                    <div className="w-3 h-3 rounded-sm bg-emerald-500" title="Básico" />
                  )}
                  {difficultyLevels.includes('moderado') && (
                    <div className="w-3 h-3 rounded-sm bg-orange-500" title="Moderado" />
                  )}
                  {difficultyLevels.includes('dificil') && (
                    <div className="w-3 h-3 rounded-sm bg-red-500" title="Difícil" />
                  )}
                  {difficultyLevels.includes('avanzado') && (
                    <div className="w-3 h-3 rounded-sm bg-gray-900" title="Avanzado" />
                  )}
                </div>
              )}

              {/* Hover indicator for empty days */}
              {dayHikes.length === 0 && !isPast && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Solicitar
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Leyenda</p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-xs text-gray-600">Básico</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-orange-500" />
            <span className="text-xs text-gray-600">Moderado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-red-500" />
            <span className="text-xs text-gray-600">Difícil</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gray-900" />
            <span className="text-xs text-gray-600">Avanzado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayHikes, setSelectedDayHikes] = useState<Hike[]>([]);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const handleDayClick = (date: Date, dayHikes: Hike[]) => {
    setSelectedDate(date);
    setSelectedDayHikes(dayHikes);
    setShowDayDetail(true);
  };

  const handleRequestHike = () => {
    setShowDayDetail(false);
    setShowRequestForm(true);
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <p className="text-forest-400 text-sm font-bold uppercase tracking-wider mb-4">
            Planifica tu Aventura
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white mb-6">
            Calendario
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Explora nuestras fechas disponibles y reserva tu próxima expedición. 
            ¿No encuentras tu fecha ideal? ¡Solicita un hike privado!
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <Calendar hikes={SAMPLE_HIKES} onDayClick={handleDayClick} />

          {/* Info Box */}
          <div className="mt-8 p-6 bg-forest-50 border border-forest-200 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-forest-900 text-white shrink-0">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                  ¿Cómo funciona?
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Haz clic en cualquier día para ver los hikes disponibles</li>
                  <li>• Los cuadros de colores indican el nivel de dificultad de los hikes</li>
                  <li>• En días sin hikes programados, puedes solicitar uno privado</li>
                  <li>• Grupos de 10+ personas reciben descuentos especiales</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Day Detail Modal */}
      <DayDetailModal
        isOpen={showDayDetail}
        onClose={() => setShowDayDetail(false)}
        selectedDate={selectedDate}
        hikes={selectedDayHikes}
        onRequestHike={handleRequestHike}
      />

      {/* Request Form Modal */}
      <RequestFormModal
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        selectedDate={selectedDate}
      />

      <Footer />
    </>
  );
}

