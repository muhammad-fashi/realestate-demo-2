import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { PropertySearchBox } from '../components/PropertySearchBox';
import { ArrowRight, Shield, Award, Sparkles, Key, Check } from 'lucide-react';

export const RentPage: React.FC = () => {
  const { navigate } = useApp();
  const [featuredRentals, setFeaturedRentals] = useState<Property[]>([]);

  useEffect(() => {
    api
      .getProperties({ listingType: 'rent', limit: 3 })
      .then((res) => setFeaturedRentals(res.properties))
      .catch(console.error);
  }, []);

  const benefits = [
    {
      icon: <Shield className="w-5 h-5 text-[#B8955A]" />,
      title: 'Diplomatic & UN Standard Vetting',
      desc: 'Properties pre-inspected for high-level diplomatic security protocols, backup generation, and guarded perimeters.',
    },
    {
      icon: <Award className="w-5 h-5 text-[#B8955A]" />,
      title: 'Corporate Relocation Ease',
      desc: 'Bespoke corporate invoicing, international wire settlement, and tax-compliant lease documentation.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#B8955A]" />,
      title: 'Turnkey Architectural Finishes',
      desc: 'Selected residences offering European furnishings, bespoke Italian kitchens, and high-speed fiber connectivity.',
    },
    {
      icon: <Key className="w-5 h-5 text-[#B8955A]" />,
      title: 'Dedicated Tenant Concierge',
      desc: 'A single point of contact for routine maintenance, facility coordination, and lease renewals.',
    },
  ];

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Hero */}
      <div className="relative rounded-sm overflow-hidden bg-[#161616] border border-[#242424] p-10 sm:p-16 lg:p-20 text-center space-y-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block">
          Prime Long & Mid-Term Leases
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#F7F5F0] max-w-3xl mx-auto leading-tight">
          Find Your Perfect Rental Property
        </h1>
        <p className="text-sm sm:text-base text-[#8E8E8E] max-w-2xl mx-auto leading-relaxed">
          Explore prestigious apartments, embassy-grade houses, and serviced sky penthouses
          configured for diplomatic corps, multinational executives, and global citizens.
        </p>
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => navigate('/properties?listingType=rent')}
            className="px-8 py-3.5 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center gap-2"
          >
            <span>Explore Rental Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Property Search Box */}
      <PropertySearchBox initialValues={{ listingType: 'rent' }} compact />

      {/* Benefits */}
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block mb-2">
            The Aura Lease Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F5F0]">
            Why Lease Through Aura Real Estate
          </h2>
          <p className="text-sm text-[#8E8E8E] mt-2">
            White-glove lease placement with seamless paperwork and verified landlords.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#161616] border border-[#262626] rounded-sm p-6 sm:p-8 space-y-4"
            >
              <div className="w-10 h-10 rounded-sm bg-[#1C1C1C] border border-[#333] flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-serif text-lg text-[#F7F5F0]">{item.title}</h3>
              <p className="text-xs text-[#8E8E8E] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Rentals Grid */}
      <div className="space-y-8 pt-8 border-t border-[#222]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block">
              Immediate Occupancy
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F7F5F0]">
              Featured Residences for Lease
            </h2>
          </div>
          <button
            onClick={() => navigate('/properties?listingType=rent')}
            className="text-xs uppercase tracking-widest text-[#B8955A] font-semibold hover:text-[#D8C29D] transition-colors inline-flex items-center gap-1.5"
          >
            <span>View All Rentals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredRentals.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};
