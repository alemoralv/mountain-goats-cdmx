'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mountain, 
  ChevronRight, 
  ChevronLeft,
  User,
  Activity,
  Calendar,
  Target,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { 
  HikeDifficultyLevel, 
  SessionDuration, 
  StrengthTrainingType, 
  TrainingDay 
} from '@/types/database';

// Local storage key for saving form data
const STORAGE_KEY = 'mg_onboarding_form';

// ============================================================================
// TYPES
// ============================================================================

interface FormData {
  // Personal
  firstName: string;
  age: string;
  
  // Fitness
  maxRunningDistanceKm: string;
  comfortablePace: string;
  hikesLast3Months: string;
  typicalElevationGainM: string;
  strengthTrainingFrequency: string;
  strengthTrainingTypes: StrengthTrainingType[];
  
  // Availability
  availableDaysPerWeek: string;
  preferredTrainingDays: TrainingDay[];
  sessionDuration: SessionDuration;
  
  // Target Hike
  targetHikeName: string;
  targetHikeLevel: HikeDifficultyLevel;
  targetHikeDistanceKm: string;
  targetHikeElevationM: string;
  targetHikeDate: string;
}

const INITIAL_FORM_DATA: FormData = {
  firstName: '',
  age: '',
  maxRunningDistanceKm: '',
  comfortablePace: '',
  hikesLast3Months: '0',
  typicalElevationGainM: '0',
  strengthTrainingFrequency: '0',
  strengthTrainingTypes: [],
  availableDaysPerWeek: '4',
  preferredTrainingDays: [],
  sessionDuration: 'medium',
  targetHikeName: '',
  targetHikeLevel: '2',
  targetHikeDistanceKm: '',
  targetHikeElevationM: '',
  targetHikeDate: '',
};

const STEPS = [
  { id: 1, title: 'Personal', icon: User },
  { id: 2, title: 'Condición Física', icon: Activity },
  { id: 3, title: 'Disponibilidad', icon: Calendar },
  { id: 4, title: 'Tu Meta', icon: Target },
];

const TRAINING_DAYS: { value: TrainingDay; label: string }[] = [
  { value: 'monday', label: 'Lun' },
  { value: 'tuesday', label: 'Mar' },
  { value: 'wednesday', label: 'Mié' },
  { value: 'thursday', label: 'Jue' },
  { value: 'friday', label: 'Vie' },
  { value: 'saturday', label: 'Sáb' },
  { value: 'sunday', label: 'Dom' },
];

const STRENGTH_TYPES: { value: StrengthTrainingType; label: string }[] = [
  { value: 'legs_core', label: 'Piernas y Core' },
  { value: 'upper_body', label: 'Tren Superior' },
  { value: 'full_body', label: 'Cuerpo Completo' },
  { value: 'none', label: 'Ninguno' },
];

const HIKE_LEVELS: { value: HikeDifficultyLevel; label: string; description: string }[] = [
  { value: '1', label: 'Nivel 1', description: '8-12km, <500m desnivel, 4-5 horas' },
  { value: '2', label: 'Nivel 2', description: '12-18km, 500-1000m desnivel, 5-7 horas' },
  { value: '3', label: 'Nivel 3', description: '18-25km, 1000-1500m desnivel, 7-9 horas' },
  { value: '4', label: 'Nivel 4', description: '25+km, 1500+m desnivel, 9+ horas' },
];

// ============================================================================
// STEP COMPONENTS
// ============================================================================

