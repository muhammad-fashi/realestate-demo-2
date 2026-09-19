import { Property, Agent, Inquiry, ViewingRequest, ValuationRequest, BlogPost, Testimonial, WebsiteSettings } from '../types';

const ADMIN_TOKEN_KEY = 'aura_admin_token';

export function getStoredAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setStoredAdminToken(token: string | null) {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredAdminToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['x-admin-token'] = token;
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Login failed');
    }
    const data = await res.json();
    setStoredAdminToken(data.token);
    return data;
  },

  async getMe() {
    const token = getStoredAdminToken();
    if (!token) return { authenticated: false };
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      setStoredAdminToken(null);
      return { authenticated: false };
    }
    return res.json();
  },

  async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch {
      // ignore
    }
    setStoredAdminToken(null);
  },

  // Properties
  async getProperties(params: Record<string, string | number | boolean | undefined> = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.set(key, String(val));
      }
    });

    const res = await fetch(`/api/properties?${searchParams.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch properties');
    return res.json() as Promise<{
      properties: Property[];
      total: number;
      page: number;
      totalPages: number;
    }>;
  },

  async getProperty(idOrSlug: string) {
    const res = await fetch(`/api/properties/${encodeURIComponent(idOrSlug)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch property');
    }
    return res.json() as Promise<{
      property: Property;
      agent?: Agent;
      similar: Property[];
    }>;
  },

  async createProperty(data: Partial<Property>) {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create property' }));
      throw new Error(err.error || 'Failed to create property');
    }
    return res.json() as Promise<Property>;
  },

  async updateProperty(id: string, data: Partial<Property>) {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update property' }));
      throw new Error(err.error || 'Failed to update property');
    }
    return res.json() as Promise<Property>;
  },

  async duplicateProperty(id: string) {
    const res = await fetch(`/api/properties/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to duplicate property');
    return res.json() as Promise<Property>;
  },

  async deleteProperty(id: string) {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete property');
    return res.json();
  },

  // Agents
  async getAgents() {
    const res = await fetch('/api/agents');
    if (!res.ok) throw new Error('Failed to fetch agents');
    return res.json() as Promise<Agent[]>;
  },

  async getAgent(id: string) {
    const res = await fetch(`/api/agents/${id}`);
    if (!res.ok) return null;
    return res.json() as Promise<{ agent: Agent; properties: Property[] }>;
  },

  async createAgent(data: Partial<Agent>) {
    const res = await fetch('/api/agents', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create agent');
    return res.json() as Promise<Agent>;
  },

  async updateAgent(id: string, data: Partial<Agent>) {
    const res = await fetch(`/api/agents/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update agent');
    return res.json() as Promise<Agent>;
  },

  async deleteAgent(id: string) {
    const res = await fetch(`/api/agents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete agent');
    return res.json();
  },

  // Inquiries
  async submitInquiry(data: Partial<Inquiry>) {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to submit inquiry' }));
      throw new Error(err.error || 'Failed to submit inquiry');
    }
    return res.json();
  },

  async getInquiries() {
    const res = await fetch('/api/inquiries', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch inquiries');
    return res.json() as Promise<Inquiry[]>;
  },

  async updateInquiryStatus(id: string, status: string, notes?: string) {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) throw new Error('Failed to update inquiry');
    return res.json();
  },

  // Viewing Requests
  async submitViewing(data: Partial<ViewingRequest>) {
    const res = await fetch('/api/viewings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to submit viewing request' }));
      throw new Error(err.error || 'Failed to submit viewing request');
    }
    return res.json();
  },

  async getViewings() {
    const res = await fetch('/api/viewings', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch viewings');
    return res.json() as Promise<ViewingRequest[]>;
  },

  async updateViewingStatus(id: string, status: string) {
    const res = await fetch(`/api/viewings/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update viewing status');
    return res.json();
  },

  // Valuation Requests
  async submitValuation(data: Partial<ValuationRequest>) {
    const res = await fetch('/api/valuations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to submit valuation' }));
      throw new Error(err.error || 'Failed to submit valuation');
    }
    return res.json();
  },

  async getValuations() {
    const res = await fetch('/api/valuations', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch valuations');
    return res.json() as Promise<ValuationRequest[]>;
  },

  async updateValuationStatus(id: string, status: string) {
    const res = await fetch(`/api/valuations/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update valuation status');
    return res.json();
  },

  // Blogs
  async getBlogs(params: { category?: string; admin?: boolean } = {}) {
    const sp = new URLSearchParams();
    if (params.category) sp.set('category', params.category);
    if (params.admin) sp.set('admin', 'true');
    const res = await fetch(`/api/blogs?${sp.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json() as Promise<BlogPost[]>;
  },

  async getBlog(slug: string) {
    const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    return res.json() as Promise<{ post: BlogPost; related: BlogPost[] }>;
  },

  async createBlog(data: Partial<BlogPost>) {
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create blog post');
    return res.json() as Promise<BlogPost>;
  },

  async updateBlog(id: string, data: Partial<BlogPost>) {
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update blog post');
    return res.json() as Promise<BlogPost>;
  },

  async deleteBlog(id: string) {
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete blog post');
    return res.json();
  },

  // Testimonials
  async getTestimonials() {
    const res = await fetch('/api/testimonials');
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    return res.json() as Promise<Testimonial[]>;
  },

  async createTestimonial(data: Partial<Testimonial>) {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create testimonial');
    return res.json() as Promise<Testimonial>;
  },

  async deleteTestimonial(id: string) {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete testimonial');
    return res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json() as Promise<WebsiteSettings>;
  },

  async updateSettings(data: Partial<WebsiteSettings>) {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json() as Promise<WebsiteSettings>;
  },

  // Dashboard Stats
  async getDashboardStats() {
    const res = await fetch('/api/stats', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },
};
