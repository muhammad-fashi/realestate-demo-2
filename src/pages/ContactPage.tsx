import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Advisory Inquiry');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please provide your name, email, and message.', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.submitInquiry({
        name,
        email,
        phone,
        subject,
        message,
      });
      setSubmitted(true);
      showToast('Your message has been received by our concierge desk.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block">
          Concierge & Client Services
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#F7F5F0] leading-tight">
          Get in Touch
        </h1>
        <p className="text-sm sm:text-base text-[#8E8E8E] leading-relaxed font-light">
          Have a question about a property, need market advice, or want to schedule a private
          consultation? We are here to help.
        </p>
      </div>

      {/* Main Grid: Contact Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#161616] border border-[#262626] rounded-sm p-8 space-y-6">
            <h3 className="font-serif text-2xl text-[#F7F5F0] border-b border-[#242424] pb-4">
              Headquarters & Desks
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#1C1C1C] border border-[#333] flex items-center justify-center shrink-0 text-[#B8955A]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block">
                    Principal Address
                  </span>
                  <p className="text-xs sm:text-sm text-[#F7F5F0] font-medium leading-relaxed mt-0.5">
                    {settings?.officeAddress || 'Beverly Centre, Blue Area, Islamabad, Pakistan'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#1C1C1C] border border-[#333] flex items-center justify-center shrink-0 text-[#B8955A]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block">
                    Private Client Desk
                  </span>
                  <p className="text-xs sm:text-sm text-[#F7F5F0] font-medium leading-relaxed mt-0.5">
                    {settings?.contactPhone || '+92 51 289 4500'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#1C1C1C] border border-[#333] flex items-center justify-center shrink-0 text-[#B8955A]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block">
                    Electronic Inquiries
                  </span>
                  <p className="text-xs sm:text-sm text-[#F7F5F0] font-medium leading-relaxed mt-0.5">
                    {settings?.contactEmail || 'advisory@auraluxury.com'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#1C1C1C] border border-[#333] flex items-center justify-center shrink-0 text-[#B8955A]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block">
                    Operational Hours
                  </span>
                  <p className="text-xs sm:text-sm text-[#F7F5F0] font-medium leading-relaxed mt-0.5">
                    {settings?.businessHours || 'Monday – Saturday: 09:00 – 19:00 PST'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="bg-[#161616] border border-[#262626] rounded-sm p-6 space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block">
              Flagship Location
            </span>
            <div className="aspect-[16/9] rounded-sm bg-[#0E0E0E] border border-[#2A2A2A] relative overflow-hidden flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(#B8955A 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="relative z-10 flex flex-col items-center">
                <div className="p-3 bg-[#B8955A] text-[#111] rounded-full shadow-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="mt-2 text-xs font-semibold text-[#F7F5F0] bg-[#1C1C1C] px-3 py-1 rounded-sm border border-[#333]">
                  Aura Executive Galleries
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#161616] border border-[#262626] rounded-sm p-6 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#B8955A]/20 border border-[#B8955A] flex items-center justify-center text-[#B8955A] mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-3xl text-[#F7F5F0]">Message Dispatched</h3>
              <p className="text-sm text-[#8E8E8E] max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-[#F7F5F0]">{name}</strong>. An advisor has been
                notified and will review your requirements discreetly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-[#1C1C1C] border border-[#333] text-xs uppercase tracking-widest text-[#F7F5F0] rounded-sm hover:border-[#B8955A]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block mb-1">
                  Inquiry Form
                </span>
                <h3 className="font-serif text-2xl text-[#F7F5F0]">Transmit Your Requirements</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. S. Qureshi"
                    required
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
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
                    placeholder="s.qureshi@example.com"
                    required
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Phone / Mobile
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Subject / Area of Interest
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                  >
                    <option value="General Advisory Inquiry">General Advisory Inquiry</option>
                    <option value="Residential Acquisition">Residential Acquisition</option>
                    <option value="Commercial Portfolio">Commercial Portfolio</option>
                    <option value="Off-Market Private Ledger">Off-Market Private Ledger</option>
                    <option value="Property Divestment / Sale">Property Divestment / Sale</option>
                    <option value="Diplomatic Lease">Diplomatic Lease</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                  Message / Spatial Criteria *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details regarding preferred location, budget bracket, or specific property..."
                  required
                  className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Transmitting...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
