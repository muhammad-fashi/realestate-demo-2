import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Home, DollarSign, BedDouble } from 'lucide-react';

interface PropertySearchBoxProps {
  initialValues?: {
    listingType?: string;
    city?: string;
    type?: string;
    bedrooms?: string;
    minPrice?: string;
    maxPrice?: string;
  };
  compact?: boolean;
}

export const PropertySearchBox: React.FC<PropertySearchBoxProps> = ({
  initialValues,
  compact = false,
}) => {
  const { navigate } = useApp();

  const [listingType, setListingType] = useState<string>(initialValues?.listingType || 'sale');
  const [city, setCity] = useState<string>(initialValues?.city || '');
  const [type, setType] = useState<string>(initialValues?.type || '');
  const [bedrooms, setBedrooms] = useState<string>(initialValues?.bedrooms || '');
  const [minPrice, setMinPrice] = useState<string>(initialValues?.minPrice || '');
  const [maxPrice, setMaxPrice] = useState<string>(initialValues?.maxPrice || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (listingType && listingType !== 'all') params.set('listingType', listingType);
    if (city && city !== 'all') params.set('city', city);
    if (type && type !== 'all') params.set('type', type);
    if (bedrooms && bedrooms !== 'any') params.set('bedrooms', bedrooms);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div
      className={`w-full bg-[#181818]/95 backdrop-blur-xl border border-[#2F2F2F] rounded-md shadow-2xl p-6 sm:p-8 text-[#F7F5F0] transition-all ${
        compact ? 'max-w-5xl mx-auto' : 'max-w-5xl mx-auto -mt-10 relative z-20'
      }`}
    >
      {/* Purpose Tabs (Buy / Rent) */}
      <div className="flex items-center gap-3 mb-6 border-b border-[#2A2A2A] pb-4">
        <button
          type="button"
          onClick={() => setListingType('sale')}
          className={`px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all ${
            listingType === 'sale'
              ? 'bg-[#B8955A] text-[#111111] shadow-md'
              : 'text-[#A3A3A3] hover:text-[#F7F5F0] hover:bg-[#222222]'
          }`}
        >
          Buy Properties
        </button>
        <button
          type="button"
          onClick={() => setListingType('rent')}
          className={`px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all ${
            listingType === 'rent'
              ? 'bg-[#B8955A] text-[#111111] shadow-md'
              : 'text-[#A3A3A3] hover:text-[#F7F5F0] hover:bg-[#222222]'
          }`}
        >
          Rent Properties
        </button>
        <button
          type="button"
          onClick={() => setListingType('all')}
          className={`px-4 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all ${
            listingType === 'all'
              ? 'bg-[#B8955A] text-[#111111] shadow-md'
              : 'text-[#A3A3A3] hover:text-[#F7F5F0] hover:bg-[#222222]'
          }`}
        >
          All
        </button>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>Location</span>
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm px-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
          >
            <option value="">All Locations</option>
            <option value="Islamabad">Islamabad (E-7, F-6, F-7)</option>
            <option value="Lahore">Lahore (DHA, Gulberg)</option>
            <option value="Dubai">Dubai (Downtown, Palm)</option>
            <option value="London">London (Mayfair, Chelsea)</option>
          </select>
        </div>

        {/* Property Type */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-medium flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>Property Type</span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm px-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
          >
            <option value="">All Types</option>
            <option value="Villa">Villa / Luxury Estate</option>
            <option value="House">Contemporary House</option>
            <option value="Penthouse">Sky Penthouse</option>
            <option value="Apartment">Apartment / Flat</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Commercial">Commercial / Office</option>
            <option value="Land">Prime Land / Plot</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-medium flex items-center gap-1.5">
            <BedDouble className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>Bedrooms</span>
          </label>
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm px-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
          >
            <option value="">Any Bedrooms</option>
            <option value="1">1+ Bedrooms</option>
            <option value="2">2+ Bedrooms</option>
            <option value="3">3+ Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
            <option value="5">5+ Bedrooms</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-medium flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>Budget (USD)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm px-2.5 py-2.5 text-xs text-[#F7F5F0] placeholder-[#555] focus:outline-none focus:border-[#B8955A]"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm px-2.5 py-2.5 text-xs text-[#F7F5F0] placeholder-[#555] focus:outline-none focus:border-[#B8955A]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="sm:col-span-2 lg:col-span-4 pt-3 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-[#B8955A]/20"
          >
            <Search className="w-4 h-4" />
            <span>Search Properties</span>
          </button>
        </div>
      </form>
    </div>
  );
};
