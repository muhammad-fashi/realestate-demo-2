import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, FileText, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
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
          Legal & Compliance
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0]">Privacy & Discretion Policy</h1>
        <p className="text-xs text-[#8E8E8E]">Last revised: January 2026 · Adheres to international standards</p>
      </div>

      <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#A3A3A3] space-y-6 leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[#F7F5F0]">1. Commitment to Absolute Discretion</h2>
          <p>
            Aura Real Estate operates under the strictest confidential protocols required by diplomatic,
            institutional, and private clients. We do not sell, rent, monetize, or publicly disclose
            client names, transactional prices, or property identities without explicit written consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[#F7F5F0]">2. Information We Collect</h2>
          <p>
            When you request a private viewing, submit a property for valuation, or contact an advisor, we collect
            identifying contact information (Full name, electronic mail address, telephone number) and property
            specifications necessary to fulfill your request.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[#F7F5F0]">3. Storage & Cryptographic Security</h2>
          <p>
            All electronic inquiry records and valuation submissions are secured using industry-standard AES-256
            encryption at rest and TLS 1.3 in transit. Access is limited strictly to accredited senior partners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[#F7F5F0]">4. Off-Market Non-Disclosure Agreements (NDAs)</h2>
          <p>
            For residences listed within our Off-Market Ledger, interested parties are required to countersign
            a formal Non-Disclosure Agreement before floor plans, title numbers, or geographic coordinates are shared.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[#F7F5F0]">5. Contacting the Compliance Officer</h2>
          <p>
            To request data deletion, verify records, or lodge a confidentiality inquiry, contact our compliance desk
            at <strong className="text-[#F7F5F0]">compliance@auraluxury.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
