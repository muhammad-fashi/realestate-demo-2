import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-2xl border transition-all duration-300 transform translate-y-0 ${
            toast.type === 'error'
              ? 'bg-[#1C1C1C] border-red-500/30 text-red-100'
              : toast.type === 'info'
              ? 'bg-[#1C1C1C] border-[#B8955A]/40 text-[#F7F5F0]'
              : 'bg-[#1C1C1C] border-emerald-500/30 text-emerald-100'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 text-[#B8955A] shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-sm font-medium leading-relaxed">
            {toast.message}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#6B6B6B] hover:text-[#F7F5F0] transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
