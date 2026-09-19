import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-xs text-[#8E8E8E] hover:text-[#B8955A] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </button>

      <div className="border-b border-[#242424] pb-6 space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block">
          Legal Framework
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0]">Terms of Representation</h1>
        <p className="text-xs text-[#8E8E8E]">Effective: January 2026</p>
      </div>

      <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#A3A3A3] space-y-6 leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[#F7F5F0]">1. Agency Representation & Engagement</h2>
          <p>
            Engaging Aura Real Estate for acquisition, sale, or lease advisory constitutes agreement
            to our standard agency protocols. All binding contracts are executed on official municipal
            and international contract frameworks with licensed legal oversight.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[#F7F5F0]">2. Information Accuracy & Due Diligence</h2>
          <p>
            While property specifications, dimensions, architectural blueprints, and imagery are verified
            with municipal authorities and verified architects, prospective buyers and tenants retain the right
            to conduct independent technical surveys before formal transfer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[#F7F5F0]">3. Valuation Disclaimers</h2>
          <p>
            Valuation appraisals provided through this portal represent comparative market analyses based on
            historical transactional records and current market liquidity. Formal bank financing appraisals
            require an on-site physical survey.
          </p>
        </section>
      </div>
    </div>
  );
};
