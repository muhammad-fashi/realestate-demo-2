import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { X, Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';

export const ViewingModal: React.FC = () => {
  const { viewingModal, closeViewingModal, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!viewingModal.isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !preferredDate) {
      showToast('Please provide your name, email, and preferred viewing date.', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.submitViewing({
        name,
        email,
        phone,
        propertyId: viewingModal.propertyId || '',
        propertyTitle: viewingModal.propertyTitle || 'Selected Residence',
        preferredDate,
        preferredTime,
        message,
      });

      showToast('Viewing appointment requested. Our concierge will confirm with you shortly.', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setPreferredDate('');
      setMessage('');
      closeViewingModal();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit viewing request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#181818] border border-[#2F2F2F] rounded-md max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeViewingModal}
          className="absolute top-5 right-5 text-[#6B6B6B] hover:text-[#F7F5F0] transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block mb-1">
            Private Appointment
          </span>
          <h3 className="font-serif text-2xl text-[#F7F5F0]">
            Schedule a Private Viewing
          </h3>
          <p className="text-xs text-[#8E8E8E] mt-1">
            {viewingModal.propertyTitle || 'Selected Architectural Residence'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#B8955A] absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Tariq Hashmi"
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
                  placeholder="tariq@example.com"
                  required
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm pl-10 pr-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] block mb-1">
                Contact Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#B8955A] absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 321 1234567"
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm pl-10 pr-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] block mb-1">
                Preferred Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#B8955A] absolute left-3 top-3" />
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm pl-10 pr-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] block mb-1">
                Preferred Time Slot
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#B8955A] absolute left-3 top-3" />
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm pl-10 pr-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                >
                  <option value="10:00 AM">Morning (10:00 AM)</option>
                  <option value="11:30 AM">Late Morning (11:30 AM)</option>
                  <option value="02:00 PM">Early Afternoon (02:00 PM)</option>
                  <option value="04:30 PM">Late Afternoon (04:30 PM)</option>
                  <option value="06:00 PM">Sunset / Twilight (06:00 PM)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] block mb-1">
              Special Requests / Guests
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-[#B8955A] absolute left-3 top-3" />
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention if you are bringing an architect, require security clearance, or specific access..."
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
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Confirm Viewing Appointment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