function StepPersonal({ 
  formData, 
  updateFormData 
}: { 
  formData: FormData; 
  updateFormData: (updates: Partial<FormData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-navy-950 mb-2">
          Información Personal
        </h2>
        <p className="text-gray-600">
          Cuéntanos un poco sobre ti para personalizar tu entrenamiento.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Cómo te llamas? *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
            placeholder="Tu nombre"
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Cuántos años tienes? *
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => updateFormData({ age: e.target.value })}
            placeholder="Edad"
            min="16"
            max="100"
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Tu edad nos ayuda a ajustar las recomendaciones de recuperación.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepFitness({ 
  formData, 
  updateFormData 
}: { 
  formData: FormData; 
  updateFormData: (updates: Partial<FormData>) => void;
}) {
  const toggleStrengthType = (type: StrengthTrainingType) => {
    const current = formData.strengthTrainingTypes;
    if (type === 'none') {
      updateFormData({ strengthTrainingTypes: ['none'] });
    } else {
      const filtered = current.filter(t => t !== 'none');
      if (filtered.includes(type)) {
        updateFormData({ strengthTrainingTypes: filtered.filter(t => t !== type) });
      } else {
        updateFormData({ strengthTrainingTypes: [...filtered, type] });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-navy-950 mb-2">
          Tu Condición Física Actual
        </h2>
        <p className="text-gray-600">
          Esto nos ayuda a diseñar un plan realista y seguro para ti.
        </p>
      </div>

      <div className="space-y-5">
        {/* Running */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máxima distancia corriendo sin parar (km) *
            </label>
            <input
              type="number"
              step="0.5"
              value={formData.maxRunningDistanceKm}
              onChange={(e) => updateFormData({ maxRunningDistanceKm: e.target.value })}
              placeholder="ej. 5"
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ritmo cómodo de carrera (min/km) *
            </label>
            <input
              type="text"
              value={formData.comfortablePace}
              onChange={(e) => updateFormData({ comfortablePace: e.target.value })}
              placeholder="ej. 6:30"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
              required
            />
          </div>
        </div>

        {/* Hiking Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hikes en los últimos 3 meses
            </label>
            <input
              type="number"
              value={formData.hikesLast3Months}
              onChange={(e) => updateFormData({ hikesLast3Months: e.target.value })}
              placeholder="0"
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desnivel típico por hike (metros)
            </label>
            <input
              type="number"
              value={formData.typicalElevationGainM}
              onChange={(e) => updateFormData({ typicalElevationGainM: e.target.value })}
              placeholder="0"
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
            />
          </div>
        </div>

        {/* Strength Training */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frecuencia de entrenamiento de fuerza (días/semana)
          </label>
          <input
            type="number"
            value={formData.strengthTrainingFrequency}
            onChange={(e) => updateFormData({ strengthTrainingFrequency: e.target.value })}
            placeholder="0"
            min="0"
            max="7"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de entrenamiento de fuerza
          </label>
          <div className="flex flex-wrap gap-2">
            {STRENGTH_TYPES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleStrengthType(value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  formData.strengthTrainingTypes.includes(value)
                    ? 'bg-forest-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepAvailability({ 
  formData, 
  updateFormData 
}: { 
  formData: FormData; 
  updateFormData: (updates: Partial<FormData>) => void;
}) {
  const toggleDay = (day: TrainingDay) => {
    const current = formData.preferredTrainingDays;
    if (current.includes(day)) {
      updateFormData({ preferredTrainingDays: current.filter(d => d !== day) });
    } else {
      updateFormData({ preferredTrainingDays: [...current, day] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-navy-950 mb-2">
          Tu Disponibilidad
        </h2>
        <p className="text-gray-600">
          ¿Cuándo puedes entrenar? Diseñaremos tu plan en base a tu agenda.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Días disponibles para entrenar por semana *
          </label>
          <input
            type="number"
            value={formData.availableDaysPerWeek}
            onChange={(e) => updateFormData({ availableDaysPerWeek: e.target.value })}
            min="1"
            max="7"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Recomendamos 3-7 días por semana.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ¿Qué días prefieres entrenar?
          </label>
          <div className="flex flex-wrap gap-2">
            {TRAINING_DAYS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleDay(value)}
                className={cn(
                  'w-12 h-12 rounded-lg text-sm font-medium transition-all',
                  formData.preferredTrainingDays.includes(value)
                    ? 'bg-forest-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tiempo disponible por sesión *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'short' as SessionDuration, label: 'Corto', time: '30-45 min' },
              { value: 'medium' as SessionDuration, label: 'Medio', time: '45-75 min' },
              { value: 'long' as SessionDuration, label: 'Largo', time: '75+ min' },
            ].map(({ value, label, time }) => (
              <button
                key={value}
                type="button"
                onClick={() => updateFormData({ sessionDuration: value })}
                className={cn(
                  'p-4 rounded-xl text-center transition-all border-2',
                  formData.sessionDuration === value
                    ? 'border-forest-900 bg-forest-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
              >
                <span className="block font-semibold text-navy-950">{label}</span>
                <span className="text-xs text-gray-500">{time}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepTargetHike({ 
  formData, 
  updateFormData 
}: { 
  formData: FormData; 
  updateFormData: (updates: Partial<FormData>) => void;
}) {
  // Calculate min date (2 weeks from today)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 14);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-navy-950 mb-2">
          Tu Hike Meta
        </h2>
        <p className="text-gray-600">
          ¿Qué hike quieres conquistar? Te prepararemos para el éxito.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del hike *
          </label>
          <input
            type="text"
            value={formData.targetHikeName}
            onChange={(e) => updateFormData({ targetHikeName: e.target.value })}
            placeholder="ej. Nevado de Toluca, Iztaccíhuatl"
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Nivel de dificultad *
          </label>
          <div className="space-y-2">
            {HIKE_LEVELS.map(({ value, label, description }) => (
              <button
                key={value}
                type="button"
                onClick={() => updateFormData({ targetHikeLevel: value })}
                className={cn(
                  'w-full p-4 rounded-xl text-left transition-all border-2',
                  formData.targetHikeLevel === value
                    ? 'border-forest-900 bg-forest-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
              >
                <span className="block font-semibold text-navy-950">{label}</span>
                <span className="text-sm text-gray-500">{description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distancia del hike (km) *
            </label>
            <input
              type="number"
              step="0.5"
              value={formData.targetHikeDistanceKm}
              onChange={(e) => updateFormData({ targetHikeDistanceKm: e.target.value })}
              placeholder="ej. 15"
              min="1"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desnivel del hike (metros) *
            </label>
            <input
              type="number"
              value={formData.targetHikeElevationM}
              onChange={(e) => updateFormData({ targetHikeElevationM: e.target.value })}
              placeholder="ej. 1200"
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha del hike *
          </label>
          <input
            type="date"
            value={formData.targetHikeDate}
            onChange={(e) => updateFormData({ targetHikeDate: e.target.value })}
            min={minDateStr}
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-navy-950 placeholder:text-gray-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-900/20 transition-all"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Recomendamos al menos 8-12 semanas de preparación.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Load saved form data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error('Error loading saved form data:', e);
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error('Error saving form data:', e);
    }
  }, [formData]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.firstName.trim() !== '' && formData.age !== '' && parseInt(formData.age) >= 16;
      case 2:
        return formData.maxRunningDistanceKm !== '' && formData.comfortablePace !== '';
      case 3:
        return formData.availableDaysPerWeek !== '' && parseInt(formData.availableDaysPerWeek) >= 1;
      case 4:
        return (
          formData.targetHikeName.trim() !== '' &&
          formData.targetHikeDistanceKm !== '' &&
          formData.targetHikeElevationM !== '' &&
          formData.targetHikeDate !== ''
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid(4)) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/fitness-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // If unauthorized, redirect to login
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error(data.error || 'Error al enviar el formulario');
      }

      // Clear saved form data on success
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Error clearing saved form data:', e);
      }

      setSubmitStatus('success');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-forest-100 mb-6">
            <CheckCircle2 className="w-10 h-10 text-forest-600" />
          </div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-navy-950 mb-4">
            ¡Listo!
          </h1>
          <p className="text-gray-600 mb-2">
            Tu información ha sido recibida. Recibirás tu plan de entrenamiento personalizado 
            en tu correo electrónico pronto.
          </p>
          <p className="text-sm text-gray-500">
            Redirigiendo al dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-8">
            <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-lg font-bold uppercase tracking-wider text-white">
              Mountain Goats
            </span>
          </Link>

          <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-2">
            Cuéntanos sobre ti
          </h1>
          <p className="text-white/70">
            Completa este cuestionario para recibir tu plan de entrenamiento personalizado.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                        isCompleted && 'bg-forest-900 text-white',
                        isCurrent && 'bg-navy-950 text-white',
                        !isCompleted && !isCurrent && 'bg-gray-100 text-gray-400'
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        'ml-2 text-sm font-medium hidden sm:block',
                        isCurrent ? 'text-navy-950' : 'text-gray-400'
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        'w-8 sm:w-16 h-0.5 mx-2',
                        currentStep > step.id ? 'bg-forest-900' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error al enviar</p>
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            </div>
          )}

          {currentStep === 1 && <StepPersonal formData={formData} updateFormData={updateFormData} />}
          {currentStep === 2 && <StepFitness formData={formData} updateFormData={updateFormData} />}
          {currentStep === 3 && <StepAvailability formData={formData} updateFormData={updateFormData} />}
          {currentStep === 4 && <StepTargetHike formData={formData} updateFormData={updateFormData} />}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
                currentStep === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-navy-950 hover:bg-gray-50'
              )}
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all',
                  isStepValid(currentStep)
                    ? 'bg-gradient-to-r from-forest-900 to-forest-800 text-white hover:from-forest-800 hover:to-forest-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                )}
              >
                Siguiente
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepValid(4) || isSubmitting}
                className={cn(
                  'flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all',
                  isStepValid(4) && !isSubmitting
                    ? 'bg-gradient-to-r from-forest-900 to-forest-800 text-white hover:from-forest-800 hover:to-forest-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Completar
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Skip option */}
        <div className="text-center mt-6">
          <Link 
            href="/dashboard" 
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Completar después
          </Link>
        </div>
      </div>
    </div>
  );
}

