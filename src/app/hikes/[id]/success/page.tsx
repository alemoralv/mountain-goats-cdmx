import Link from 'next/link';
import { CheckCircle2, Calendar, Mail, Download, ArrowRight, Home } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface SuccessPageProps {
  params: { id: string };
  searchParams: { session_id?: string };
}

export default function BookingSuccessPage({ params, searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-elevation-high p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-forest-100 text-forest-700 mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-navy-950 mb-4">
              ¡Reservación Confirmada!
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 mb-8">
              Tu aventura está por comenzar. Hemos enviado los detalles de tu reservación a tu correo electrónico.
            </p>

            {/* Confirmation Details */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-navy-950 mb-4">Próximos pasos:</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-forest-100 text-forest-700 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-navy-950">Revisa tu correo</p>
                    <p className="text-sm text-gray-500">
                      Recibirás un email con tu código de confirmación y todos los detalles.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-forest-100 text-forest-700 shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-navy-950">Descarga la lista de equipo</p>
                    <p className="text-sm text-gray-500">
                      Te enviaremos la guía completa de lo que necesitas llevar.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-forest-100 text-forest-700 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-navy-950">Marca tu calendario</p>
                    <p className="text-sm text-gray-500">
                      Te contactaremos 48 horas antes con los últimos detalles.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Session ID (for reference) */}
            {sessionId && (
              <p className="text-xs text-gray-400 mb-8">
                Referencia: {sessionId.slice(0, 20)}...
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-forest-900 to-forest-800 text-white font-semibold px-6 py-3 rounded-xl hover:from-forest-800 hover:to-forest-700 transition-all"
              >
                Ver mis reservaciones
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/hikes"
                className="inline-flex items-center gap-2 bg-gray-100 text-navy-950 font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition-all"
              >
                <Home className="w-4 h-4" />
                Explorar más caminatas
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-gray-500 text-sm mt-8">
            ¿Tienes preguntas? Escríbenos a{' '}
            <a 
              href="mailto:hola@mountaingoats.mx" 
              className="text-forest-700 hover:underline"
            >
              hola@mountaingoats.mx
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}

