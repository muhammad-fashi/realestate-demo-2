import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Key,
  Home,
  Building,
  TrendingUp,
  FileText,
  ShieldCheck,
  EyeOff,
  Globe2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { navigate, openInquiryModal } = useApp();

  const services = [
    {
      id: 'acquisitions',
      icon: <Key className="w-6 h-6 text-[#B8955A]" />,
      title: 'Property Sales & Acquisitions',
      desc: 'Exclusive buyer and seller representation across the highest echelon of residential properties.',
      features: [
        'Off-market & pocket listing access',
        'Comparative transaction benchmarking',
        'Confidential price negotiation',
        'Deed verification & escrow supervision',
      ],
      cta: 'Inquire on Acquisitions',
    },
    {
      id: 'rentals',
      icon: <Home className="w-6 h-6 text-[#B8955A]" />,
      title: 'Rental & Long-Term Lease Advisory',
      desc: 'Bespoke leasing services catering to diplomats, expatriates, and corporate leadership.',
      features: [
        'Embassy & UN security compliance vetting',
        'Turnkey designer furnished residences',
        'Standardized diplomatic lease clauses',
        'Dedicated bilingual property stewards',
      ],
      cta: 'Explore Rentals',
      route: '/rent',
    },
    {
      id: 'commercial',
      icon: <Building className="w-6 h-6 text-[#B8955A]" />,
      title: 'Commercial Real Estate & Institutional Assets',
      desc: 'Strategic acquisition and structuring for grade-A office towers, retail flagships, and mixed-use complexes.',
      features: [
        'Tenant covenant & yield modeling',
        'Triple-net (NNN) lease structuring',
        'Zoning & commercial conversion counsel',
        'Institutional capital deployment',
      ],
      cta: 'Commercial Consultation',
    },
    {
      id: 'investment',
      icon: <TrendingUp className="w-6 h-6 text-[#B8955A]" />,
      title: 'Investment Consulting & Portfolio ROI',
      desc: 'Data-grounded market forecasts and capital allocation strategies for wealth preservation.',
      features: [
        'Capital appreciation & rental yield modeling',
        'Cross-border tax & repatriation guidance',
        'Pre-launch allocation in prime developments',
        'Distressed asset acquisition & turnaround',
      ],
      cta: 'Schedule Portfolio Review',
    },
    {
      id: 'valuation',
      icon: <FileText className="w-6 h-6 text-[#B8955A]" />,
      title: 'Property Valuation & Appraisal',
      desc: 'Authoritative valuations adhering to international RICS and local regulatory appraisal benchmarks.',
      features: [
        'Historical transaction comparables',
        'Replacement cost & depreciation analysis',
        'Architectural pedigree assessment',
        'Bank-approved valuation certificates',
      ],
      cta: 'Request Valuation',
      route: '/sell',
    },
    {
      id: 'management',
      icon: <ShieldCheck className="w-6 h-6 text-[#B8955A]" />,
      title: 'Private Estate Management',
      desc: 'Discreet, turnkey stewardship of private residences, secondary vacation estates, and vacant land holdings.',
      features: [
        'Preventative architectural & HVAC upkeep',
        'Staff screening, payroll & logistics',
        'Utility, tax & municipal settlement',
        'Emergency response & 24/7 monitoring',
      ],
      cta: 'Management Services',
    },
    {
      id: 'offmarket',
      icon: <EyeOff className="w-6 h-6 text-[#B8955A]" />,
      title: 'Off-Market Private Ledger',
      desc: 'Access to ultra-prime estates whose owners require absolute secrecy and non-public marketing.',
      features: [
        'Strict NDA protocol before disclosure',
        'Unpublished architectural landmarks',
        'Private escrow and discreet closing',
        'Verified proof-of-funds vetting',
      ],
      cta: 'Request Off-Market Access',
    },
    {
      id: 'relocation',
      icon: <Globe2 className="w-6 h-6 text-[#B8955A]" />,
      title: 'Diplomatic & Executive Relocation',
      desc: 'Comprehensive transition support for ambassadors, foreign dignitaries, and executive families.',
      features: [
        'Neighborhood security & zoning orientation',
        'Elite international school admissions liaison',
        'Private security detail coordination',
        'Temporary executive residency setup',
      ],
      cta: 'Relocation Inquiries',
    },
  ];

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block">
          Comprehensive Advisory
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#F7F5F0] leading-tight">
          Bespoke Real Estate Services
        </h1>
        <p className="text-sm sm:text-base text-[#8E8E8E] leading-relaxed font-light">
          Whether acquiring a landmark family compound, optimizing an international portfolio, or
          seeking off-market discretion, our multidisciplinary team delivers bespoke execution.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="bg-[#161616] border border-[#262626] rounded-sm p-8 flex flex-col justify-between hover:border-[#B8955A]/50 transition-all group space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-sm bg-[#1C1C1C] border border-[#333] flex items-center justify-center group-hover:border-[#B8955A] transition-colors">
                {svc.icon}
              </div>

              <div>
                <h3 className="font-serif text-2xl text-[#F7F5F0] group-hover:text-[#B8955A] transition-colors mb-2">
                  {svc.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8E8E8E] leading-relaxed">{svc.desc}</p>
              </div>

              <div className="pt-2 space-y-2.5">
                {svc.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-[#C4C4C4]">
                    <CheckCircle2 className="w-4 h-4 text-[#B8955A] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#222]">
              <button
                onClick={() => {
                  if (svc.route) {
                    navigate(svc.route);
                  } else {
                    openInquiryModal(undefined, `Service Inquiry: ${svc.title}`);
                  }
                }}
                className="w-full py-3 bg-[#1C1C1C] hover:bg-[#B8955A] border border-[#333] hover:border-[#B8955A] text-xs font-bold uppercase tracking-widest text-[#F7F5F0] hover:text-[#111111] rounded-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{svc.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
