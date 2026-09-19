import React from 'react';
import { PropertyLocation } from '../types';
import { MapPin, GraduationCap, Building2, ShoppingBag, Train, Plane, Compass } from 'lucide-react';

interface InteractiveMapProps {
  location: PropertyLocation;
  title: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ location, title }) => {
  return (
    <div className="bg-[#161616] border border-[#262626] rounded-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262626] pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block">
            Location & Vicinity
          </span>
          <h3 className="font-serif text-xl text-[#F7F5F0]">
            {location.area}, {location.city}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8E8E8E]">
          <MapPin className="w-4 h-4 text-[#B8955A]" />
          <span>{location.address}</span>
        </div>
      </div>

      {/* Styled Interactive Architectural Map Canvas Mockup */}
      <div className="relative aspect-[21/9] w-full rounded-sm overflow-hidden border border-[#2A2A2A] bg-[#0E0E0E] flex items-center justify-center group">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#B8955A 1px, transparent 1px), radial-gradient(#333 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 15px 15px',
          }}
        />

        {/* Abstract Architectural Contour Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30 stroke-[#B8955A]/40" fill="none">
          <circle cx="50%" cy="50%" r="80" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="50%" cy="50%" r="140" strokeWidth="1" strokeDasharray="6 6" />
          <path d="M 0 100 Q 250 50 500 120 T 1000 80" strokeWidth="1.5" />
          <path d="M 100 0 Q 300 200 600 150 T 1200 300" strokeWidth="1" />
        </svg>

        {/* Central Pin */}
        <div className="relative z-10 flex flex-col items-center animate-bounce">
          <div className="p-3 bg-[#B8955A] text-[#111111] rounded-full shadow-2xl shadow-[#B8955A]/50">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div className="mt-2 bg-[#1C1C1C]/90 backdrop-blur-md px-3 py-1 rounded-sm border border-[#B8955A]/50 text-xs font-semibold text-[#F7F5F0]">
            {location.area} Private Enclave
          </div>
        </div>

        {/* Coordinates indicator */}
        <div className="absolute bottom-3 left-3 bg-[#111111]/80 backdrop-blur-sm px-2.5 py-1 text-[10px] tracking-wider text-[#A3A3A3] font-mono rounded-sm border border-[#222]">
          LAT {location.lat || '33.7294'}° N | LNG {location.lng || '73.0489'}° E (Protected Vicinity)
        </div>

        {/* External Map Link */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${location.address}, ${location.city}`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="absolute top-3 right-3 bg-[#111111]/80 hover:bg-[#B8955A] hover:text-[#111111] text-[#F7F5F0] text-xs px-3 py-1.5 rounded-sm transition-colors border border-[#333]"
        >
          Open in Google Maps &rarr;
        </a>
      </div>

      {/* Nearby Amenities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {location.nearby?.schools && (
          <div className="flex items-start gap-3 p-3.5 bg-[#121212] border border-[#222222] rounded-sm">
            <GraduationCap className="w-5 h-5 text-[#B8955A] shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block">
                Education & Academies
              </span>
              <span className="text-xs text-[#E5E5E5] font-medium leading-relaxed">
                {location.nearby.schools}
              </span>
            </div>
          </div>
        )}

        {location.nearby?.hospitals && (
          <div className="flex items-start gap-3 p-3.5 bg-[#121212] border border-[#222222] rounded-sm">
            <Building2 className="w-5 h-5 text-[#B8955A] shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block">
                Healthcare & Wellness
              </span>
              <span className="text-xs text-[#E5E5E5] font-medium leading-relaxed">
                {location.nearby.hospitals}
              </span>
            </div>
          </div>
        )}

        {location.nearby?.shopping && (
          <div className="flex items-start gap-3 p-3.5 bg-[#121212] border border-[#222222] rounded-sm">
            <ShoppingBag className="w-5 h-5 text-[#B8955A] shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block">
                Boutiques & Fine Dining
              </span>
              <span className="text-xs text-[#E5E5E5] font-medium leading-relaxed">
                {location.nearby.shopping}
              </span>
            </div>
          </div>
        )}

        {location.nearby?.transit && (
          <div className="flex items-start gap-3 p-3.5 bg-[#121212] border border-[#222222] rounded-sm">
            <Train className="w-5 h-5 text-[#B8955A] shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block">
                Transit & Arterials
              </span>
              <span className="text-xs text-[#E5E5E5] font-medium leading-relaxed">
                {location.nearby.transit}
              </span>
            </div>
          </div>
        )}

        {location.nearby?.airports && (
          <div className="flex items-start gap-3 p-3.5 bg-[#121212] border border-[#222222] rounded-sm">
            <Plane className="w-5 h-5 text-[#B8955A] shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block">
                International Airport
              </span>
              <span className="text-xs text-[#E5E5E5] font-medium leading-relaxed">
                {location.nearby.airports}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
