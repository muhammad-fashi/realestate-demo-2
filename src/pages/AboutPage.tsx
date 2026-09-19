import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { Agent } from '../types';
import { Shield, Award, Compass, HeartHandshake, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate, settings, openInquiryModal } = useApp();
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    api.getAgents().then(setAgents).catch(console.error);
  }, []);

  const values = [
    {
      icon: <Shield className="w-6 h-6 text-[#B8955A]" />,
      title: 'Uncompromising Integrity',
      desc: 'We operate with absolute transparency in pricing, legal clearance, and representation. Every contract is bulletproof.',
    },
    {
      icon: <Award className="w-6 h-6 text-[#B8955A]" />,
      title: 'Architectural Curation',
      desc: 'We do not list volume; we curate pedigree. Every home on our ledger reflects high aesthetic merit and enduring value.',
    },
    {
      icon: <Compass className="w-6 h-6 text-[#B8955A]" />,
      title: 'Strategic Discretion',
      desc: 'Our off-market desk represents diplomats, corporate titans, and family offices without public exposure.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#B8955A]" />,
      title: 'Generational Stewardship',
      desc: 'Our client relationships span decades. We guide acquisitions that serve as family heirlooms and wealth anchors.',
    },
  ];

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block">
          Our Heritage & Philosophy
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#F7F5F0] leading-tight">
          Defining Modern Luxury Living Since 2008
        </h1>
        <p className="text-sm sm:text-base text-[#8E8E8E] leading-relaxed font-light">
          Aura was founded on a singular conviction: luxury real estate demands architectural
          reverence, flawless legal due diligence, and absolute client confidentiality.
        </p>
      </div>

      {/* Story & Image Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block">
            Our Story
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F5F0]">
            From Bespoke Capital Enclaves to an International Footprint
          </h2>
          <div className="text-sm text-[#8E8E8E] space-y-4 leading-relaxed font-light">
            <p>
              Headquartered in Islamabad with advisory partner desks in Dubai and London, Aura Real
              Estate serves as the trusted bridge for ultra-high-net-worth individuals navigating
              prime residential and commercial real estate.
            </p>
            <p>
              Rather than overwhelming clients with hundreds of generic listings, we specialize in
              architectural properties: hillside sanctuaries in Islamabad&apos;s Margalla belt,
              colonial heritage manors in Lahore, and modernist duplex penthouses in Dubai&apos;s
              financial district.
            </p>
            <p>
              Our multidisciplinary team combines licensed architects, corporate real estate
              attorneys, and veteran private bankers to ensure seamless transactions from initial
              confidential search through escrow closing.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/3] rounded-sm overflow-hidden border border-[#2A2A2A]">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Aura Real Estate Headquarters"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-[#161616] border border-[#B8955A]/50 p-6 rounded-sm shadow-2xl max-w-xs hidden sm:block">
            <span className="font-serif text-3xl font-bold text-[#B8955A] block">16+</span>
            <span className="text-xs uppercase tracking-wider text-[#F7F5F0] font-semibold block mt-1">
              Years of Market Leadership
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Statistics Section */}
      <div className="bg-[#141414] border border-[#242424] rounded-sm p-8 sm:p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="font-serif text-4xl sm:text-5xl font-bold text-[#B8955A] block">
              {settings?.stats?.propertiesListed || '500+'}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#8E8E8E] mt-2 block font-medium">
              Curated Residences
            </span>
          </div>
          <div>
            <span className="font-serif text-4xl sm:text-5xl font-bold text-[#B8955A] block">
              {settings?.stats?.successfulTransactions || '250+'}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#8E8E8E] mt-2 block font-medium">
              Completed Transfers
            </span>
          </div>
          <div>
            <span className="font-serif text-4xl sm:text-5xl font-bold text-[#B8955A] block">
              {settings?.stats?.yearsExperience || '16+'}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#8E8E8E] mt-2 block font-medium">
              Years in Practice
            </span>
          </div>
          <div>
            <span className="font-serif text-4xl sm:text-5xl font-bold text-[#B8955A] block">
              {settings?.stats?.clientSatisfaction || '99%'}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#8E8E8E] mt-2 block font-medium">
              Client Satisfaction
            </span>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block mb-2">
            The Pillars of Aura
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F5F0]">
            Our Foundational Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div key={i} className="bg-[#161616] border border-[#262626] rounded-sm p-6 space-y-4">
              <div className="w-12 h-12 rounded-sm bg-[#1C1C1C] border border-[#333] flex items-center justify-center">
                {v.icon}
              </div>
              <h3 className="font-serif text-xl text-[#F7F5F0]">{v.title}</h3>
              <p className="text-xs text-[#8E8E8E] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership Team */}
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block mb-2">
            Leadership
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F5F0]">Senior Advisory Council</h2>
          <p className="text-sm text-[#8E8E8E] mt-2">
            Decades of combined transactional and architectural experience representing private clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => navigate(`/agents/${agent.id}`)}
              className="bg-[#161616] border border-[#262626] rounded-sm overflow-hidden group cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#111]">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block">
                  {agent.position}
                </span>
                <h3 className="font-serif text-xl text-[#F7F5F0] group-hover:text-[#B8955A] transition-colors">
                  {agent.name}
                </h3>
                <p className="text-xs text-[#8E8E8E] line-clamp-2 leading-relaxed">{agent.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-10 sm:p-16 rounded-sm bg-[#161616] border border-[#2A2A2A] text-center space-y-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block">
          Initiate Conversation
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0] max-w-2xl mx-auto">
          Experience the Aura Standard of Advisory
        </h2>
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => openInquiryModal(undefined, 'About Page Consultation')}
            className="px-8 py-4 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center gap-2"
          >
            <span>Schedule Private Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
