import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { PropertySearchBox } from '../components/PropertySearchBox';
import { ArrowRight, CheckCircle2, ShieldCheck, Compass, FileText, KeyRound } from 'lucide-react';

export const BuyPage: React.FC = () => {
  const { navigate, openInquiryModal } = useApp();
  const [featuredSale, setFeaturedSale] = useState<Property[]>([]);

  useEffect(() => {
    api
      .getProperties({ listingType: 'sale', limit: 3 })
      .then((res) => setFeaturedSale(res.properties))
      .catch(console.error);
  }, []);

  const buyingSteps = [
    {
      num: '01',
      title: 'Define Your Goals',
      desc: 'Clarify spatial requirements, architectural preferences, investment horizon, and private security criteria.',
      icon: <Compass className="w-5 h-5 text-[#B8955A]" />,
    },
    {
      num: '02',
      title: 'Explore Properties',
      desc: 'Gain private access to our curated ledger of off-market villas, penthouses, and prime land parcels.',
      icon: <FileText className="w-5 h-5 text-[#B8955A]" />,
    },
    {
      num: '03',
      title: 'Schedule Viewings',
      desc: 'Private, escorted inspections coordinated around your calendar with our senior acquisitions directors.',
      icon: <CheckCircle2 className="w-5 h-5 text-[#B8955A]" />,
    },
    {
      num: '04',
      title: 'Make an Offer & Due Diligence',
      desc: 'Our legal and valuation team verifies clean title deeds, structural permits, and negotiates terms discreetly.',
      icon: <ShieldCheck className="w-5 h-5 text-[#B8955A]" />,
    },
    {
      num: '05',
      title: 'Complete the Purchase',
      desc: 'Seamless transfer of title, escrow oversight, and handover of keys with ongoing property stewardship.',
      icon: <KeyRound className="w-5 h-5 text-[#B8955A]" />,
    },
  ];

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Hero Section */}
      <div className="relative rounded-sm overflow-hidden bg-[#161616] border border-[#242424] p-10 sm:p-16 lg:p-20 text-center space-y-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block">
          Private Residential Acquisitions
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#F7F5F0] max-w-3xl mx-auto leading-tight">
          Find a Place Worth Coming Home To
        </h1>
        <p className="text-sm sm:text-base text-[#8E8E8E] max-w-2xl mx-auto leading-relaxed">
          From hillside retreats in Islamabad to sky penthouses in Dubai, our acquisitions team
          curates extraordinary residences with enduring architectural and financial value.
        </p>
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => navigate('/properties?listingType=sale')}
            className="px-8 py-3.5 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center gap-2"
          >
            <span>Start Your Property Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Property Search Box */}
      <PropertySearchBox initialValues={{ listingType: 'sale' }} compact />

      {/* Buying Process */}
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block mb-2">
            Seamless Execution
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F5F0]">The Aura Buying Process</h2>
          <p className="text-sm text-[#8E8E8E] mt-2">
            A structured, discreet methodology designed to protect your capital and respect your time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {buyingSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#161616] border border-[#262626] rounded-sm p-6 space-y-4 relative flex flex-col justify-between"
            >
              <div>
                <span className="font-serif text-3xl font-bold text-[#B8955A]/40 block mb-2">
                  {step.num}
                </span>
                <div className="mb-3">{step.icon}</div>
                <h3 className="font-serif text-lg text-[#F7F5F0] mb-2">{step.title}</h3>
                <p className="text-xs text-[#8E8E8E] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured For Sale Collection */}
      <div className="space-y-8 pt-8 border-t border-[#222]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block">
              Direct from Owners
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F7F5F0]">
              Featured Properties for Acquisition
            </h2>
          </div>
          <button
            onClick={() => navigate('/properties?listingType=sale')}
            className="text-xs uppercase tracking-widest text-[#B8955A] font-semibold hover:text-[#D8C29D] transition-colors inline-flex items-center gap-1.5"
          >
            <span>View All Sale Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredSale.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};
