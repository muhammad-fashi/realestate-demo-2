import React from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, Bed, Bath, Maximize2, MapPin, ArrowUpRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  layout?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, layout = 'grid' }) => {
  const { navigate, isFavorite, toggleFavorite } = useApp();
  const favorited = isFavorite(property.id);

  const formatPrice = (val: number, currency: string = 'USD', period?: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(val);
    return period ? `${formatted} / ${period}` : formatted;
  };

  const handleCardClick = () => {
    navigate(`/properties/${property.slug}`);
  };

  if (layout === 'list') {
    return (
      <div className="group bg-[#161616] border border-[#262626] rounded-sm overflow-hidden hover:border-[#B8955A]/50 transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden bg-[#111] shrink-0">
          <img
            src={property.media.featuredImage}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            <span
              className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-sm ${
                property.listingType === 'rent'
                  ? 'bg-[#1C1C1C]/90 text-[#D8C29D] border border-[#D8C29D]/30'
                  : 'bg-[#B8955A] text-[#111111]'
              }`}
            >
              {property.status}
            </span>
            {property.isFeatured && (
              <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-sm bg-[#111111]/90 text-[#F7F5F0] border border-[#B8955A]/40">
                Featured
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(property.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${
              favorited
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 scale-105'
                : 'bg-[#111111]/60 text-[#F7F5F0] hover:text-[#B8955A] hover:bg-[#111111]/90'
            }`}
            aria-label="Save property"
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#B8955A] font-medium tracking-wider uppercase mb-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>
                {property.location.area}, {property.location.city}
              </span>
            </div>

            <h3
              onClick={handleCardClick}
              className="font-serif text-xl sm:text-2xl text-[#F7F5F0] hover:text-[#B8955A] transition-colors cursor-pointer line-clamp-1 mb-3"
            >
              {property.title}
            </h3>

            <p className="text-xs text-[#8E8E8E] line-clamp-2 leading-relaxed mb-6">
              {property.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#A3A3A3] pb-6 border-b border-[#222222]">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-[#B8955A]" />
                <span>{property.details.bedrooms} Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-4 h-4 text-[#B8955A]" />
                <span>{property.details.bathrooms} Baths</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-[#B8955A]" />
                <span>{property.details.sqft.toLocaleString()} sq ft</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#6B6B6B] block">
                Offered At
              </span>
              <span className="font-serif text-2xl font-bold text-[#F7F5F0]">
                {formatPrice(property.price, property.currency, property.pricePeriod)}
              </span>
            </div>

            <button
              onClick={handleCardClick}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#B8955A] group-hover:text-[#D8C29D] transition-colors"
            >
              <span>View Property</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Card
  return (
    <div
      onClick={handleCardClick}
      className="group bg-[#161616] border border-[#262626] rounded-sm overflow-hidden hover:border-[#B8955A]/50 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col cursor-pointer"
    >
      {/* Property Image Container */}
      <div className="relative aspect-[16/11] overflow-hidden bg-[#111111]">
        <img
          src={property.media.featuredImage}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-transparent to-black/20 opacity-70 group-hover:opacity-40 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2 z-10">
          <span
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm ${
              property.listingType === 'rent'
                ? 'bg-[#1C1C1C]/90 text-[#D8C29D] border border-[#D8C29D]/30'
                : 'bg-[#B8955A] text-[#111111]'
            }`}
          >
            {property.status}
          </span>
          {property.isFeatured && (
            <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-sm bg-[#111111]/90 text-[#F7F5F0] border border-[#B8955A]/40 shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${
            favorited
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 scale-105'
              : 'bg-[#111111]/70 text-[#F7F5F0] hover:text-[#B8955A] hover:bg-[#111111]/90'
          }`}
          aria-label="Save property"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>

        {/* Property Type Pill on bottom image edge */}
        <div className="absolute bottom-3 left-3.5 z-10">
          <span className="text-[11px] font-medium tracking-widest uppercase text-[#D8C29D] bg-[#111111]/80 backdrop-blur-md px-2.5 py-1 rounded-sm border border-[#333333]">
            {property.type}
          </span>
        </div>
      </div>

      {/* Property Details Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#8E8E8E] font-medium tracking-wide mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#B8955A] shrink-0" />
            <span className="truncate">
              {property.location.area}, {property.location.city}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg sm:text-xl text-[#F7F5F0] group-hover:text-[#B8955A] transition-colors line-clamp-1 mb-4">
            {property.title}
          </h3>

          {/* Specs Bar */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#222222] text-xs text-[#A3A3A3]">
            <div className="flex items-center gap-1.5 justify-center">
              <Bed className="w-4 h-4 text-[#B8955A]" />
              <span>{property.details.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center border-x border-[#222222]">
              <Bath className="w-4 h-4 text-[#B8955A]" />
              <span>{property.details.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center">
              <Maximize2 className="w-4 h-4 text-[#B8955A]" />
              <span>{property.details.sqft.toLocaleString()} sq ft</span>
            </div>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="pt-4 flex items-center justify-between mt-2">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#6B6B6B] block">
              Price
            </span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#F7F5F0]">
              {formatPrice(property.price, property.currency, property.pricePeriod)}
            </span>
          </div>

          <div className="w-9 h-9 rounded-sm border border-[#333333] flex items-center justify-center text-[#B8955A] group-hover:border-[#B8955A] group-hover:bg-[#B8955A] group-hover:text-[#111111] transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
