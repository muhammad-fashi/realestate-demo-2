import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import {
  Shield,
  Camera,
  Target,
  UserCheck,
  FileCheck2,
  Send,
  Upload,
  CheckCircle2,
} from 'lucide-react';

export const SellPage: React.FC = () => {
  const { showToast } = useApp();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState<'Email' | 'Phone' | 'WhatsApp'>('Email');
  const [propertyType, setPropertyType] = useState('Villa');
  const [city, setCity] = useState('Islamabad');
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState('4');
  const [bathrooms, setBathrooms] = useState('4');
  const [sqft, setSqft] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAddImageUrl = () => {
    const url = window.prompt(
      'Enter an image URL for your property (or paste a photo link from Unsplash / Imgur):'
    );
    if (url && url.trim()) {
      setImages((prev) => [...prev, url.trim()]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address) {
      showToast('Please provide your name, email, and property address.', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.submitValuation({
        ownerName: name,
        email,
        phone: `${phone} (Prefers: ${preferredContact})`,
        propertyAddress: `${address}, ${city}`,
        propertyType,
        estimatedValue: expectedPrice ? `$${Number(expectedPrice).toLocaleString()}` : undefined,
        message: `Beds: ${bedrooms || 'N/A'}, Baths: ${bathrooms || 'N/A'}, Size: ${sqft || 'N/A'} sqft. Additional notes: ${notes || 'None'}`,
        images,
      });

      setSubmitted(true);
      showToast('Valuation request submitted successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit valuation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sellFeatures = [
    {
      icon: <Target className="w-5 h-5 text-[#B8955A]" />,
      title: 'Vetted High-Intent Buyers',
      desc: 'We match your property with verified investors, family offices, and overseas expatriates who are ready to purchase.',
    },
    {
      icon: <Camera className="w-5 h-5 text-[#B8955A]" />,
      title: 'Architectural Media Production',
      desc: 'Editorial-grade photography, cinematic walkthrough videos, drone topography, and curated styling.',
    },
    {
      icon: <Shield className="w-5 h-5 text-[#B8955A]" />,
      title: 'Absolute Discretion & Privacy',
      desc: 'Choose public syndication or confidential off-market placement requiring signed non-disclosure agreements.',
    },
    {
      icon: <FileCheck2 className="w-5 h-5 text-[#B8955A]" />,
      title: 'Comprehensive Legal Due Diligence',
      desc: 'Seamless title deed vetting, municipal clearance, and legally binding agreements drafted by property attorneys.',
    },
    {
      icon: <UserCheck className="w-5 h-5 text-[#B8955A]" />,
      title: 'Dedicated Senior Partner',
      desc: 'A dedicated acquisitions partner guides you from initial valuation through price negotiation and escrow closing.',
    },
  ];

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block">
          Asset Divestment & Valuation
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#F7F5F0] leading-tight">
          Sell Your Property with Confidence
        </h1>
        <p className="text-sm sm:text-base text-[#8E8E8E] leading-relaxed font-light">
          Get an accurate valuation and connect with serious buyers through our premium network.
          We represent distinctive homes and prime commercial assets with unmatched professionalism.
        </p>
      </div>

      {/* Main Grid: Benefits + Valuation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Why Sell With Us */}
        <div className="lg:col-span-5 space-y-8">
          <div className="border-b border-[#242424] pb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block mb-1">
              The Aura Advantage
            </span>
            <h2 className="font-serif text-2xl text-[#F7F5F0]">Why Entrust Aura with Your Property</h2>
          </div>

          <div className="space-y-6">
            {sellFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#161616] border border-[#2A2A2A] flex items-center justify-center shrink-0 mt-0.5">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="font-serif text-base text-[#F7F5F0] font-semibold mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#8E8E8E] leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Quote Box */}
          <div className="p-6 bg-[#141414] border border-[#B8955A]/30 rounded-sm space-y-3">
            <p className="font-serif text-sm text-[#E5E5E5] italic">
              &ldquo;Aura facilitated the sale of our Margalla Hills estate in 32 days with complete
              confidentiality and zero public disruption.&rdquo;
            </p>
            <span className="text-xs text-[#B8955A] block">— Ambassador K. Vance</span>
          </div>
        </div>

        {/* Right Column: Interactive Valuation Form */}
        <div className="lg:col-span-7 bg-[#161616] border border-[#262626] rounded-sm p-6 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#B8955A]/20 border border-[#B8955A] flex items-center justify-center text-[#B8955A] mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-3xl text-[#F7F5F0]">Valuation Request Received</h3>
              <p className="text-sm text-[#8E8E8E] max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-[#F7F5F0]">{name}</strong>. Our senior valuation
                appraiser is conducting comparative market research on your property and will reach
                out via your preferred contact channel ({preferredContact}) within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-[#1C1C1C] border border-[#333] text-xs uppercase tracking-widest text-[#F7F5F0] rounded-sm hover:border-[#B8955A]"
              >
                Submit Another Property
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block mb-1">
                  Confidential Submission
                </span>
                <h3 className="font-serif text-2xl text-[#F7F5F0]">Request a Property Valuation</h3>
                <p className="text-xs text-[#8E8E8E] mt-1">
                  Provide property details below. We guarantee 100% confidentiality.
                </p>
              </div>

              {/* Property Details Section */}
              <div className="space-y-4 pt-2 border-t border-[#222]">
                <h4 className="text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold">
                  1. Property Specifications
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                      Property Type *
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                    >
                      <option value="Villa">Villa / Luxury Residence</option>
                      <option value="House">Contemporary House</option>
                      <option value="Penthouse">Sky Penthouse</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Commercial">Commercial Building / Office</option>
                      <option value="Land">Land / Plot</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                    >
                      <option value="Islamabad">Islamabad</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Dubai">Dubai</option>
                      <option value="London">London</option>
                      <option value="Other">Other Prime Location</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Address / Area / Sector *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Sector F-7/2, Street 18 or DHA Phase 6"
                    required
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                      Area (sq ft)
                    </label>
                    <input
                      type="number"
                      value={sqft}
                      onChange={(e) => setSqft(e.target.value)}
                      placeholder="e.g. 7200"
                      className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                      Target (USD)
                    </label>
                    <input
                      type="number"
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(e.target.value)}
                      placeholder="e.g. 1500000"
                      className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                    />
                  </div>
                </div>
              </div>

              {/* Owner Information Section */}
              <div className="space-y-4 pt-4 border-t border-[#222]">
                <h4 className="text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold">
                  2. Owner Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Malik R. Khan"
                      required
                      className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="m.khan@example.com"
                      required
                      className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                      Preferred Contact Channel
                    </label>
                    <select
                      value={preferredContact}
                      onChange={(e: any) => setPreferredContact(e.target.value)}
                      className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                    >
                      <option value="Email">Email Communication</option>
                      <option value="Phone">Direct Phone Call</option>
                      <option value="WhatsApp">Encrypted WhatsApp</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Notes & Optional Photos */}
              <div className="space-y-4 pt-4 border-t border-[#222]">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Special Features & Property Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Mention architectural designer, recent renovations, basement bunker, pool specs, or whether you prefer off-market sale..."
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                  />
                </div>

                {/* Photo Upload / Links */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block">
                      Property Photographs (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="text-xs text-[#B8955A] hover:text-[#D8C29D] flex items-center gap-1 font-semibold"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>+ Add Image Link</span>
                    </button>
                  </div>
                  {images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {images.map((img, i) => (
                        <div
                          key={i}
                          className="relative w-16 h-12 rounded-sm overflow-hidden border border-[#333]"
                        >
                          <img src={img} alt="Property" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Processing Submission...' : 'Request Valuation'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
