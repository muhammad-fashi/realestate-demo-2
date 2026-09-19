import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, ArrowRight, Instagram, Linkedin, Youtube, Facebook, ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, settings, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('Thank you for subscribing to Aura Private Curations.', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#0D0D0D] border-t border-[#222222] text-[#A3A3A3] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-[#222222]">
          {/* Column 1: Brand & Narrative */}
          <div className="space-y-4">
            <div
              onClick={() => navigate('/')}
              className="cursor-pointer flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-sm border border-[#B8955A] flex items-center justify-center bg-[#1C1C1C]">
                <span className="font-serif text-lg font-bold text-[#B8955A]">A</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-widest text-[#F7F5F0] uppercase block">
                  {settings?.logoText || 'AURA'}
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#B8955A] block -mt-1 font-medium">
                  Luxury Real Estate
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#8E8E8E]">
              Aura represents the pinnacle of architectural residences, prime residential estates,
              and institutional property acquisitions across the most prestigious global addresses.
            </p>

            <div className="flex items-center gap-3 pt-2 text-[#D8C29D]">
              <a
                href={settings?.socialLinks?.instagram || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#2A2A2A] flex items-center justify-center hover:border-[#B8955A] hover:text-[#B8955A] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings?.socialLinks?.linkedin || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#2A2A2A] flex items-center justify-center hover:border-[#B8955A] hover:text-[#B8955A] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={settings?.socialLinks?.youtube || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#2A2A2A] flex items-center justify-center hover:border-[#B8955A] hover:text-[#B8955A] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={settings?.socialLinks?.facebook || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#2A2A2A] flex items-center justify-center hover:border-[#B8955A] hover:text-[#B8955A] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold uppercase tracking-wider text-[#F7F5F0]">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/properties')}
                  className="hover:text-[#B8955A] transition-colors"
                >
                  All Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/buy')}
                  className="hover:text-[#B8955A] transition-colors"
                >
                  Buy a Luxury Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/rent')}
                  className="hover:text-[#B8955A] transition-colors"
                >
                  Prime Rentals
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/sell')}
                  className="hover:text-[#B8955A] transition-colors"
                >
                  Sell / List Your Property
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/properties?featured=true')}
                  className="hover:text-[#B8955A] transition-colors"
                >
                  Featured Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/favorites')}
                  className="hover:text-[#B8955A] transition-colors"
                >
                  Saved Properties
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold uppercase tracking-wider text-[#F7F5F0]">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-[#B8955A] transition-colors"
                >
                  About Aura
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/services')}
                  className="hover:text-[#B8955A] transition-colors"
                >
                  Advisory Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/agents')}
                  className="hover:text-[#B8955A] transition-colors"
                >
                  Elite Advisors
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/blog')}
                  className="hover:text-[#B8955A] transition-colors"
                >
                  Journal & Market Insights
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-[#B8955A] transition-colors"
                >
                  Contact & Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold uppercase tracking-wider text-[#F7F5F0]">
              Private Concierge
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B8955A] shrink-0 mt-0.5" />
                <span className="leading-snug text-[#8E8E8E]">
                  {settings?.officeAddress ||
                    'Floor 14, Aura Executive Tower, Jinnah Avenue, Blue Area, Islamabad'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#B8955A] shrink-0" />
                <a
                  href={`tel:${settings?.contactPhone}`}
                  className="hover:text-[#F7F5F0] transition-colors"
                >
                  {settings?.contactPhone || '+92 (51) 844-9000'}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#B8955A] shrink-0" />
                <a
                  href={`mailto:${settings?.contactEmail}`}
                  className="hover:text-[#F7F5F0] transition-colors"
                >
                  {settings?.contactEmail || 'concierge@auraluxury.com'}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider text-[#D8C29D] font-medium mb-2">
                Private Journal Subscription
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-l-sm px-3.5 py-2 text-xs text-[#F7F5F0] placeholder-[#555] focus:outline-none focus:border-[#B8955A] w-full"
                />
                <button
                  type="submit"
                  className="bg-[#B8955A] text-[#111111] px-3.5 py-2 rounded-r-sm hover:bg-[#D8C29D] transition-colors flex items-center justify-center shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B6B6B] gap-4">
          <div className="flex items-center gap-2">
            <span>
              &copy; {new Date().getFullYear()} {settings?.brandName || 'Aura Luxury Real Estate'}.
              All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/privacy-policy')}
              className="hover:text-[#B8955A] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/terms')}
              className="hover:text-[#B8955A] transition-colors"
            >
              Terms & Conditions
            </button>
            {/* Discreet admin portal access without disrupting public visual hierarchy */}
            <button
              onClick={() => navigate('/admin')}
              className="text-[#333333] hover:text-[#6B6B6B] transition-colors p-1"
              title="Staff Portal"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
