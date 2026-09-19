import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { Property, Agent, BlogPost, Testimonial } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { PropertySearchBox } from '../components/PropertySearchBox';
import {
  ArrowRight,
  Shield,
  Award,
  Globe2,
  Sparkles,
  Building,
  Key,
  TrendingUp,
  Briefcase,
  ChevronRight,
  Star,
  Quote,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, settings, openInquiryModal } = useApp();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propsRes, agentsRes, blogsRes, testsRes] = await Promise.all([
          api.getProperties({ featured: true, limit: 6 }),
          api.getAgents(),
          api.getBlogs(),
          api.getTestimonials(),
        ]);
        setFeaturedProperties(propsRes.properties);
        setAgents(agentsRes.slice(0, 3));
        setBlogs(blogsRes.slice(0, 3));
        setTestimonials(testsRes.slice(0, 3));
      } catch (err) {
        console.error('Error fetching homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    {
      title: 'Architectural Villas',
      type: 'Villa',
      count: '18 Available',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Sky Penthouses',
      type: 'Penthouse',
      count: '9 Available',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Modernist Houses',
      type: 'House',
      count: '24 Available',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Heritage Townhouses',
      type: 'Townhouse',
      count: '12 Available',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Commercial Assets',
      type: 'Commercial',
      count: '7 Available',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Prime Enclave Plots',
      type: 'Land',
      count: '15 Available',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const locations = [
    {
      name: 'Islamabad',
      subtitle: 'Sectors E-7, F-6 & Margalla Foothills',
      properties: '34 Prime Estates',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Lahore',
      subtitle: 'DHA Phase 6, Canal Bank & Gulberg',
      properties: '28 Luxury Residences',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Dubai',
      subtitle: 'Downtown, Palm Jumeirah & Emirates Hills',
      properties: '42 Sky Residences',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'London',
      subtitle: 'Mayfair, Knightsbridge & Kensington',
      properties: '19 Grade II Listed Assets',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const services = [
    {
      icon: <Key className="w-6 h-6 text-[#B8955A]" />,
      title: 'Prime Property Acquisitions',
      desc: 'Bespoke search and advisory for discerning collectors seeking private off-market residences.',
      link: '/services',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#B8955A]" />,
      title: 'Asset Valuation & Divestment',
      desc: 'Precision market valuations grounded in historical transaction data and discreet high-net-worth buyer networks.',
      link: '/sell',
    },
    {
      icon: <Building className="w-6 h-6 text-[#B8955A]" />,
      title: 'Commercial & Institutional Portfolios',
      desc: 'Institutional-grade acquisitions, long-term commercial lease structuring, and high-yield capital allocation.',
      link: '/services',
    },
    {
      icon: <Briefcase className="w-6 h-6 text-[#B8955A]" />,
      title: 'Private Estate Management',
      desc: 'End-to-end stewardship of luxury properties, diplomatic tenants, and comprehensive operational upkeep.',
      link: '/services',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ================================================= */}
      {/* 1. HERO SECTION */}
      {/* ================================================= */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with subtle architectural zoom */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              settings?.heroImage ||
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85'
            }
            alt="Luxury Hillside Villa"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Multi-layered luxury vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-[#111111]/40" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#1C1C1C]/80 border border-[#B8955A]/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#B8955A]" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D8C29D]">
                Find Your Next Address
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#F7F5F0] font-bold leading-[1.1] tracking-tight">
              {settings?.heroTitle || 'Exceptional Properties. Remarkable Places.'}
            </h1>

            <p className="text-base sm:text-lg text-[#E5E5E5]/90 max-w-2xl leading-relaxed font-light">
              {settings?.heroSubtitle ||
                'Discover thoughtfully selected homes, apartments, commercial spaces, and investment opportunities.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/properties')}
                className="px-8 py-4 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center gap-3 shadow-xl hover:shadow-[#B8955A]/20"
              >
                <span>Explore Properties</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openInquiryModal(undefined, 'VIP Consultation Booking')}
                className="px-8 py-4 bg-[#1C1C1C]/80 border border-[#444] hover:border-[#B8955A] text-[#F7F5F0] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#1C1C1C] transition-all backdrop-blur-md"
              >
                Book a Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Property Search Interface Box (Overlapping slightly) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <PropertySearchBox />
      </section>

      {/* ================================================= */}
      {/* 2. FEATURED PROPERTIES */}
      {/* ================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#222222] pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block mb-2">
              Curated Selection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F7F5F0]">
              Featured Properties
            </h2>
            <p className="text-sm text-[#8E8E8E] mt-2 max-w-xl">
              Explore a selection of properties chosen for their location, design, and potential.
            </p>
          </div>

          <button
            onClick={() => navigate('/properties')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B8955A] hover:text-[#D8C29D] font-semibold transition-colors"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-[#181818] rounded-sm animate-pulse border border-[#222]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* ================================================= */}
      {/* 3. PROPERTY CATEGORIES */}
      {/* ================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block mb-2">
            Diverse Portfolio
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F5F0]">
            Explore by Property Type
          </h2>
          <p className="text-sm text-[#8E8E8E] mt-2">
            Tailored spaces configured for bespoke living, family estates, and high-yield commercial assets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/properties?type=${cat.type}`)}
              className="group relative h-64 rounded-sm overflow-hidden border border-[#262626] cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-all" />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block mb-1">
                    {cat.count}
                  </span>
                  <h3 className="font-serif text-2xl text-[#F7F5F0] group-hover:text-[#B8955A] transition-colors">
                    {cat.title}
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#1C1C1C]/80 border border-[#333] flex items-center justify-center text-[#B8955A] group-hover:bg-[#B8955A] group-hover:text-[#111] transition-all">
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================= */}
      {/* 4. FEATURED LOCATIONS */}
      {/* ================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#222222] pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block mb-2">
              Premier Destinations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F5F0]">
              Signature Addresses
            </h2>
            <p className="text-sm text-[#8E8E8E] mt-2">
              From the serene foothills of Islamabad to the gleaming skylines of Dubai and London.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((loc, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/properties?city=${loc.name}`)}
              className="group relative h-96 rounded-sm overflow-hidden border border-[#262626] cursor-pointer"
            >
              <img
                src={loc.image}
                alt={loc.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block mb-1">
                  {loc.properties}
                </span>
                <h3 className="font-serif text-2xl text-[#F7F5F0] mb-1">{loc.name}</h3>
                <p className="text-xs text-[#A3A3A3] line-clamp-1">{loc.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================= */}
      {/* 5. WHY CHOOSE US & EDITABLE STATISTICS */}
      {/* ================================================= */}
      <section className="bg-[#141414] border-y border-[#242424] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block">
                The Aura Standard
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0] leading-tight">
                Architectural Integrity. Complete Discretion.
              </h2>
              <p className="text-sm text-[#8E8E8E] leading-relaxed">
                We bridge the gap between discerning collectors and rare architectural residences.
                Every property on our ledger is vetted for title authenticity, structural excellence,
                and long-term valuation strength.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-sm bg-[#1C1C1C] border border-[#333] flex items-center justify-center text-[#B8955A]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-base text-[#F7F5F0] font-semibold">
                    Absolute Confidentiality
                  </h4>
                  <p className="text-xs text-[#8E8E8E] leading-relaxed">
                    Discreet private sales representation for diplomatic and institutional clients.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-sm bg-[#1C1C1C] border border-[#333] flex items-center justify-center text-[#B8955A]">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-base text-[#F7F5F0] font-semibold">
                    Architectural Curation
                  </h4>
                  <p className="text-xs text-[#8E8E8E] leading-relaxed">
                    Rigorous selection prioritizing design pedigree, materials, and prime postcodes.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Image Grid */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-sm overflow-hidden border border-[#2A2A2A]">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                  alt="Interior Architecture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block absolute -bottom-8 -left-8 bg-[#181818] border border-[#B8955A]/50 p-6 rounded-sm shadow-2xl max-w-xs">
                <Globe2 className="w-6 h-6 text-[#B8955A] mb-2" />
                <p className="font-serif text-lg text-[#F7F5F0]">Cross-Border Advisory</p>
                <p className="text-xs text-[#8E8E8E] mt-1">
                  Coordinated transactions spanning Pakistan, the UAE, and the United Kingdom.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Bar (editable from admin settings!) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-[#242424]">
            <div>
              <span className="font-serif text-4xl sm:text-5xl font-bold text-[#B8955A] block">
                {settings?.stats?.propertiesListed || '500+'}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#A3A3A3] mt-1 block">
                Properties Listed
              </span>
            </div>
            <div>
              <span className="font-serif text-4xl sm:text-5xl font-bold text-[#B8955A] block">
                {settings?.stats?.successfulTransactions || '250+'}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#A3A3A3] mt-1 block">
                Successful Transactions
              </span>
            </div>
            <div>
              <span className="font-serif text-4xl sm:text-5xl font-bold text-[#B8955A] block">
                {settings?.stats?.yearsExperience || '16+'}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#A3A3A3] mt-1 block">
                Years Experience
              </span>
            </div>
            <div>
              <span className="font-serif text-4xl sm:text-5xl font-bold text-[#B8955A] block">
                {settings?.stats?.clientSatisfaction || '99%'}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#A3A3A3] mt-1 block">
                Client Satisfaction
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 6. SERVICES OVERVIEW */}
      {/* ================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block mb-2">
            Advisory Capabilities
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F5F0]">
            Bespoke Real Estate Services
          </h2>
          <p className="text-sm text-[#8E8E8E] mt-2">
            Comprehensive representation covering acquisitions, divestments, valuations, and corporate relocations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc, idx) => (
            <div
              key={idx}
              className="bg-[#161616] border border-[#262626] rounded-sm p-6 sm:p-8 flex flex-col justify-between hover:border-[#B8955A]/50 transition-all group"
            >
              <div>
                <div className="w-12 h-12 rounded-sm bg-[#1C1C1C] border border-[#333] flex items-center justify-center mb-6 group-hover:border-[#B8955A] transition-colors">
                  {svc.icon}
                </div>
                <h3 className="font-serif text-xl text-[#F7F5F0] mb-3 group-hover:text-[#B8955A] transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs text-[#8E8E8E] leading-relaxed mb-6">{svc.desc}</p>
              </div>

              <button
                onClick={() => navigate(svc.link)}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B8955A] group-hover:text-[#D8C29D]"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================= */}
      {/* 7. FEATURED AGENTS */}
      {/* ================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#222222] pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block mb-2">
              Private Advisors
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F5F0]">
              Meet Our Senior Partners
            </h2>
            <p className="text-sm text-[#8E8E8E] mt-2">
              Industry leaders recognized for integrity, negotiation mastery, and discreet counsel.
            </p>
          </div>

          <button
            onClick={() => navigate('/agents')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B8955A] hover:text-[#D8C29D] font-semibold transition-colors"
          >
            <span>View All Advisors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => navigate(`/agents/${agent.id}`)}
              className="group bg-[#161616] border border-[#262626] rounded-sm overflow-hidden hover:border-[#B8955A]/50 transition-all cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#111]">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block mb-1">
                  {agent.position}
                </span>
                <h3 className="font-serif text-xl text-[#F7F5F0] group-hover:text-[#B8955A] transition-colors">
                  {agent.name}
                </h3>
                <p className="text-xs text-[#8E8E8E] mt-2 line-clamp-2 leading-relaxed">
                  {agent.bio}
                </p>

                <div className="mt-4 pt-4 border-t border-[#222222] flex items-center justify-between text-xs text-[#D8C29D]">
                  <span>{agent.email}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================= */}
      {/* 8. TESTIMONIALS */}
      {/* ================================================= */}
      <section className="bg-[#141414] border-y border-[#242424] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block mb-2">
              Client Feedback
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F5F0]">
              Words from Discerning Clients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="bg-[#181818] border border-[#282828] rounded-sm p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#B8955A] mb-4">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#333] mb-3" />
                  <p className="text-xs sm:text-sm text-[#C4C4C4] leading-relaxed italic mb-6">
                    &ldquo;{test.review}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#242424]">
                  <img
                    src={test.photo}
                    alt={test.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#B8955A]/50"
                  />
                  <div>
                    <h4 className="font-serif text-sm text-[#F7F5F0] font-semibold">{test.name}</h4>
                    <span className="text-[11px] text-[#8E8E8E] block">
                      {test.role} {test.company ? `· ${test.company}` : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 9. LATEST BLOG POSTS */}
      {/* ================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#222222] pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block mb-2">
              The Journal
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F5F0]">
              Market Insights & Guides
            </h2>
            <p className="text-sm text-[#8E8E8E] mt-2">
              Expert commentary on market fundamentals, architectural vetting, and wealth preservation.
            </p>
          </div>

          <button
            onClick={() => navigate('/blog')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B8955A] hover:text-[#D8C29D] font-semibold transition-colors"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="group bg-[#161616] border border-[#262626] rounded-sm overflow-hidden hover:border-[#B8955A]/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-[#111]">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#B8955A] mb-2 font-semibold">
                    <span>{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-serif text-lg text-[#F7F5F0] group-hover:text-[#B8955A] transition-colors line-clamp-2 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#8E8E8E] line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-[#222222] text-xs text-[#6B6B6B]">
                <span>{post.date}</span>
                <span className="text-[#B8955A] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-medium">
                  Read Article &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================= */}
      {/* 10. CTA BANNER */}
      {/* ================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="relative rounded-sm overflow-hidden border border-[#2F2F2F] bg-gradient-to-r from-[#181818] via-[#1F1C18] to-[#181818] p-10 sm:p-16 text-center space-y-6">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block">
            Private Advisory
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0] max-w-2xl mx-auto leading-tight">
            Looking to Acquire or Divest an Architectural Landmark?
          </h2>
          <p className="text-sm text-[#A3A3A3] max-w-xl mx-auto leading-relaxed">
            Our private desk provides discreet appraisals, off-market portfolio access, and seamless transaction execution.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => openInquiryModal(undefined, 'Homepage VIP Consultation')}
              className="px-8 py-4 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center gap-2 shadow-xl"
            >
              <span>Schedule Private Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/sell')}
              className="px-8 py-4 bg-[#1C1C1C] border border-[#444] hover:border-[#B8955A] text-[#F7F5F0] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#252525] transition-all"
            >
              Request Property Valuation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
