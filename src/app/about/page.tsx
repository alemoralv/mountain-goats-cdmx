'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Mountain, 
  Users, 
  Target, 
  Heart,
  Instagram,
  Mail
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

// ============================================================================
// TEAM DATA
// ============================================================================
const TEAM_MEMBERS = [
  {
    id: 1,
    nickname: 'Alex',
    fullName: 'Alejandro Morera',
    image: '/images/team/alex.jpg',
    bio: 'Soy Alex, fundador de Mountain Goats. Mi amor por las montañas comenzó en Alemania y me trajo a México para descubrir sus volcanes. Creo firmemente que el conjunto de entrenamientos y cada cumbre conquistada nos transforma. Mi misión es compartir esa transformación con nuestra comunidad.',
    instagram: 'This Goat is off the grid.',
  },
  {
    id: 2,
    nickname: 'Pau',
    fullName: 'Paula Morera',
    image: '/images/team/pau.jpg',
    bio: 'Soy Paula, integrante de Mountain Goats. Me apasiona correr largas distancias, ya que encuentro en el movimiento una forma de conexión conmigo misma y con el entorno. Disfruto estar al aire libre, compartir tiempo de calidad con las personas que quiero y crear recuerdos a partir de buenas conversaciones y momentos simples. Valoro la buena compañía, los ambientes positivos y las experiencias que se viven con autenticidad.',
    instagram: 'This Goat is off the grid.',
  },
  {
    id: 3,
    nickname: 'Daniel',
    fullName: 'Daniel Dumas',
    image: '/images/team/daniel.jpg',
    bio: 'Soy Daniel...',
    instagram: '@daniel.dumas1111111',
  },
  {
    id: 4,
    nickname: 'Fer',
    fullName: 'Fernanda Hernández',
    image: '/images/team/diana.jpg',
    bio: 'Soy Fer...',
    instagram: '@fer111111111111111',
  },
];

// ============================================================================
// TEAM CARD COMPONENT
// ============================================================================
function TeamCard({ member }: { member: typeof TEAM_MEMBERS[0] }) {
  return (
    <div className="flex-shrink-0 w-full md:w-[350px]">
      <div className="bg-white rounded-2xl overflow-hidden shadow-elevation-medium">
        {/* Image */}
        <div className="aspect-[4/5] relative bg-gradient-to-br from-navy-900 to-forest-900">
          {member.image ? (
            <img 
              src={member.image} 
              alt={member.fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          {/* Fallback placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Mountain className="w-20 h-20 text-white/20" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Nickname */}
          <p className="font-display text-2xl font-bold uppercase tracking-[0.2em] text-forest-900 mb-1">
            {member.nickname}
          </p>
          
          {/* Full Name */}
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-navy-950 mb-4">
            {member.fullName}
          </h3>
          
          {/* Bio */}
          <p className="text-gray-600 text-sm leading-relaxed italic">
            {member.bio}
          </p>

          {/* Instagram */}
          {member.instagram && (
            <a 
              href={`https://instagram.com/${member.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-forest-700 hover:text-forest-900 transition-colors text-sm"
            >
              <Instagram className="w-4 h-4" />
              {member.instagram}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % TEAM_MEMBERS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length);
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <p className="text-forest-400 text-sm font-bold uppercase tracking-wider mb-4">
            Conoce al equipo
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white mb-6">
            The Goats
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Somos un equipo de apasionados por la montaña, guías certificados y entrenadores 
            dedicados a crear experiencias transformadoras en las cumbres de México.
          </p>
        </div>
      </section>

      {/* Team Carousel Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-navy-950 mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Guías expertos, entrenadores certificados y apasionados de la montaña listos para acompañarte en cada aventura.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Navigation Arrows */}
            {currentIndex > 0 && (
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-forest-900 text-white flex items-center justify-center shadow-lg hover:bg-forest-800 transition-colors -ml-4 md:ml-0"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            
            {currentIndex < TEAM_MEMBERS.length - 1 && (
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-forest-900 text-white flex items-center justify-center shadow-lg hover:bg-forest-800 transition-colors -mr-4 md:mr-0"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Cards Container */}
            <div className="overflow-hidden mx-8 md:mx-16">
              <div 
                className="flex gap-6 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 24}px))`,
                }}
              >
                {TEAM_MEMBERS.map((member) => (
                  <TeamCard 
                    key={member.id} 
                    member={member} 
                  />
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {TEAM_MEMBERS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all',
                    index === currentIndex 
                      ? 'bg-forest-900 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Mobile: Show all cards stacked */}
          <div className="md:hidden mt-8 space-y-6">
            {TEAM_MEMBERS.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight text-white mb-4">
              Nuestra Misión
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest-900/50 text-forest-400 mb-6">
                <Mountain className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white mb-3">
                Aventura Segura
              </h3>
              <p className="text-white/70 leading-relaxed">
                Cada expedición está diseñada con los más altos estándares de seguridad. 
                Guías certificados, equipo de comunicación y protocolos de emergencia.
              </p>
            </div>

            {/* Value 2 */}
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest-900/50 text-forest-400 mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white mb-3">
                Comunidad
              </h3>
              <p className="text-white/70 leading-relaxed">
                Más que un grupo de senderismo, somos una familia. Conectamos personas 
                que comparten la pasión por la naturaleza y el crecimiento personal.
              </p>
            </div>

            {/* Value 3 */}
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest-900/50 text-forest-400 mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white mb-3">
                Preparación
              </h3>
              <p className="text-white/70 leading-relaxed">
                Nuestro programa de entrenamiento digital te prepara física y mentalmente 
                para que llegues a cada cumbre con confianza y determinación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest-100 text-forest-700 mb-6">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-navy-950 mb-4">
            ¿Listo para unirte?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Forma parte de nuestra comunidad y descubre el montañista que llevas dentro.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/hikes"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-forest-900 to-forest-800 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-xl hover:from-forest-800 hover:to-forest-700 transition-all shadow-lg"
            >
              Ver Próximas Caminatas
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a
              href="mailto:mountaingoatscdmx@gmail.com"
              className="inline-flex items-center gap-2 bg-navy-950 text-white font-semibold uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-navy-900 transition-all"
            >
              <Mail className="w-5 h-5" />
              Contáctanos
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

