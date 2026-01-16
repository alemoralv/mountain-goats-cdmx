'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { deleteAccount, type DeleteAccountState } from '@/app/profile/actions';

export function DeleteAccountSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmation !== 'ELIMINAR MI CUENTA') {
      setError('Por favor escribe "ELIMINAR MI CUENTA" para confirmar.');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('confirmation', confirmation);
      
      const result = await deleteAccount({ error: null, success: false }, formData);
      
      if (result.error) {
        setError(result.error);
        setIsDeleting(false);
      }
      // If successful, the action redirects to home
    } catch (e) {
      setError('Error inesperado. Por favor intenta de nuevo.');
      setIsDeleting(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-elevation-low overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-100 text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-red-700">
              Zona de Peligro
            </h2>
            <p className="text-sm text-gray-500">
              Eliminar cuenta permanentemente
            </p>
          </div>
        </div>
        <ChevronRight className={cn(
          'w-5 h-5 text-gray-400 transition-transform',
          isExpanded && 'rotate-90'
        )} />
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-red-800 mb-1">
                  ¡Atención! Esta acción es irreversible.
                </p>
                <p className="text-red-700">
                  Al eliminar tu cuenta se borrarán permanentemente:
                </p>
                <ul className="list-disc list-inside text-red-600 mt-2 space-y-1">
                  <li>Tu perfil y datos personales</li>
                  <li>Historial de hikes y reservaciones</li>
                  <li>Archivos de entrenamiento</li>
                  <li>Evaluación de condición física</li>
                  <li>Todos los datos asociados a tu cuenta</li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Para confirmar, escribe <span className="font-mono font-bold text-red-600">ELIMINAR MI CUENTA</span>
              </label>
              <input
                type="text"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="ELIMINAR MI CUENTA"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                disabled={isDeleting}
              />
            </div>

            <button
              onClick={handleDelete}
              disabled={isDeleting || confirmation !== 'ELIMINAR MI CUENTA'}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all',
                confirmation === 'ELIMINAR MI CUENTA' && !isDeleting
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Eliminando cuenta...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Eliminar mi cuenta permanentemente
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

