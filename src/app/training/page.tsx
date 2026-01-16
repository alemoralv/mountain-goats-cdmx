'use client';

import Link from 'next/link';
import { 
  Dumbbell,
  Video,
  FileText,
  Calendar,
  Clock,
  ChevronRight,
  CheckCircle2,
  Mountain,
  TrendingUp,
  Heart,
  Brain,
  Wind,
  Footprints,
  Target,
  Sparkles,
  Play,
  Download,
  Users,
  Award,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

// ============================================================================
// TRAINING PROGRAM DATA
// ============================================================================
const TRAINING_PILLARS = [
  {
    icon: Heart,
    title: 'Cardio & Resistencia',
    description: 'Ejercicios progresivos para aumentar tu capacidad cardiovascular y resistencia en altitud.',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    icon: Dumbbell,
    title: 'Fuerza Funcional',
    description: 'Fortalecimiento de piernas, core y espalda para cargar mochila y mantener estabilidad.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Wind,
    title: 'Respiración & Altitud',
    description: 'Técnicas de respiración para optimizar oxigenación en altitudes superiores a 4,000m.',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50',
  },
  {
    icon: Brain,
    title: 'Preparación Mental',
    description: 'Estrategias mentales para superar momentos difíciles y disfrutar cada paso del camino.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
];

const TRAINING_LEVELS = [
  {
    level: 'Básico',
    duration: '1-2 semanas',
    description: 'Para hikes de dificultad 1-3',
    hikes: ['Desierto de los Leones', 'El Tepozteco', 'Mirador de Coconetla'],
    color: 'bg-emerald-500',
    features: [
      'Cardio básico (caminata, trote suave)',
      'Fortalecimiento de piernas',
      'Técnica básica de caminata',
      'Preparación de equipo esencial',
    ],
  },
  {
    level: 'Moderado',
    duration: '2-3 semanas',
    description: 'Para hikes de dificultad 4-5',
    hikes: ['Pico del Águila', 'Cerro Tláloc', 'Peña de Bernal'],
    color: 'bg-amber-500',
    features: [
      'Cardio intervalado',
      'Sentadillas y lunges con peso',
      'Técnica de uso de bastones',
      'Nutrición e hidratación en ruta',
    ],
  },
  {
    level: 'Avanzado',
    duration: '4-6 semanas',
    description: 'Para hikes de dificultad 6-10',
    hikes: ['Nevado de Toluca', 'La Malinche', 'Iztaccíhuatl'],
    color: 'bg-red-500',
    features: [
      'Entrenamiento de altitud simulado',
      'Ejercicios con mochila cargada',
      'Técnicas de crampones y piolet',
      'Protocolos de mal de altura',
    ],
  },
];

const CONTENT_TYPES = [
  {
    icon: Video,
    title: 'Videos HD',
    description: 'Tutoriales paso a paso de técnica, ejercicios y preparación de equipo.',
    count: '20+',
  },
  {
    icon: FileText,
    title: 'Guías PDF',
    description: 'Documentos descargables con planes de entrenamiento y checklists.',
    count: '10+',
  },
  {
    icon: Calendar,
    title: 'Plan Semanal',
    description: 'Calendario estructurado con rutinas diarias personalizadas.',
    count: '6 semanas',
  },
  {
    icon: Target,
    title: 'Seguimiento',
    description: 'Métricas y objetivos para medir tu progreso antes del hike.',
    count: 'Ilimitado',
  },
];

const TESTIMONIALS = [
  {
    quote: 'El pre-training marcó la diferencia. Llegué al Nevado sintiéndome preparado y lo disfruté al máximo.',
    author: 'Roberto M.',
    hike: 'Nevado de Toluca',
  },
  {
    quote: 'Los videos de técnica de respiración me salvaron en La Malinche. Vale cada peso invertido.',
    author: 'Fernanda L.',
    hike: 'La Malinche',
  },
  {
    quote: 'Nunca había hecho senderismo y el programa de 2 semanas me preparó perfectamente para mi primer hike.',
    author: 'David S.',
    hike: 'Mirador de Coconetla',
  },
];

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function TrainingPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-forest-400" />
            <span className="text-white/90 text-sm font-medium">El secreto de los Goats</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white mb-6">
            Pre-Training
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Preparación física y mental personalizada para que llegues a cada cumbre 
            con confianza, fuerza y las técnicas necesarias para disfrutar la aventura.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/hikes"
              className="inline-flex items-center gap-2 bg-white text-navy-950 font-bold uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-white/90 transition-all"
            >
              Ver Hikes con Training
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/30 font-bold uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-white/20 transition-all"
            >
              Ver Paquetes
            </Link>
          </div>
        </div>
      </section>

      {/* What is Pre-Training Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <span className="text-forest-700 text-sm font-bold uppercase tracking-wider mb-4 block">
                ¿Qué es el Pre-Training?
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-navy-950 mb-6">
                La diferencia entre sobrevivir y disfrutar
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                El Pre-Training es nuestro programa de preparación digital diseñado específicamente 
                para cada expedición. No es un entrenamiento genérico — está adaptado a la altitud, 
                distancia, desnivel y desafíos específicos de cada ruta.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Con acceso de por vida al contenido, podrás prepararte para tu hike actual y 
                reutilizar el material para futuras aventuras. Es la inversión que transforma 
                tu experiencia en la montaña.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-forest-50 rounded-xl">
                  <span className="font-display text-3xl font-bold text-forest-900 block">95%</span>
                  <span className="text-sm text-gray-600">Llegan a cumbre</span>
                </div>
                <div className="text-center p-4 bg-forest-50 rounded-xl">
                  <span className="font-display text-3xl font-bold text-forest-900 block">4.9★</span>
                  <span className="text-sm text-gray-600">Satisfacción</span>
                </div>
                <div className="text-center p-4 bg-forest-50 rounded-xl">
                  <span className="font-display text-3xl font-bold text-forest-900 block">∞</span>
                  <span className="text-sm text-gray-600">Acceso de por vida</span>
                </div>
              </div>
            </div>

            {/* Visual Card */}
            <div className="bg-gradient-to-br from-navy-900 to-forest-900 rounded-2xl p-8 lg:p-10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-white/10">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight">
                  Contenido Incluido
                </h3>
              </div>

              <div className="space-y-4">
                {CONTENT_TYPES.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                      <div className="p-2 rounded-lg bg-white/10">
                        <Icon className="w-5 h-5 text-forest-400" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">{item.title}</span>
                          <span className="text-forest-400 text-sm font-bold">{item.count}</span>
                        </div>
                        <p className="text-white/70 text-sm">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-20 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-4">
              Los 4 Pilares del Entrenamiento
            </h2>
            <p className="text-white/70 max-w-xl mx-auto">
              Nuestro programa integral cubre todos los aspectos necesarios para 
              una experiencia exitosa en la montaña.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRAINING_PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className={cn('inline-flex p-3 rounded-xl mb-4', pillar.bgColor)}>
                    <Icon className={cn('w-6 h-6', pillar.color)} />
                  </div>
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Training Levels Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-navy-950 mb-4">
              Niveles de Entrenamiento
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Cada programa está diseñado según la dificultad de tu hike objetivo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {TRAINING_LEVELS.map((level, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-elevation-high transition-all">
                {/* Header */}
                <div className={cn('p-6 text-white', level.color)}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight">
                      {level.level}
                    </h3>
                    <span className="text-white/80 text-sm">{level.duration}</span>
                  </div>
                  <p className="text-white/80 text-sm">{level.description}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Hikes */}
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 block">
                      Hikes recomendados
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {level.hikes.map((hike, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {hike}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 block">
                      Incluye
                    </span>
                    <ul className="space-y-2">
                      {level.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-navy-950 mb-4">
              ¿Cómo Funciona?
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                step: 1,
                title: 'Reserva tu Hike con Pre-Training',
                description: 'Al reservar, selecciona el paquete Bundle o añade el Pre-Training a tu hike. Recibirás acceso inmediato al contenido.',
              },
              {
                step: 2,
                title: 'Accede a tu Portal de Entrenamiento',
                description: 'Inicia sesión en tu perfil y encuentra todos los videos, guías y planes organizados por semanas.',
              },
              {
                step: 3,
                title: 'Sigue el Plan Personalizado',
                description: 'Cada día tiene rutinas específicas. Los videos te guían en técnica correcta y los PDFs son tu referencia offline.',
              },
              {
                step: 4,
                title: 'Llega Preparado a tu Aventura',
                description: 'El día del hike, tu cuerpo y mente estarán listos. Disfruta la experiencia con confianza total.',
              },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-6 bg-white rounded-xl p-6 border border-gray-200">
                <div className="shrink-0 w-12 h-12 rounded-full bg-forest-900 text-white flex items-center justify-center font-display text-xl font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-tight text-navy-950 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-navy-950 mb-4">
              Lo que Dicen Nuestros Goats
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center">
                    <span className="text-forest-700 font-bold text-sm">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-navy-950 block text-sm">
                      {testimonial.author}
                    </span>
                    <span className="text-xs text-gray-500">{testimonial.hike}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="py-20 bg-gradient-to-br from-forest-900 to-navy-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Ahorra con el Bundle</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-6">
            Obtén el Pre-Training
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Training Only */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold uppercase text-white mb-2">
                Pre-Training Solo
              </h3>
              <p className="text-4xl font-display font-bold text-white mb-2">
                Desde $250
              </p>
              <p className="text-white/60 text-sm mb-4">Por hike</p>
              <p className="text-white/80 text-sm">
                Ideal si ya tienes experiencia pero quieres prepararte para una ruta específica.
              </p>
            </div>

            {/* Bundle */}
            <div className="bg-white rounded-2xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-forest-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                Recomendado
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-navy-950 mb-2">
                Bundle Completo
              </h3>
              <p className="text-4xl font-display font-bold text-navy-950 mb-2">
                Desde $750
              </p>
              <p className="text-gray-500 text-sm mb-4">Hike + Pre-Training</p>
              <p className="text-gray-600 text-sm">
                Ahorra 15-20% y obtén la experiencia completa con preparación incluida.
              </p>
            </div>
          </div>

          <Link
            href="/hikes"
            className="inline-flex items-center gap-2 bg-white text-navy-950 font-bold uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-white/90 transition-all"
          >
            Explorar Hikes
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-navy-950 mb-4">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: '¿Necesito experiencia previa para el Pre-Training?',
                answer: 'No, el programa está diseñado para todos los niveles. Empezamos desde lo básico y progresamos según tu capacidad.',
              },
              {
                question: '¿Cuánto tiempo antes del hike debo empezar?',
                answer: 'Depende de la dificultad: 1-2 semanas para hikes básicos, 2-3 para moderados, y 4-6 semanas para avanzados.',
              },
              {
                question: '¿El contenido expira después del hike?',
                answer: 'No, tienes acceso de por vida. Puedes reutilizarlo para futuros hikes o compartir con amigos que te acompañen.',
              },
              {
                question: '¿Puedo comprarlo sin reservar un hike?',
                answer: 'Sí, puedes comprar el Pre-Training por separado desde la página de cada hike.',
              },
              {
                question: '¿Qué equipo necesito para entrenar?',
                answer: 'Principalmente tu cuerpo y ganas. Algunas rutinas usan mochila con peso, pero damos alternativas si no tienes equipo.',
              },
            ].map((faq, index) => (
              <details 
                key={index} 
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-navy-950 hover:bg-gray-50 transition-colors">
                  {faq.question}
                  <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

