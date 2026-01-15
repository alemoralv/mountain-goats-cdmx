'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Users, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  Shield,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import type { PackageType } from '@/types/database';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface BookingCardProps {
  hike: {
    id: string;
    title: string;
    slug?: string;
    price_hike_only: number;
    price_training_only: number;
    price_bundle: number;
    max_participants: number;
    current_participants: number;
    date: string;
  };
  userId?: string;
}

export function BookingCard({ hike, userId }: BookingCardProps) {
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('hike');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const spotsRemaining = hike.max_participants - hike.current_participants;
  const bundleSavings = (hike.price_hike_only + hike.price_training_only) - hike.price_bundle;
  const isSoldOut = spotsRemaining <= 0;
  const isPastDate = new Date(hike.date) < new Date();

  // Handle checkout
  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call our checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hikeId: hike.id,
          packageType: selectedPackage,
          userId: userId || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        // Option 1: Direct redirect (simpler)
        window.location.href = data.url;
      } else if (data.sessionId) {
        // Option 2: Use Stripe.js redirect (better UX)
        const stripe = await stripePromise;
        if (stripe) {
          const { error: stripeError } = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });
          if (stripeError) {
            throw new Error(stripeError.message);
          }
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  // Get current price based on selection
  const getCurrentPrice = () => {
    switch (selectedPackage) {
      case 'hike':
        return hike.price_hike_only;
      case 'training':
        return hike.price_training_only;
      case 'bundle':
        return hike.price_bundle;
    }
  };

  // Check if package requires spots (hike and bundle do, training doesn't)
  const requiresSpots = selectedPackage !== 'training';
  const canBook = !isLoading && (!requiresSpots || (!isSoldOut && !isPastDate));

  return (
    <div className="bg-white rounded-2xl shadow-elevation-medium border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-950 to-navy-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm uppercase tracking-wider">
            Reserva tu lugar
          </span>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-white/60" />
            <span className={cn(
              'text-sm font-medium',
              spotsRemaining <= 3 ? 'text-orange-300' : 'text-white/80'
            )}>
              {isSoldOut ? 'Agotado' : `${spotsRemaining} lugares`}
            </span>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="p-6 space-y-4">
        {/* Hike Only */}
        <label className={cn(
          'block cursor-pointer',
          (isSoldOut || isPastDate) && 'opacity-50 cursor-not-allowed'
        )}>
          <input 
            type="radio" 
            name="package" 
            value="hike" 
            className="peer sr-only" 
            checked={selectedPackage === 'hike'}
            onChange={() => setSelectedPackage('hike')}
            disabled={isSoldOut || isPastDate}
          />
          <div className="p-4 rounded-xl border-2 border-gray-200 peer-checked:border-forest-900 peer-checked:bg-forest-50/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-navy-950">Solo Caminata</span>
                <p className="text-sm text-gray-500 mt-1">
                  Incluye transporte, guía y snacks
                </p>
              </div>
              <span className="font-display text-2xl font-bold text-navy-950">
                {formatPrice(hike.price_hike_only)}
              </span>
            </div>
          </div>
        </label>

        {/* Training Only */}
        <label className="block cursor-pointer">
          <input 
            type="radio" 
            name="package" 
            value="training" 
            className="peer sr-only" 
            checked={selectedPackage === 'training'}
            onChange={() => setSelectedPackage('training')}
          />
          <div className="p-4 rounded-xl border-2 border-gray-200 peer-checked:border-forest-900 peer-checked:bg-forest-50/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-navy-950">Solo Entrenamiento</span>
                <p className="text-sm text-gray-500 mt-1">
                  Videos, plan de 4 semanas, guía de equipo
                </p>
              </div>
              <span className="font-display text-2xl font-bold text-navy-950">
                {formatPrice(hike.price_training_only)}
              </span>
            </div>
          </div>
        </label>

        {/* Bundle */}
        <label className={cn(
          'block cursor-pointer relative',
          (isSoldOut || isPastDate) && 'opacity-50 cursor-not-allowed'
        )}>
          <input 
            type="radio" 
            name="package" 
            value="bundle" 
            className="peer sr-only" 
            checked={selectedPackage === 'bundle'}
            onChange={() => setSelectedPackage('bundle')}
            disabled={isSoldOut || isPastDate}
          />
          <div className="absolute -top-2 -right-2 bg-forest-900 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            Ahorra {formatPrice(bundleSavings)}
          </div>
          <div className="p-4 rounded-xl border-2 border-gray-200 peer-checked:border-forest-900 peer-checked:bg-forest-50/50 transition-all ring-2 ring-forest-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-navy-950">Paquete Completo</span>
                  <Sparkles className="w-4 h-4 text-forest-600" />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Caminata + Entrenamiento digital
                </p>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl font-bold text-navy-950">
                  {formatPrice(hike.price_bundle)}
                </span>
                <p className="text-xs text-gray-400 line-through">
                  {formatPrice(hike.price_hike_only + hike.price_training_only)}
                </p>
              </div>
            </div>
          </div>
        </label>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Sold Out / Past Date Messages */}
        {isSoldOut && selectedPackage !== 'training' && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-700">
              Esta caminata está agotada. Puedes adquirir solo el entrenamiento.
            </p>
          </div>
        )}

        {isPastDate && selectedPackage !== 'training' && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              Esta caminata ya ocurrió. Puedes adquirir el contenido de entrenamiento.
            </p>
          </div>
        )}

        {/* CTA Button */}
        <button 
          onClick={handleCheckout}
          disabled={!canBook}
          className={cn(
            'w-full mt-6 font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2',
            canBook
              ? 'bg-gradient-to-r from-forest-900 to-forest-800 hover:from-forest-800 hover:to-forest-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              Reservar Ahora - {formatPrice(getCurrentPrice())}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Shield className="w-4 h-4 text-forest-700" />
            Pago seguro
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <CheckCircle2 className="w-4 h-4 text-forest-700" />
            Cancelación flexible
          </div>
        </div>

        {/* Stripe Badge */}
        <div className="flex items-center justify-center pt-2">
          <span className="text-xs text-gray-400">
            Pagos procesados por Stripe
          </span>
        </div>
      </div>
    </div>
  );
}

export default BookingCard;

