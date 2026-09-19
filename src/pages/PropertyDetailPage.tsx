import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { Property, Agent } from '../types';
import { PropertyGallery } from '../components/PropertyGallery';
import { InteractiveMap } from '../components/InteractiveMap';
import { PropertyCard } from '../components/PropertyCard';
import {
  Bed,
  Bath,
  Maximize2,
  Car,
  Calendar,
  Layers,
  MapPin,
  Heart,
  Share2,
  Phone,
  Mail,
  Send,
  CalendarCheck,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';

interface PropertyDetailPageProps {
  slug: string;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ slug }) => {
  const { navigate, isFavorite, toggleFavorite, openViewingModal, showToast } = useApp();

  const [property, setProperty] = useState<Property | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Inquiry Form State inside sticky panel
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState(
    'I would like to request confidential details and schedule a private viewing for this residence.'
  );
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await api.getProperty(slug);
        if (data) {
          setProperty(data.property);
          setAgent(data.agent || null);
          setSimilarProperties(data.similar || []);
        } else {
          setProperty(null);
        }
      } catch (err) {
        console.error('Failed to load property details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [slug]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    if (!inquiryName || !inquiryEmail) {
      showToast('Please provide your name and email.', 'error');
      return;
    }

    setSubmittingInquiry(true);
    try {
      await api.submitInquiry({
        name: inquiryName,
        email: inquiryEmail,
        phone: inquiryPhone,
        propertyId: property.id,
        propertyTitle: property.title,
        subject: `Inquiry: ${property.title}`,
        message: inquiryMessage,
      });
      showToast('Inquiry submitted successfully. An advisor will contact you.', 'success');
      setInquiryName('');
      setInquiryEmail('');
      setInquiryPhone('');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit inquiry', 'error');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Property link copied to clipboard', 'info');
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <div className="h-8 w-64 bg-[#1C1C1C] rounded-sm" />
        <div className="h-[450px] bg-[#181818] rounded-sm" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-[#181818] rounded-sm" />
          <div className="h-96 bg-[#181818] rounded-sm" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-36 pb-24 max-w-3xl mx-auto px-4 text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#F7F5F0]">Property Not Found</h2>
        <p className="text-sm text-[#8E8E8E]">
          The residence you are looking for may have been archived, acquired off-market, or the URL
          is incorrect.
        </p>
        <button
          onClick={() => navigate('/properties')}
          className="px-6 py-3 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D]"
        >
          Explore Other Properties
        </button>
      </div>
    );
  }

  const formatPrice = (val: number, currency: string = 'USD', period?: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(val);
    return period ? `${formatted} / ${period}` : formatted;
  };

  const favorited = isFavorite(property.id);

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-[#8E8E8E] border-b border-[#222] pb-4">
        <button
          onClick={() => navigate('/properties')}
          className="inline-flex items-center gap-2 hover:text-[#B8955A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Properties</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-[#F7F5F0] transition-colors p-1"
            title="Share Property"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={() => toggleFavorite(property.id)}
            className={`flex items-center gap-1.5 transition-colors p-1 ${
              favorited ? 'text-red-400' : 'hover:text-[#B8955A]'
            }`}
            title="Save Property"
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{favorited ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Title Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-sm ${
                property.listingType === 'rent'
                  ? 'bg-[#1C1C1C] text-[#D8C29D] border border-[#D8C29D]/40'
                  : 'bg-[#B8955A] text-[#111111]'
              }`}
            >
              {property.status}
            </span>
            <span className="text-[11px] font-medium tracking-widest uppercase text-[#D8C29D] bg-[#181818] px-3 py-1 rounded-sm border border-[#333]">
              {property.type}
            </span>
            {property.isFeatured && (
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[#F7F5F0] bg-[#181818] border border-[#B8955A]/50 px-3 py-1 rounded-sm">
                Featured Collection
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0] font-bold">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-[#8E8E8E]">
            <MapPin className="w-4 h-4 text-[#B8955A] shrink-0" />
            <span>
              {property.location.address}, {property.location.area}, {property.location.city},{' '}
              {property.location.country}
            </span>
          </div>
        </div>

        {/* Offered Price */}
        <div className="text-left lg:text-right">
          <span className="text-[10px] uppercase tracking-widest text-[#6B6B6B] block">
            Offered At
          </span>
          <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F7F5F0]">
            {formatPrice(property.price, property.currency, property.pricePeriod)}
          </span>
        </div>
      </div>

      {/* High-Resolution Interactive Image Gallery */}
      <PropertyGallery
        featuredImage={property.media.featuredImage}
        gallery={property.media.gallery}
        title={property.title}
      />

      {/* Main Grid: Details + Sticky Inquiry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* LEFT 2 COLUMNS: Specs, Description, Amenities, Map */}
        <div className="lg:col-span-2 space-y-12">
          {/* Quick Information Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-[#161616] border border-[#262626] rounded-sm">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block">
                Bedrooms
              </span>
              <div className="flex items-center gap-2 text-base font-semibold text-[#F7F5F0]">
                <Bed className="w-5 h-5 text-[#B8955A]" />
                <span>{property.details.bedrooms} Suites</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block">
                Bathrooms
              </span>
              <div className="flex items-center gap-2 text-base font-semibold text-[#F7F5F0]">
                <Bath className="w-5 h-5 text-[#B8955A]" />
                <span>{property.details.bathrooms} Baths</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block">
                Interior Area
              </span>
              <div className="flex items-center gap-2 text-base font-semibold text-[#F7F5F0]">
                <Maximize2 className="w-5 h-5 text-[#B8955A]" />
                <span>{property.details.sqft.toLocaleString()} sq ft</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block">
                Garage / Parking
              </span>
              <div className="flex items-center gap-2 text-base font-semibold text-[#F7F5F0]">
                <Car className="w-5 h-5 text-[#B8955A]" />
                <span>{property.details.parking || property.details.garage || 2} Bays</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[#F7F5F0] border-b border-[#242424] pb-3">
              About This Residence
            </h2>
            <div className="text-sm sm:text-base text-[#B3B3B3] leading-relaxed space-y-4 font-light">
              <p>{property.description}</p>
              {property.details.yearBuilt && (
                <p className="text-xs text-[#8E8E8E]">
                  Completed in <strong className="text-[#F7F5F0]">{property.details.yearBuilt}</strong>.
                  Engineered to international structural specifications with bespoke acoustic and thermal insulation.
                </p>
              )}
            </div>
          </div>

          {/* Luxury Amenities Grid */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-[#F7F5F0] border-b border-[#242424] pb-3">
              Residence Features & Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 bg-[#161616] border border-[#242424] rounded-sm text-xs text-[#D8C29D]"
                >
                  <CheckCircle className="w-4 h-4 text-[#B8955A] shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Architectural Vicinity Map */}
          <InteractiveMap location={property.location} title={property.title} />

          {/* Assigned Agent Profile Card */}
          {agent && (
            <div className="p-6 sm:p-8 bg-[#161616] border border-[#262626] rounded-sm space-y-6">
              <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block">
                Exclusive Listing Representative
              </span>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#B8955A]/50"
                />
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <h3 className="font-serif text-2xl text-[#F7F5F0]">{agent.name}</h3>
                  <p className="text-xs text-[#B8955A] font-medium">{agent.position}</p>
                  <p className="text-xs text-[#8E8E8E] leading-relaxed">{agent.bio}</p>

                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#D8C29D]">
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center gap-1.5 hover:text-[#F7F5F0]"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#B8955A]" />
                      <span>{agent.phone}</span>
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-1.5 hover:text-[#F7F5F0]"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#B8955A]" />
                      <span>{agent.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Desktop Sticky Inquiry & Viewing Panel */}
        <div className="hidden lg:block lg:sticky lg:top-28 space-y-6">
          <div className="bg-[#181818] border border-[#2F2F2F] rounded-sm p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block mb-1">
                Private Advisory
              </span>
              <h3 className="font-serif text-2xl text-[#F7F5F0]">Interested in this property?</h3>
              <p className="text-xs text-[#8E8E8E] mt-1 leading-relaxed">
                Connect directly with the assigned private acquisitions partner for floor plans and title review.
              </p>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="Your Full Name *"
                  required
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm px-3 py-2.5 text-xs text-[#F7F5F0] placeholder-[#555] focus:outline-none focus:border-[#B8955A]"
                />
              </div>

              <div>
                <input
                  type="email"
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="Email Address *"
                  required
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm px-3 py-2.5 text-xs text-[#F7F5F0] placeholder-[#555] focus:outline-none focus:border-[#B8955A]"
                />
              </div>

              <div>
                <input
                  type="tel"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  placeholder="Phone / WhatsApp"
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm px-3 py-2.5 text-xs text-[#F7F5F0] placeholder-[#555] focus:outline-none focus:border-[#B8955A]"
                />
              </div>

              <div>
                <textarea
                  rows={3}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Your Message..."
                  required
                  className="w-full bg-[#121212] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] placeholder-[#555] focus:outline-none focus:border-[#B8955A]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingInquiry}
                className="w-full py-3.5 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingInquiry ? 'Sending...' : 'Request Information'}</span>
              </button>
            </form>

            <div className="pt-2 border-t border-[#262626] space-y-3">
              <button
                onClick={() => openViewingModal(property.id, property.title)}
                className="w-full py-3 bg-[#1C1C1C] border border-[#3E3E3E] hover:border-[#B8955A] text-[#F7F5F0] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-[#B8955A]" />
                <span>Schedule a Viewing</span>
              </button>

              {agent?.phone && (
                <a
                  href={`tel:${agent.phone}`}
                  className="w-full py-3 bg-transparent border border-[#2A2A2A] hover:border-[#444] text-[#8E8E8E] hover:text-[#F7F5F0] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 block text-center"
                >
                  <Phone className="w-3.5 h-3.5 text-[#B8955A]" />
                  <span>Call Representative</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <div className="pt-16 border-t border-[#242424] space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold block">
                Related Portfolio
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#F7F5F0]">
                Similar Residences
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((sim) => (
              <PropertyCard key={sim.id} property={sim} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#161616]/95 backdrop-blur-md border-t border-[#2A2A2A] p-3.5 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-[#6B6B6B] block">Price</span>
          <span className="font-serif text-lg font-bold text-[#F7F5F0]">
            {formatPrice(property.price, property.currency, property.pricePeriod)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openViewingModal(property.id, property.title)}
            className="px-4 py-2.5 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-wider rounded-sm"
          >
            Schedule Viewing
          </button>
        </div>
      </div>
    </div>
  );
};
