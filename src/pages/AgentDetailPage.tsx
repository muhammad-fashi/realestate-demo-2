import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { Agent, Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { ArrowLeft, Phone, Mail, Award, MessageSquare, Send } from 'lucide-react';

interface AgentDetailPageProps {
  id: string;
}

export const AgentDetailPage: React.FC<AgentDetailPageProps> = ({ id }) => {
  const { navigate, showToast } = useApp();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Direct contact message form
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [agentsRes, propsRes] = await Promise.all([
          api.getAgents(),
          api.getProperties({ limit: 50 }),
        ]);
        const matched = agentsRes.find((a) => a.id === id);
        if (matched) {
          setAgent(matched);
          const assigned = propsRes.properties.filter(
            (p) => p.agentId === matched.id
          );
          setProperties(assigned);
        }
      } catch (err) {
        console.error('Failed to load agent', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;
    if (!clientName || !clientEmail || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitInquiry({
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        subject: `Direct Contact: ${agent.name}`,
        message: `[To: ${agent.name}] ${message}`,
      });
      showToast(`Your message has been dispatched to ${agent.name}.`, 'success');
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setMessage('');
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 animate-pulse">
        <div className="h-96 bg-[#161616] rounded-sm" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="pt-36 pb-24 max-w-xl mx-auto text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#F7F5F0]">Advisor Not Found</h2>
        <button
          onClick={() => navigate('/agents')}
          className="px-6 py-2.5 bg-[#B8955A] text-[#111] font-bold text-xs uppercase"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <button
        onClick={() => navigate('/agents')}
        className="inline-flex items-center gap-2 text-xs text-[#8E8E8E] hover:text-[#B8955A] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Advisory Directory</span>
      </button>

      {/* Main Profile Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-[#161616] border border-[#262626] rounded-sm p-6 sm:p-10">
        {/* Photo & Quick Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="aspect-[4/5] rounded-sm overflow-hidden border border-[#2A2A2A] bg-[#111]">
            <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-3 pt-2">
            <a
              href={`tel:${agent.phone}`}
              className="w-full py-3 bg-[#1C1C1C] hover:bg-[#B8955A] border border-[#333] hover:border-[#B8955A] text-xs font-semibold text-[#F7F5F0] hover:text-[#111] rounded-sm transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {agent.phone}</span>
            </a>
            <a
              href={`mailto:${agent.email}`}
              className="w-full py-3 bg-transparent border border-[#333] hover:border-[#444] text-xs font-semibold text-[#D8C29D] rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email: {agent.email}</span>
            </a>
          </div>
        </div>

        {/* Bio, Credentials & Direct Message */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block mb-1">
              {agent.position}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0] font-bold">
              {agent.name}
            </h1>
          </div>

          <div className="text-sm text-[#B3B3B3] leading-relaxed space-y-4 font-light border-y border-[#242424] py-6">
            <p>{agent.bio}</p>
          </div>

          {agent.specialization && agent.specialization.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8E8E8E] font-medium flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#B8955A]" />
                <span>Specialization Areas</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {agent.specialization.map((spec, i) => (
                  <span
                    key={i}
                    className="text-xs bg-[#1C1C1C] border border-[#333] text-[#D8C29D] px-2.5 py-1 rounded-xs"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Direct Message Form */}
          <div className="bg-[#121212] border border-[#262626] rounded-sm p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#B8955A]" />
              <h3 className="font-serif text-lg text-[#F7F5F0]">Send Private Message to {agent.name}</h3>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Your Name *"
                  required
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Your Email *"
                  required
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your confidential message regarding representation or properties..."
                required
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Sending...' : 'Transmit Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Assigned Property Portfolio */}
      <div className="space-y-8 pt-6">
        <div className="border-b border-[#242424] pb-4">
          <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block mb-1">
            Exclusive Ledger
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F7F5F0]">
            Properties Represented by {agent.name}
          </h2>
        </div>

        {properties.length === 0 ? (
          <p className="text-xs text-[#8E8E8E]">
            This partner currently represents confidential off-market mandates. Inquire directly for
            portfolio details.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
