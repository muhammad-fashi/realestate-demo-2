import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WebsiteSettings } from '../types';
import { api, getStoredAdminToken, setStoredAdminToken } from '../lib/api';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: string;
}

interface AppContextType {
  // Navigation
  currentPath: string;
  navigate: (path: string, options?: { replace?: boolean }) => void;
  searchQuery: URLSearchParams;

  // Settings
  settings: WebsiteSettings | null;
  refreshSettings: () => Promise<void>;

  // Favorites
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;

  // Admin Auth
  isAdmin: boolean;
  adminUser: AdminUser | null;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Global Modals
  inquiryModal: {
    isOpen: boolean;
    propertyId?: string;
    propertyTitle?: string;
  };
  openInquiryModal: (propertyId?: string, propertyTitle?: string) => void;
  closeInquiryModal: () => void;

  viewingModal: {
    isOpen: boolean;
    propertyId?: string;
    propertyTitle?: string;
  };
  openViewingModal: (propertyId?: string, propertyTitle?: string) => void;
  closeViewingModal: () => void;
}

const defaultSettings: WebsiteSettings = {
  brandName: 'Aura Luxury Real Estate',
  tagline: 'Exceptional Properties. Remarkable Places.',
  logoText: 'AURA',
  contactPhone: '+92 (51) 844-9000',
  contactEmail: 'concierge@auraluxury.com',
  officeAddress: 'Floor 14, Aura Executive Tower, Jinnah Avenue, Blue Area, Islamabad',
  businessHours: 'Mon – Sat: 9:00 AM – 7:00 PM (Private viewings 24/7 by appointment)',
  heroTitle: 'Exceptional Properties. Remarkable Places.',
  heroSubtitle:
    'Discover thoughtfully curated luxury residences, penthouses, architectural homes, and premier investment properties across premier addresses.',
  heroImage:
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85',
  stats: {
    propertiesListed: '500+',
    successfulTransactions: '250+',
    yearsExperience: '16+',
    clientSatisfaction: '99%',
  },
  socialLinks: {
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    facebook: 'https://facebook.com',
  },
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state syncing with browser URL
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname + window.location.search
  );

  const navigate = useCallback((path: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const searchQuery = new URLSearchParams(window.location.search);

  // Settings state
  const [settings, setSettings] = useState<WebsiteSettings | null>(defaultSettings);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch {
      // fallback to default
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // Favorites state with localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('aura_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((p) => p !== id) : [...prev, id];
      localStorage.setItem('aura_favorites', JSON.stringify(updated));
      showToast(
        exists ? 'Property removed from saved collection' : 'Property added to your saved collection',
        'info'
      );
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  // Admin auth
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getStoredAdminToken();
      if (!token) {
        setIsAdmin(false);
        setAdminUser(null);
        return;
      }
      try {
        const res = await api.getMe();
        if (res.authenticated && res.user) {
          setIsAdmin(true);
          setAdminUser(res.user);
        } else {
          setIsAdmin(false);
          setAdminUser(null);
        }
      } catch {
        setIsAdmin(false);
        setAdminUser(null);
      }
    };
    checkAuth();
  }, []);

  const adminLogin = useCallback(async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setIsAdmin(true);
    setAdminUser(res.user);
    showToast('Administrator authenticated successfully', 'success');
  }, []);

  const adminLogout = useCallback(async () => {
    await api.logout();
    setIsAdmin(false);
    setAdminUser(null);
    showToast('Administrator signed out', 'info');
  }, []);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Global Modals
  const [inquiryModal, setInquiryModal] = useState<{
    isOpen: boolean;
    propertyId?: string;
    propertyTitle?: string;
  }>({ isOpen: false });

  const openInquiryModal = useCallback((propertyId?: string, propertyTitle?: string) => {
    setInquiryModal({ isOpen: true, propertyId, propertyTitle });
  }, []);

  const closeInquiryModal = useCallback(() => {
    setInquiryModal({ isOpen: false });
  }, []);

  const [viewingModal, setViewingModal] = useState<{
    isOpen: boolean;
    propertyId?: string;
    propertyTitle?: string;
  }>({ isOpen: false });

  const openViewingModal = useCallback((propertyId?: string, propertyTitle?: string) => {
    setViewingModal({ isOpen: true, propertyId, propertyTitle });
  }, []);

  const closeViewingModal = useCallback(() => {
    setViewingModal({ isOpen: false });
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        searchQuery,
        settings,
        refreshSettings,
        favorites,
        toggleFavorite,
        isFavorite,
        isAdmin,
        adminUser,
        adminLogin,
        adminLogout,
        toasts,
        showToast,
        removeToast,
        inquiryModal,
        openInquiryModal,
        closeInquiryModal,
        viewingModal,
        openViewingModal,
        closeViewingModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
