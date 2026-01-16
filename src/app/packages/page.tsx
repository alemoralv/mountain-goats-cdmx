'use client';

import Link from 'next/link';
import { 
  Mountain, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  Dumbbell,
  Video,
  FileText,
  Users,
  Calendar,
  Shield,
  Clock,
  Award,
  Zap,
  Star,
  Gift,
  Headphones
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

// ============================================================================
// PACKAGE DATA
// ============================================================================
const PACKAGES = [
  {
    id: 'hike-only',
    name: 'Hike Only',
    tagline: 'La experiencia pura',
    description: 'Únete a nuestras expediciones guiadas con todo lo esencial para una aventura segura e inolvidable.',
    price: 'Desde $550',
    priceNote: 'Varía según la ruta',
    color: 'forest',
    icon: Mountain,
    popular: false,
    features: [
      { text: 'Guía certificado en alta montaña', included: true },
      { text: 'Transporte desde punto de encuentro', included: true },
      { text: 'Seguro de accidentes', included: true },
      { text: 'Snacks energéticos durante la ruta', included: true },
      { text: 'Fotos profesionales del grupo', included: true },
      { text: 'Equipo de comunicación satelital', included: true },
      { text: 'Primeros auxilios', included: true },
      { text: 'Pre-training digital', included: false },
      { text: 'Plan de entrenamiento personalizado', included: false },
      { text: 'Videos de técnica', included: false },
    ],
    cta: 'Ver Hikes Disponibles',
    ctaLink: '/hikes',
  },
  {
    id: 'training',
    name: 'Pre-Training',
    tagline: 'Prepárate para la cumbre',
    description: 'Contenido digital exclusivo para prepararte física y técnicamente antes de tu hike.',
    price: 'Desde $250',
    priceNote: 'Según dificultad del hike',
    color: 'navy',
    icon: Dumbbell,
    popular: false,
    features: [
      { text: 'Plan de entrenamiento de 2-6 semanas', included: true },
      { text: 'Videos de técnica paso a paso', included: true },
      { text: 'Guía completa de equipo recomendado', included: true },
      { text: 'Tips de nutrición e hidratación', included: true },
      { text: 'Ejercicios de aclimatación', included: true },
      { text: 'Acceso de por vida al contenido', included: true },
      { text: 'Seguimiento de progreso', included: true },
      { text: 'Guía en el hike', included: false },
      { text: 'Transporte', included: false },
      { text: 'Seguro de accidentes', included: false },
    ],
    cta: 'Ver Planes de Training',
    ctaLink: '/hikes',
  },
  {
    id: 'bundle',
    name: 'Bundle Completo',
    tagline: 'La experiencia definitiva',
    description: 'Hike + Pre-Training con descuento especial. La preparación perfecta para conquistar cualquier cumbre.',
    price: 'Desde $750',
    priceNote: 'Ahorra hasta 20%',
    color: 'gradient',
    icon: Sparkles,
    popular: true,
    features: [
      { text: 'Todo lo incluido en Hike Only', included: true, highlight: true },
      { text: 'Todo lo incluido en Pre-Training', included: true, highlight: true },
      { text: 'Descuento del 15-20%', included: true },
      { text: 'Prioridad en reservaciones', included: true },
      { text: 'Acceso anticipado a nuevas rutas', included: true },
      { text: 'Comunidad exclusiva de WhatsApp', included: true },
      { text: 'Asesoría personalizada pre-hike', included: true },
      { text: 'Badge digital de cumbre', included: true },
      { text: 'Descuento en próximo hike', included: true },
      { text: 'Contenido exclusivo post-hike', included: true },
    ],
    cta: 'Reservar Bundle',
    ctaLink: '/hikes',
  },
];

// ============================================================================
// MEMBERSHIP DATA  
// ============================================================================
const MEMBERSHIP = {
  name: 'Goat Season Pass',
  tagline: 'Para los verdaderos montañistas',
  description: 'Acceso ilimitado a todos los hikes y trainings durante una temporada completa. Ideal para quienes quieren conquistar múltiples cumbres.',
  price: '$4,999',
  priceNote: 'por temporada (6 meses)',
  benefits: [
    { icon: Calendar, text: 'Acceso a todos los hikes de la temporada' },
    { icon: Dumbbell, text: 'Todos los Pre-Trainings incluidos' },
    { icon: Users, text: 'Eventos exclusivos para miembros' },
    { icon: Gift, text: 'Kit de bienvenida Mountain Goats' },
    { icon: Star, text: 'Prioridad en rutas con cupo limitado' },
    { icon: Headphones, text: 'Línea directa de soporte' },
  ],
};

// ============================================================================
// COMPARISON DATA
// ============================================================================
const COMPARISON_FEATURES = [
  { name: 'Guía certificado', hikeOnly: true, training: false, bundle: true },
  { name: 'Transporte incluido', hikeOnly: true, training: false, bundle: true },
  { name: 'Seguro de accidentes', hikeOnly: true, training: false, bundle: true },
  { name: 'Snacks energéticos', hikeOnly: true, training: false, bundle: true },
  { name: 'Fotos profesionales', hikeOnly: true, training: false, bundle: true },
  { name: 'Plan de entrenamiento', hikeOnly: false, training: true, bundle: true },
  { name: 'Videos de técnica', hikeOnly: false, training: true, bundle: true },
  { name: 'Guía de equipo', hikeOnly: false, training: true, bundle: true },
  { name: 'Acceso de por vida', hikeOnly: false, training: true, bundle: true },
  { name: 'Descuento especial', hikeOnly: false, training: false, bundle: true },
  { name: 'Comunidad exclusiva', hikeOnly: false, training: false, bundle: true },
  { name: 'Badge digital', hikeOnly: false, training: false, bundle: true },
];

// ============================================================================
// PACKAGE CARD COMPONENT
// ============================================================================
function PackageCard({ pkg }: { pkg: typeof PACKAGES[0] }) {
  const Icon = pkg.icon;
  
  const colorClasses = {
    forest: {
      bg: 'bg-forest-50',
      border: 'border-forest-200',
      icon: 'bg-forest-100 text-forest-700',
      badge: 'bg-forest-500',
      button: 'bg-forest-900 hover:bg-forest-800',
      check: 'text-forest-600',
    },
    navy: {
      bg: 'bg-navy-50',
      border: 'border-navy-200',
      icon: 'bg-navy-100 text-navy-700',
      badge: 'bg-navy-500',
      button: 'bg-navy-900 hover:bg-navy-800',
      check: 'text-navy-600',
    },
    gradient: {
      bg: 'bg-gradient-to-br from-forest-50 to-navy-50',
      border: 'border-forest-300',
      icon: 'bg-gradient-to-br from-forest-500 to-navy-600 text-white',
      badge: 'bg-gradient-to-r from-forest-500 to-navy-600',
      button: 'bg-gradient-to-r from-forest-900 to-navy-900 hover:from-forest-800 hover:to-navy-800',
      check: 'text-forest-600',
    },
  };
  
  const colors = colorClasses[pkg.color as keyof typeof colorClasses];

  return (
    <div className={cn(
      'relative rounded-2xl border-2 p-6 lg:p-8 transition-all hover:shadow-elevation-high',
      colors.bg,
      colors.border,
      pkg.popular && 'ring-2 ring-forest-500 ring-offset-2'
    )}>
      {/* Popular Badge */}
      {pkg.popular && (
        <div className={cn(
          'absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-bold uppercase tracking-wider',
          colors.badge
        )}>
          Más Popular
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className={cn(
          'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4',
          colors.icon
        )}>
          <Icon className="w-8 h-8" />
        </div>
        
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-navy-950 mb-1">
          {pkg.name}
        </h3>
        <p className="text-sm text-gray-500 uppercase tracking-wider">
          {pkg.tagline}
        </p>
      </div>

      {/* Price */}
      <div className="text-center mb-6 pb-6 border-b border-gray-200">
        <span className="font-display text-4xl font-bold text-navy-950">
          {pkg.price}
        </span>
        <span className="block text-sm text-gray-500 mt-1">
          {pkg.priceNote}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-center mb-6 leading-relaxed">
        {pkg.description}
      </p>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {pkg.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included ? (
              <CheckCircle2 className={cn('w-5 h-5 shrink-0 mt-0.5', colors.check)} />
            ) : (
              <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-gray-300" />
            )}
            <span className={cn(
              'text-sm',
              feature.included ? 'text-gray-700' : 'text-gray-400',
              (feature as any).highlight && 'font-semibold'
            )}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={pkg.ctaLink}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-wider text-white transition-all',
          colors.button
        )}
      >
        {pkg.cta}
        <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function PackagesPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <p className="text-forest-400 text-sm font-bold uppercase tracking-wider mb-4">
            Elige tu aventura
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white mb-6">
            Paquetes
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Desde expediciones guiadas hasta programas de entrenamiento completos. 
            Encuentra la opción perfecta para tu nivel y objetivos.
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-navy-950 mb-4">
              Nuestros Paquetes
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Cada paquete está diseñado para ayudarte a conquistar tus metas en la montaña.
            </p>
          </div>

          {/* Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PACKAGES.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-4">
              ¿Qué incluye cada paquete?
            </h2>
            <p className="text-white/70 max-w-xl mx-auto">
              Comparación detallada de todos los beneficios incluidos.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-elevation-high">
            {/* Header */}
            <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
              <div className="p-4 font-semibold text-navy-950">Característica</div>
              <div className="p-4 text-center">
                <div className="font-display font-bold uppercase tracking-tight text-forest-700">Hike Only</div>
              </div>
              <div className="p-4 text-center">
                <div className="font-display font-bold uppercase tracking-tight text-navy-700">Pre-Training</div>
              </div>
              <div className="p-4 text-center bg-forest-50">
                <div className="font-display font-bold uppercase tracking-tight text-forest-900">Bundle</div>
              </div>
            </div>

            {/* Rows */}
            {COMPARISON_FEATURES.map((feature, index) => (
              <div 
                key={feature.name} 
                className={cn(
                  'grid grid-cols-4 border-b border-gray-100',
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                )}
              >
                <div className="p-4 text-sm text-gray-700">{feature.name}</div>
                <div className="p-4 flex justify-center">
                  {feature.hikeOnly ? (
                    <CheckCircle2 className="w-5 h-5 text-forest-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div className="p-4 flex justify-center">
                  {feature.training ? (
                    <CheckCircle2 className="w-5 h-5 text-navy-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div className="p-4 flex justify-center bg-forest-50/30">
                  {feature.bundle ? (
                    <CheckCircle2 className="w-5 h-5 text-forest-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Training Details Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <span className="text-forest-700 text-sm font-bold uppercase tracking-wider mb-4 block">
                El secreto de los Goats
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-navy-950 mb-6">
                ¿Qué es el Pre-Training?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Nuestro programa de Pre-Training es contenido digital exclusivo diseñado para 
                prepararte física y técnicamente antes de cada expedición. Es la diferencia 
                entre sobrevivir el hike y disfrutarlo al máximo.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Cada Pre-Training está personalizado según la dificultad y características 
                específicas del hike, asegurando que llegues preparado para cualquier desafío.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-forest-50 rounded-xl">
                  <Video className="w-6 h-6 text-forest-700" />
                  <span className="text-sm font-medium text-navy-950">Videos HD</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-forest-50 rounded-xl">
                  <FileText className="w-6 h-6 text-forest-700" />
                  <span className="text-sm font-medium text-navy-950">Guías PDF</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-forest-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-forest-700" />
                  <span className="text-sm font-medium text-navy-950">Plan semanal</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-forest-50 rounded-xl">
                  <Clock className="w-6 h-6 text-forest-700" />
                  <span className="text-sm font-medium text-navy-950">Acceso ilimitado</span>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="bg-gradient-to-br from-forest-900 to-navy-900 rounded-2xl p-8 lg:p-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Semanas 1-2</h4>
                    <p className="text-white/70 text-sm">Cardio base y fortalecimiento</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Semanas 3-4</h4>
                    <p className="text-white/70 text-sm">Técnica de ascenso y respiración</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Semana final</h4>
                    <p className="text-white/70 text-sm">Preparación mental y logística</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Season Pass Section */}
      <section className="py-20 bg-gradient-to-br from-navy-900 to-forest-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              {/* Content */}
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-yellow-400 text-navy-950">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-yellow-400 text-sm font-bold uppercase tracking-wider">
                    Para los más aventureros
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-4">
                  {MEMBERSHIP.name}
                </h2>
                <p className="text-white/80 leading-relaxed mb-6">
                  {MEMBERSHIP.description}
                </p>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MEMBERSHIP.benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-forest-400" />
                        <span className="text-white/90 text-sm">{benefit.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="lg:text-center lg:min-w-[200px]">
                <span className="font-display text-5xl font-bold text-white block">
                  {MEMBERSHIP.price}
                </span>
                <span className="text-white/60 text-sm block mb-6">
                  {MEMBERSHIP.priceNote}
                </span>
                <a
                  href="mailto:mountaingoatscdmx@gmail.com?subject=Goat Season Pass"
                  className="inline-flex items-center gap-2 bg-white text-navy-950 font-bold uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-white/90 transition-all"
                >
                  Contactar
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
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
                question: '¿Puedo comprar solo el Pre-Training sin el hike?',
                answer: 'Sí, el Pre-Training está disponible de forma independiente. Es ideal si ya tienes experiencia pero quieres prepararte mejor para una ruta específica.',
              },
              {
                question: '¿El contenido del Pre-Training expira?',
                answer: 'No, una vez que compras un Pre-Training tienes acceso de por vida al contenido. Puedes revisarlo las veces que quieras.',
              },
              {
                question: '¿Cuánto tiempo antes del hike debo empezar el Pre-Training?',
                answer: 'Recomendamos comenzar 2-6 semanas antes dependiendo del nivel de dificultad. Cada Pre-Training incluye una guía de tiempos recomendados.',
              },
              {
                question: '¿Qué pasa si no puedo asistir al hike después de comprar?',
                answer: 'Ofrecemos reprogramación gratuita con al menos 7 días de anticipación. Consulta nuestra política de reembolsos para más detalles.',
              },
              {
                question: '¿El Season Pass incluye hikes de cualquier dificultad?',
                answer: 'Sí, el Season Pass incluye acceso a todos los hikes programados durante la temporada, sin importar su nivel de dificultad.',
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

      {/* CTA Section */}
      <section className="py-16 bg-forest-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Explora nuestros hikes disponibles y elige el paquete que mejor se adapte a tus metas.
          </p>
          <Link
            href="/hikes"
            className="inline-flex items-center gap-2 bg-white text-forest-900 font-bold uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-white/90 transition-all"
          >
            Ver Hikes Disponibles
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

