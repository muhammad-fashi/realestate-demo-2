import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { Agent } from '../types';
import { ArrowRight, Award } from 'lucide-react';

export const AgentsPage: React.FC = () => {
  const { navigate } = useApp();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAgents()
      .then((data) => setAgents(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block">
          Private Advisors
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#F7F5F0] leading-tight">
          Meet Our Senior Partners
        </h1>
        <p className="text-sm sm:text-base text-[#8E8E8E] leading-relaxed font-light">
          Our advisors bring decades of transactional acumen, architectural fluency, and deep
          connections across Islamabad, Lahore, Dubai, and London.
        </p>
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-[#161616] rounded-sm animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => navigate(`/agents/${agent.id}`)}
              className="group bg-[#161616] border border-[#262626] rounded-sm overflow-hidden hover:border-[#B8955A]/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/5] overflow-hidden bg-[#111]">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block">
                    {agent.position}
                  </span>
                  <h3 className="font-serif text-2xl text-[#F7F5F0] group-hover:text-[#B8955A] transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-[#8E8E8E] leading-relaxed line-clamp-3 font-light">
                    {agent.bio}
                  </p>

                  {/* Specializations */}
                  <div className="pt-2 space-y-1.5 text-[11px] text-[#A3A3A3]">
                    {agent.specialization && agent.specialization.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#B8955A] shrink-0" />
                        <span className="line-clamp-1">{agent.specialization.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-[#222222] flex items-center justify-between text-xs text-[#D8C29D]">
                  <span>View Portfolio & Contact</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
