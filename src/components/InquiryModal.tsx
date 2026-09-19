import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { X, Send, Phone, Mail, User, MessageSquare } from 'lucide-react';

export const InquiryModal: React.FC = () => {
  const { inquiryModal, closeInquiryModal, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!inquiryModal.isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill in your name, email, and message.', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.submitInquiry({
        name,
        email,
        phone,
        propertyId: inquiryModal.propertyId,
        propertyTitle: inquiryModal.propertyTitle || 'General Advisory Request',
        subject: inquiryModal.propertyTitle ? `Inquiry: ${inquiryModal.propertyTitle}` : 'General Inquiry',
        message,
      });

      showToast('Your inquiry has been received. An advisor will contact you discreetly.', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      closeInquiryModal();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit inquiry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#181818] border border-[#2F2F2F] rounded-md max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={closeInquiryModal}
          className="absolute top-5 right-5 text-[#6B6B6B] hover:text-[#F7F5F0] transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block mb-1">
            Private Inquiry & Advisory
          </span>
          <h3 className="font-serif text-2xl text-[#F7F5F0]">
            {inquiryModal.propertyTitle || 'Connect with Our Private Desk'}
          </h3>
          <p className="text-xs text-[#8E8E8E] mt-1.5 leading-relaxed">
            Submit your details below. Our senior estate advisors ensure complete discretion.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] block mb-1">
              Your Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#B8955A] absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tariq Mansoor"
                required
                className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm pl-10 pr-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] block mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#B8955A] absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="t.mansoor@example.com"
                  required
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm pl-10 pr-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] block mb-1">
                Phone / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#B8955A] absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm pl-10 pr-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] block mb-1">
              Message / Specific Requirements *
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-[#B8955A] absolute left-3 top-3" />
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your timeline, preferences, or questions regarding this property..."
                required
                className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm pl-10 pr-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Submitting...' : 'Request Information'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
