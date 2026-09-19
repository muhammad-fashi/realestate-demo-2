import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { favorites, navigate } = useApp();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavs = async () => {
      setLoading(true);
      try {
        if (favorites.length === 0) {
          setProperties([]);
          setLoading(false);
          return;
        }

        const res = await api.getProperties({ limit: 100 });
        const matched = res.properties.filter((p) => favorites.includes(p.id));
        setProperties(matched);
      } catch (err) {
        console.error('Failed to load favorites', err);
      } finally {
        setLoading(false);
      }
    };
    loadFavs();
  }, [favorites]);

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-[#242424] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block mb-1">
            Private Portfolio
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0]">Saved Properties</h1>
          <p className="text-xs sm:text-sm text-[#8E8E8E] mt-1.5">
            Your shortlisted residences saved for review, comparison, and private viewings.
          </p>
        </div>

        <span className="text-xs text-[#8E8E8E]">
          <strong className="text-[#F7F5F0]">{favorites.length}</strong> items saved
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-[#161616] rounded-sm" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-[#161616] border border-[#262626] rounded-sm p-16 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#1C1C1C] border border-[#333] flex items-center justify-center text-[#B8955A] mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl text-[#F7F5F0]">Your Saved List is Empty</h3>
          <p className="text-xs text-[#8E8E8E] leading-relaxed">
            Click the heart icon on any villa, penthouse, or residence card to save it to your
            private shortlist for future reference.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/properties')}
              className="px-6 py-3 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all inline-flex items-center gap-2"
            >
              <span>Browse Properties</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};
