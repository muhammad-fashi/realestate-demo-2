import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, ArrowRight, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center pt-28 pb-20 px-4 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-[#161616] border border-[#B8955A]/50 flex items-center justify-center text-[#B8955A] shadow-2xl">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <span className="text-xs uppercase tracking-[0.3em] text-[#B8955A] font-semibold">
        Error 404 · Uncharted Address
      </span>

      <h1 className="font-serif text-4xl sm:text-6xl text-[#F7F5F0]">Residence Not Located</h1>

      <p className="text-sm text-[#8E8E8E] max-w-md mx-auto leading-relaxed">
        The architectural property or page you are requesting has moved, been acquired off-market, or
        the link has expired.
      </p>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home</span>
        </button>
        <button
          onClick={() => navigate('/properties')}
          className="px-6 py-3 bg-[#1C1C1C] border border-[#333] text-[#F7F5F0] hover:border-[#B8955A] text-xs font-bold uppercase tracking-widest rounded-sm transition-all flex items-center gap-2"
        >
          <span>Explore Properties</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
