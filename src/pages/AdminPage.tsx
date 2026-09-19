import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import {
  Property,
  Agent,
  Inquiry,
  ViewingRequest,
  ValuationRequest,
  WebsiteSettings,
} from '../types';
import {
  Building2,
  Users,
  MessageSquare,
  CalendarCheck,
  TrendingUp,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Save,
  DollarSign,
  Eye,
  Key,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { isAdmin, adminLogin, adminLogout, showToast, navigate } = useApp();

  // Login form state
  const [email, setEmail] = useState('admin@auraluxury.com');
  const [password, setPassword] = useState('admin123');
  const [loginLoading, setLoginLoading] = useState(false);

  // Admin Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'properties' | 'inquiries' | 'viewings' | 'valuations' | 'agents' | 'settings'
  >('overview');

  // Loaded Data
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [viewings, setViewings] = useState<ViewingRequest[]>([]);
  const [valuations, setValuations] = useState<ValuationRequest[]>([]);
  const [settingsData, setSettingsData] = useState<WebsiteSettings | null>(null);

  // Property Modal (Add / Edit)
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propertyForm, setPropertyForm] = useState<Partial<Property>>({
    title: '',
    slug: '',
    type: 'Villa',
    listingType: 'sale',
    status: 'For Sale',
    price: 1500000,
    currency: 'USD',
    description: '',
    location: {
      address: '',
      area: '',
      city: 'Islamabad',
      state: 'Federal',
      country: 'Pakistan',
      lat: 33.7294,
      lng: 73.0489,
    },
    details: {
      bedrooms: 4,
      bathrooms: 5,
      sqft: 6500,
      parking: 3,
      yearBuilt: 2024,
    },
    amenities: ['Swimming Pool', 'Private Garden', '24/7 Security', 'Smart Home'],
    media: {
      featuredImage:
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    isFeatured: true,
    agentId: 'agent-1',
  });

  // Agent Modal (Add / Edit)
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [agentForm, setAgentForm] = useState<Partial<Agent>>({
    name: '',
    position: 'Senior Partner & Acquisitions Director',
    email: '',
    phone: '',
    photo:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    bio: '',
    specialization: ['Ultra-Prime Estates', 'Private Advisory'],
    active: true,
    social: {
      linkedin: 'https://linkedin.com',
    },
  });

  // Fetch admin data
  const loadAdminData = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const [propsRes, agentsRes, inqsRes, viewsRes, valsRes, setsRes] = await Promise.all([
        api.getProperties({ limit: 100 }),
        api.getAgents(),
        api.getInquiries(),
        api.getViewings(),
        api.getValuations(),
        api.getSettings(),
      ]);

      setProperties(propsRes.properties);
      setAgents(agentsRes);
      setInquiries(inqsRes);
      setViewings(viewsRes);
      setValuations(valsRes);
      setSettingsData(setsRes);
    } catch (err) {
      console.error('Failed to load admin data', err);
      showToast('Error loading administrative data.', 'error');
    }
  }, [isAdmin, showToast]);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin, loadAdminData]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await adminLogin(email, password);
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  // Property Handlers
  const handleOpenNewProperty = () => {
    setEditingPropertyId(null);
    setPropertyForm({
      title: '',
      slug: '',
      type: 'Villa',
      listingType: 'sale',
      status: 'For Sale',
      price: 1200000,
      currency: 'USD',
      description: '',
      location: {
        address: 'Sector F-7/2',
        area: 'F-7',
        city: 'Islamabad',
        state: 'Federal',
        country: 'Pakistan',
        lat: 33.7294,
        lng: 73.0489,
      },
      details: {
        bedrooms: 4,
        bathrooms: 4,
        sqft: 5500,
        parking: 2,
        yearBuilt: 2024,
      },
      amenities: ['Swimming Pool', 'Private Garden', '24/7 Security'],
      media: {
        featuredImage:
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      isFeatured: true,
      agentId: agents[0]?.id || 'agent-1',
    });
    setPropertyModalOpen(true);
  };

  const handleOpenEditProperty = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setPropertyForm(JSON.parse(JSON.stringify(prop)));
    setPropertyModalOpen(true);
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      if (editingPropertyId) {
        await api.updateProperty(editingPropertyId, propertyForm);
        showToast('Property updated successfully', 'success');
      } else {
        await api.createProperty(propertyForm);
        showToast('New property registered successfully', 'success');
      }
      setPropertyModalOpen(false);
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save property', 'error');
    }
  };

  const handleDeleteProperty = async (id: string, title: string) => {
    if (!isAdmin) return;
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      try {
        await api.deleteProperty(id);
        showToast('Property deleted successfully', 'info');
        loadAdminData();
      } catch (err: any) {
        showToast(err.message || 'Failed to delete property', 'error');
      }
    }
  };

  // Status Handlers
  const handleUpdateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    if (!isAdmin) return;
    try {
      await api.updateInquiryStatus(id, status);
      showToast(`Inquiry status set to ${status}`, 'success');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update inquiry status', 'error');
    }
  };

  const handleUpdateViewingStatus = async (id: string, status: ViewingRequest['status']) => {
    if (!isAdmin) return;
    try {
      await api.updateViewingStatus(id, status);
      showToast(`Viewing status set to ${status}`, 'success');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update viewing status', 'error');
    }
  };

  const handleUpdateValuationStatus = async (id: string, status: ValuationRequest['status']) => {
    if (!isAdmin) return;
    try {
      await api.updateValuationStatus(id, status);
      showToast(`Valuation status set to ${status}`, 'success');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update valuation status', 'error');
    }
  };

  // Agent Handlers
  const handleSaveAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      if (editingAgentId) {
        await api.updateAgent(editingAgentId, agentForm);
        showToast('Advisor details updated', 'success');
      } else {
        await api.createAgent(agentForm);
        showToast('New advisor registered', 'success');
      }
      setAgentModalOpen(false);
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save advisor', 'error');
    }
  };

  const handleDeleteAgent = async (id: string, name: string) => {
    if (!isAdmin) return;
    if (window.confirm(`Delete representative "${name}"?`)) {
      try {
        await api.deleteAgent(id);
        showToast('Representative removed', 'info');
        loadAdminData();
      } catch (err: any) {
        showToast(err.message || 'Failed to delete representative', 'error');
      }
    }
  };

  // Settings Handlers
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !settingsData) return;

    try {
      await api.updateSettings(settingsData);
      showToast('Global settings updated and persisted successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    }
  };

  // IF NOT AUTHENTICATED
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center pt-28 pb-20 px-4">
        <div className="w-full max-w-md bg-[#161616] border border-[#2F2F2F] rounded-sm p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-sm bg-[#1C1C1C] border border-[#B8955A]/50 flex items-center justify-center text-[#B8955A] mx-auto">
              <Key className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block">
              Internal Portal
            </span>
            <h1 className="font-serif text-2xl text-[#F7F5F0]">Executive Management Console</h1>
            <p className="text-xs text-[#8E8E8E]">
              Authenticate to oversee properties, inquiries, viewings, and site settings.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] block mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] block mb-1">
                Access Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center justify-center gap-2"
              >
                <span>{loginLoading ? 'Authenticating...' : 'Sign In to Console'}</span>
              </button>
            </div>
          </form>

          <div className="p-3 bg-[#111111] rounded-sm border border-[#262626] text-center">
            <span className="text-[11px] text-[#8E8E8E]">Default Credentials for Instant Access:</span>
            <p className="text-xs text-[#D8C29D] font-mono mt-0.5">
              admin@auraluxury.com / admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Console Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242424] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block">
            Executive Ledger & Control
          </span>
          <h1 className="font-serif text-3xl text-[#F7F5F0]">Aura Real Estate Console</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#1C1C1C] border border-[#333] hover:border-[#B8955A] text-xs text-[#F7F5F0] rounded-sm flex items-center gap-2 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>View Public Site</span>
          </button>
          <button
            onClick={adminLogout}
            className="px-4 py-2 bg-red-950/40 border border-red-900/50 hover:bg-red-900/60 text-xs text-red-200 rounded-sm flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#242424] scrollbar-thin">
        {[
          { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
          {
            id: 'properties',
            label: `Properties (${properties.length})`,
            icon: <Building2 className="w-4 h-4" />,
          },
          {
            id: 'inquiries',
            label: `Inquiries (${inquiries.filter((i) => i.status === 'New').length} New)`,
            icon: <MessageSquare className="w-4 h-4" />,
          },
          {
            id: 'viewings',
            label: `Viewings (${viewings.filter((v) => v.status === 'Pending').length} Pending)`,
            icon: <CalendarCheck className="w-4 h-4" />,
          },
          {
            id: 'valuations',
            label: `Valuations (${valuations.length})`,
            icon: <DollarSign className="w-4 h-4" />,
          },
          {
            id: 'agents',
            label: `Advisors (${agents.length})`,
            icon: <Users className="w-4 h-4" />,
          },
          { id: 'settings', label: 'Site Settings', icon: <SettingsIcon className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#B8955A] text-[#111111] shadow-md'
                : 'text-[#8E8E8E] hover:text-[#F7F5F0] hover:bg-[#181818]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#161616] border border-[#262626] rounded-sm p-6 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block">
                Total Properties
              </span>
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl text-[#F7F5F0] font-bold">
                  {properties.length}
                </span>
                <Building2 className="w-6 h-6 text-[#B8955A]" />
              </div>
              <span className="text-[11px] text-[#A3A3A3] block">
                {properties.filter((p) => p.listingType === 'sale').length} For Sale ·{' '}
                {properties.filter((p) => p.listingType === 'rent').length} For Rent
              </span>
            </div>

            <div className="bg-[#161616] border border-[#262626] rounded-sm p-6 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block">
                Inquiries Received
              </span>
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl text-[#F7F5F0] font-bold">
                  {inquiries.length}
                </span>
                <MessageSquare className="w-6 h-6 text-[#B8955A]" />
              </div>
              <span className="text-[11px] text-[#B8955A] font-semibold block">
                {inquiries.filter((i) => i.status === 'New').length} Awaiting Response
              </span>
            </div>

            <div className="bg-[#161616] border border-[#262626] rounded-sm p-6 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block">
                Viewings Scheduled
              </span>
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl text-[#F7F5F0] font-bold">
                  {viewings.length}
                </span>
                <CalendarCheck className="w-6 h-6 text-[#B8955A]" />
              </div>
              <span className="text-[11px] text-[#A3A3A3] block">
                {viewings.filter((v) => v.status === 'Pending').length} Pending Confirmation
              </span>
            </div>

            <div className="bg-[#161616] border border-[#262626] rounded-sm p-6 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block">
                Valuation Leads
              </span>
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl text-[#F7F5F0] font-bold">
                  {valuations.length}
                </span>
                <DollarSign className="w-6 h-6 text-[#B8955A]" />
              </div>
              <span className="text-[11px] text-[#A3A3A3] block">
                High-net-worth owner representations
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#161616] border border-[#262626] rounded-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#242424] pb-3">
                <h3 className="font-serif text-lg text-[#F7F5F0]">Recent Inquiries</h3>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs text-[#B8955A] hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {inquiries.slice(0, 5).map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3 bg-[#111111] rounded-sm border border-[#242424] flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#F7F5F0] font-medium">{inq.name}</span>
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 rounded-xs font-semibold ${
                            inq.status === 'New'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-[#222] text-[#8E8E8E]'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8E8E8E] line-clamp-1 mt-0.5">
                        {inq.propertyTitle || inq.subject}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#6B6B6B] whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#161616] border border-[#262626] rounded-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#242424] pb-3">
                <h3 className="font-serif text-lg text-[#F7F5F0]">Upcoming Viewings</h3>
                <button
                  onClick={() => setActiveTab('viewings')}
                  className="text-xs text-[#B8955A] hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {viewings.slice(0, 5).map((view) => (
                  <div
                    key={view.id}
                    className="p-3 bg-[#111111] rounded-sm border border-[#242424] flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#F7F5F0] font-medium">{view.name}</span>
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 rounded-xs font-semibold ${
                            view.status === 'Pending'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {view.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8E8E8E] line-clamp-1 mt-0.5">
                        {view.propertyTitle} · {view.preferredDate} ({view.preferredTime})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROPERTIES MANAGEMENT TAB */}
      {activeTab === 'properties' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161616] p-4 rounded-sm border border-[#262626]">
            <div>
              <h2 className="font-serif text-xl text-[#F7F5F0]">Property Ledger</h2>
              <span className="text-xs text-[#8E8E8E]">
                Add, modify, feature, or archive luxury listings.
              </span>
            </div>

            <button
              onClick={handleOpenNewProperty}
              className="px-5 py-2.5 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Property</span>
            </button>
          </div>

          <div className="bg-[#161616] border border-[#262626] rounded-sm overflow-x-auto">
            <table className="w-full text-left text-xs text-[#A3A3A3]">
              <thead className="bg-[#111111] border-b border-[#262626] text-[10px] uppercase tracking-wider text-[#8E8E8E]">
                <tr>
                  <th className="p-4">Property</th>
                  <th className="p-4">Type / Purpose</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-[#181818] transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={prop.media.featuredImage}
                        alt=""
                        className="w-12 h-9 object-cover rounded-xs border border-[#333]"
                      />
                      <div>
                        <span className="text-xs font-medium text-[#F7F5F0] block line-clamp-1">
                          {prop.title}
                        </span>
                        <span className="text-[10px] text-[#6B6B6B]">{prop.slug}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-[#E5E5E5] font-medium block">{prop.type}</span>
                      <span className="text-[10px] uppercase text-[#B8955A] font-semibold">
                        {prop.listingType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-[#E5E5E5] block">
                        {prop.location.area}, {prop.location.city}
                      </span>
                      <span className="text-[10px] text-[#6B6B6B]">{prop.location.country}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold text-[#F7F5F0]">
                        ${prop.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      {prop.isFeatured ? (
                        <span className="px-2 py-0.5 bg-[#B8955A]/20 text-[#D8C29D] border border-[#B8955A]/40 rounded-xs text-[10px] uppercase font-bold">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#6B6B6B]">Standard</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/properties/${prop.slug}`)}
                        className="p-1.5 hover:text-[#B8955A] transition-colors"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditProperty(prop)}
                        className="p-1.5 hover:text-[#B8955A] transition-colors"
                        title="Edit Property"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(prop.id, prop.title)}
                        className="p-1.5 hover:text-red-400 transition-colors"
                        title="Delete Property"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INQUIRIES TAB */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#161616] p-4 rounded-sm border border-[#262626]">
            <div>
              <h2 className="font-serif text-xl text-[#F7F5F0]">Client Inquiries</h2>
              <span className="text-xs text-[#8E8E8E]">
                Review direct consultations, requests for information, and advisory contacts.
              </span>
            </div>
          </div>

          <div className="bg-[#161616] border border-[#262626] rounded-sm overflow-x-auto">
            <table className="w-full text-left text-xs text-[#A3A3A3]">
              <thead className="bg-[#111111] border-b border-[#262626] text-[10px] uppercase tracking-wider text-[#8E8E8E]">
                <tr>
                  <th className="p-4">Sender</th>
                  <th className="p-4">Subject / Property</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#181818] transition-colors">
                    <td className="p-4">
                      <span className="text-xs font-semibold text-[#F7F5F0] block">
                        {inq.name}
                      </span>
                      <span className="text-[11px] text-[#B8955A]">{inq.email}</span>
                      {inq.phone && (
                        <span className="text-[10px] text-[#6B6B6B] block">{inq.phone}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-[#E5E5E5] font-medium block">
                        {inq.subject}
                      </span>
                      {inq.propertyTitle && (
                        <span className="text-[10px] text-[#8E8E8E]">{inq.propertyTitle}</span>
                      )}
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="text-xs text-[#C4C4C4] line-clamp-2">{inq.message}</p>
                    </td>
                    <td className="p-4 text-[11px] text-[#6B6B6B]">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] uppercase px-2 py-0.5 rounded-xs font-bold ${
                          inq.status === 'New'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : inq.status === 'Contacted'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                        className="bg-[#111111] border border-[#2E2E2E] rounded-xs px-2 py-1 text-[11px] text-[#F7F5F0] focus:outline-none"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Viewing Scheduled">Viewing Scheduled</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEWINGS TAB */}
      {activeTab === 'viewings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#161616] p-4 rounded-sm border border-[#262626]">
            <div>
              <h2 className="font-serif text-xl text-[#F7F5F0]">Private Viewings Ledger</h2>
              <span className="text-xs text-[#8E8E8E]">
                Escorted property appointments requested by prospective buyers and tenants.
              </span>
            </div>
          </div>

          <div className="bg-[#161616] border border-[#262626] rounded-sm overflow-x-auto">
            <table className="w-full text-left text-xs text-[#A3A3A3]">
              <thead className="bg-[#111111] border-b border-[#262626] text-[10px] uppercase tracking-wider text-[#8E8E8E]">
                <tr>
                  <th className="p-4">Visitor</th>
                  <th className="p-4">Property</th>
                  <th className="p-4">Scheduled Date & Time</th>
                  <th className="p-4">Notes</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {viewings.map((view) => (
                  <tr key={view.id} className="hover:bg-[#181818] transition-colors">
                    <td className="p-4">
                      <span className="text-xs font-semibold text-[#F7F5F0] block">
                        {view.name}
                      </span>
                      <span className="text-[11px] text-[#B8955A]">{view.email}</span>
                      {view.phone && (
                        <span className="text-[10px] text-[#6B6B6B] block">{view.phone}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-[#E5E5E5] font-medium block">
                        {view.propertyTitle}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-[#F7F5F0] font-semibold block">
                        {view.preferredDate}
                      </span>
                      <span className="text-[10px] text-[#B8955A]">{view.preferredTime}</span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="text-xs text-[#8E8E8E] line-clamp-2">
                        {view.message || 'No special requests'}
                      </p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] uppercase px-2 py-0.5 rounded-xs font-bold ${
                          view.status === 'Pending'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : view.status === 'Confirmed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : view.status === 'Completed'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {view.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={view.status}
                        onChange={(e) => handleUpdateViewingStatus(view.id, e.target.value as any)}
                        className="bg-[#111111] border border-[#2E2E2E] rounded-xs px-2 py-1 text-[11px] text-[#F7F5F0] focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VALUATIONS TAB */}
      {activeTab === 'valuations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#161616] p-4 rounded-sm border border-[#262626]">
            <div>
              <h2 className="font-serif text-xl text-[#F7F5F0]">Seller Valuations Ledger</h2>
              <span className="text-xs text-[#8E8E8E]">
                Appraisal submissions from prospective sellers and estate owners.
              </span>
            </div>
          </div>

          <div className="bg-[#161616] border border-[#262626] rounded-sm overflow-x-auto">
            <table className="w-full text-left text-xs text-[#A3A3A3]">
              <thead className="bg-[#111111] border-b border-[#262626] text-[10px] uppercase tracking-wider text-[#8E8E8E]">
                <tr>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Property Address</th>
                  <th className="p-4">Property Type & Value</th>
                  <th className="p-4">Notes</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {valuations.map((val) => (
                  <tr key={val.id} className="hover:bg-[#181818] transition-colors">
                    <td className="p-4">
                      <span className="text-xs font-semibold text-[#F7F5F0] block">
                        {val.ownerName}
                      </span>
                      <span className="text-[11px] text-[#B8955A]">{val.email}</span>
                      <span className="text-[10px] text-[#6B6B6B] block">{val.phone}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-[#E5E5E5] font-medium block">
                        {val.propertyAddress}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-[#F7F5F0] font-semibold block">
                        {val.estimatedValue || 'Unspecified'}
                      </span>
                      <span className="text-[10px] text-[#6B6B6B]">{val.propertyType}</span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="text-xs text-[#8E8E8E] line-clamp-2">
                        {val.message || 'No extra specifications'}
                      </p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] uppercase px-2 py-0.5 rounded-xs font-bold ${
                          val.status === 'New'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : val.status === 'Reviewing'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {val.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={val.status}
                        onChange={(e) => handleUpdateValuationStatus(val.id, e.target.value as any)}
                        className="bg-[#111111] border border-[#2E2E2E] rounded-xs px-2 py-1 text-[11px] text-[#F7F5F0] focus:outline-none"
                      >
                        <option value="New">New</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Valuation Sent">Valuation Sent</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AGENTS TAB */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161616] p-4 rounded-sm border border-[#262626]">
            <div>
              <h2 className="font-serif text-xl text-[#F7F5F0]">Advisory Partners</h2>
              <span className="text-xs text-[#8E8E8E]">
                Manage licensed representatives and partner profiles.
              </span>
            </div>

            <button
              onClick={() => {
                setEditingAgentId(null);
                setAgentForm({
                  name: '',
                  position: 'Senior Partner',
                  email: '',
                  phone: '+92 300 1234567',
                  photo:
                    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
                  bio: '',
                  specialization: ['Residential Estates'],
                  active: true,
                  social: {
                    linkedin: 'https://linkedin.com',
                  },
                });
                setAgentModalOpen(true);
              }}
              className="px-5 py-2.5 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Advisor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-[#161616] border border-[#262626] rounded-sm p-6 space-y-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full object-cover border border-[#B8955A]/40"
                  />
                  <div>
                    <h3 className="font-serif text-lg text-[#F7F5F0]">{agent.name}</h3>
                    <span className="text-xs text-[#B8955A] block">{agent.position}</span>
                  </div>
                </div>

                <p className="text-xs text-[#8E8E8E] line-clamp-3">{agent.bio}</p>

                <div className="pt-3 border-t border-[#222] flex items-center justify-between text-xs text-[#8E8E8E]">
                  <span>{agent.email}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingAgentId(agent.id);
                        setAgentForm(JSON.parse(JSON.stringify(agent)));
                        setAgentModalOpen(true);
                      }}
                      className="p-1.5 hover:text-[#B8955A]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAgent(agent.id, agent.name)}
                      className="p-1.5 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SITE SETTINGS TAB */}
      {activeTab === 'settings' && settingsData && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-[#161616] border border-[#262626] rounded-sm p-6 sm:p-10 space-y-8 max-w-4xl"
        >
          <div className="border-b border-[#242424] pb-4">
            <h2 className="font-serif text-2xl text-[#F7F5F0]">Global Branding & Portal Settings</h2>
            <p className="text-xs text-[#8E8E8E]">
              Changes made here update throughout the homepage, hero banners, statistics, and footer.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[#B8955A] font-semibold">
              Homepage Hero Section
            </h3>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                Hero Heading Title
              </label>
              <input
                type="text"
                value={settingsData.heroTitle}
                onChange={(e) =>
                  setSettingsData({ ...settingsData, heroTitle: e.target.value })
                }
                className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                Hero Subtitle Text
              </label>
              <textarea
                rows={2}
                value={settingsData.heroSubtitle}
                onChange={(e) =>
                  setSettingsData({ ...settingsData, heroSubtitle: e.target.value })
                }
                className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                Hero Background Image URL
              </label>
              <input
                type="url"
                value={settingsData.heroImage}
                onChange={(e) =>
                  setSettingsData({ ...settingsData, heroImage: e.target.value })
                }
                className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#242424]">
            <h3 className="text-xs uppercase tracking-wider text-[#B8955A] font-semibold">
              Headquarters & Official Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={settingsData.contactEmail}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, contactEmail: e.target.value })
                  }
                  className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                  Desk Phone Number
                </label>
                <input
                  type="text"
                  value={settingsData.contactPhone}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, contactPhone: e.target.value })
                  }
                  className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                Corporate Address
              </label>
              <input
                type="text"
                value={settingsData.officeAddress}
                onChange={(e) =>
                  setSettingsData({ ...settingsData, officeAddress: e.target.value })
                }
                className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#242424]">
            <h3 className="text-xs uppercase tracking-wider text-[#B8955A] font-semibold">
              Homepage Statistics Counters
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                  Properties Listed
                </label>
                <input
                  type="text"
                  value={settingsData.stats.propertiesListed}
                  onChange={(e) =>
                    setSettingsData({
                      ...settingsData,
                      stats: { ...settingsData.stats, propertiesListed: e.target.value },
                    })
                  }
                  className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                  Completed Deals
                </label>
                <input
                  type="text"
                  value={settingsData.stats.successfulTransactions}
                  onChange={(e) =>
                    setSettingsData({
                      ...settingsData,
                      stats: { ...settingsData.stats, successfulTransactions: e.target.value },
                    })
                  }
                  className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                  Years in Practice
                </label>
                <input
                  type="text"
                  value={settingsData.stats.yearsExperience}
                  onChange={(e) =>
                    setSettingsData({
                      ...settingsData,
                      stats: { ...settingsData.stats, yearsExperience: e.target.value },
                    })
                  }
                  className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                  Satisfaction Rate
                </label>
                <input
                  type="text"
                  value={settingsData.stats.clientSatisfaction}
                  onChange={(e) =>
                    setSettingsData({
                      ...settingsData,
                      stats: { ...settingsData.stats, clientSatisfaction: e.target.value },
                    })
                  }
                  className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#242424]">
            <button
              type="submit"
              className="px-8 py-3 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-all flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Global Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* PROPERTY MODAL */}
      {propertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#181818] border border-[#2F2F2F] rounded-sm max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#262626] pb-4">
              <h3 className="font-serif text-2xl text-[#F7F5F0]">
                {editingPropertyId ? 'Edit Property' : 'Add New Luxury Property'}
              </h3>
              <button
                onClick={() => setPropertyModalOpen(false)}
                className="text-xs uppercase tracking-wider text-[#8E8E8E] hover:text-[#F7F5F0]"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  value={propertyForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '');
                    setPropertyForm({ ...propertyForm, title, slug: propertyForm.slug || slug });
                  }}
                  required
                  className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Slug / URL Path *
                  </label>
                  <input
                    type="text"
                    value={propertyForm.slug}
                    onChange={(e) =>
                      setPropertyForm({ ...propertyForm, slug: e.target.value })
                    }
                    required
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Assigned Agent / Partner
                  </label>
                  <select
                    value={propertyForm.agentId}
                    onChange={(e) =>
                      setPropertyForm({ ...propertyForm, agentId: e.target.value })
                    }
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                  >
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name} ({ag.position})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyForm.type}
                    onChange={(e: any) =>
                      setPropertyForm({ ...propertyForm, type: e.target.value })
                    }
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                  >
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Purpose
                  </label>
                  <select
                    value={propertyForm.listingType}
                    onChange={(e: any) =>
                      setPropertyForm({
                        ...propertyForm,
                        listingType: e.target.value,
                        status: e.target.value === 'sale' ? 'For Sale' : 'For Rent',
                      })
                    }
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    value={propertyForm.price}
                    onChange={(e) =>
                      setPropertyForm({ ...propertyForm, price: Number(e.target.value) })
                    }
                    required
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                  Architectural Description
                </label>
                <textarea
                  rows={3}
                  value={propertyForm.description}
                  onChange={(e) =>
                    setPropertyForm({ ...propertyForm, description: e.target.value })
                  }
                  required
                  className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={propertyForm.location?.city}
                    onChange={(e) =>
                      setPropertyForm({
                        ...propertyForm,
                        location: { ...propertyForm.location!, city: e.target.value },
                      })
                    }
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-1.5 text-xs text-[#F7F5F0]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Area / Sector
                  </label>
                  <input
                    type="text"
                    value={propertyForm.location?.area}
                    onChange={(e) =>
                      setPropertyForm({
                        ...propertyForm,
                        location: { ...propertyForm.location!, area: e.target.value },
                      })
                    }
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-1.5 text-xs text-[#F7F5F0]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={propertyForm.location?.address}
                    onChange={(e) =>
                      setPropertyForm({
                        ...propertyForm,
                        location: { ...propertyForm.location!, address: e.target.value },
                      })
                    }
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-1.5 text-xs text-[#F7F5F0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={propertyForm.details?.bedrooms}
                    onChange={(e) =>
                      setPropertyForm({
                        ...propertyForm,
                        details: { ...propertyForm.details!, bedrooms: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-1.5 text-xs text-[#F7F5F0]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={propertyForm.details?.bathrooms}
                    onChange={(e) =>
                      setPropertyForm({
                        ...propertyForm,
                        details: { ...propertyForm.details!, bathrooms: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-1.5 text-xs text-[#F7F5F0]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Area (sq ft)
                  </label>
                  <input
                    type="number"
                    value={propertyForm.details?.sqft}
                    onChange={(e) =>
                      setPropertyForm({
                        ...propertyForm,
                        details: { ...propertyForm.details!, sqft: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-1.5 text-xs text-[#F7F5F0]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Year Built
                  </label>
                  <input
                    type="number"
                    value={propertyForm.details?.yearBuilt}
                    onChange={(e) =>
                      setPropertyForm({
                        ...propertyForm,
                        details: { ...propertyForm.details!, yearBuilt: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-1.5 text-xs text-[#F7F5F0]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={propertyForm.media?.featuredImage}
                  onChange={(e) =>
                    setPropertyForm({
                      ...propertyForm,
                      media: { ...propertyForm.media!, featuredImage: e.target.value },
                    })
                  }
                  required
                  className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featCheck"
                  checked={propertyForm.isFeatured}
                  onChange={(e) =>
                    setPropertyForm({ ...propertyForm, isFeatured: e.target.checked })
                  }
                  className="rounded-xs bg-[#111]"
                />
                <label htmlFor="featCheck" className="text-xs text-[#D8C29D]">
                  Show in Curated Featured Collection
                </label>
              </div>

              <div className="pt-4 border-t border-[#262626] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPropertyModalOpen(false)}
                  className="px-5 py-2.5 bg-[#111111] border border-[#333] text-xs text-[#8E8E8E] rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#D8C29D]"
                >
                  {editingPropertyId ? 'Save Modifications' : 'Publish Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AGENT MODAL */}
      {agentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#181818] border border-[#2F2F2F] rounded-sm max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#262626] pb-4">
              <h3 className="font-serif text-2xl text-[#F7F5F0]">
                {editingAgentId ? 'Edit Advisory Partner' : 'Add New Advisor'}
              </h3>
              <button
                onClick={() => setAgentModalOpen(false)}
                className="text-xs uppercase text-[#8E8E8E]"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveAgent} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                  required
                  className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                  Position / Title *
                </label>
                <input
                  type="text"
                  value={agentForm.position}
                  onChange={(e) => setAgentForm({ ...agentForm, position: e.target.value })}
                  required
                  className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={agentForm.email}
                    onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                    required
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={agentForm.phone}
                    onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                    required
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                  Photo URL *
                </label>
                <input
                  type="url"
                  value={agentForm.photo}
                  onChange={(e) => setAgentForm({ ...agentForm, photo: e.target.value })}
                  required
                  className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                  Biography & Qualifications
                </label>
                <textarea
                  rows={3}
                  value={agentForm.bio}
                  onChange={(e) => setAgentForm({ ...agentForm, bio: e.target.value })}
                  className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0]"
                />
              </div>

              <div className="pt-3 border-t border-[#262626] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAgentModalOpen(false)}
                  className="px-5 py-2.5 bg-[#111] border border-[#333] text-xs text-[#8E8E8E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#B8955A] text-[#111] text-xs font-bold uppercase tracking-wider"
                >
                  Save Advisor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
