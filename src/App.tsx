import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { InquiryModal } from './components/InquiryModal';
import { ViewingModal } from './components/ViewingModal';

// Pages
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { BuyPage } from './pages/BuyPage';
import { RentPage } from './pages/RentPage';
import { SellPage } from './pages/SellPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { AgentsPage } from './pages/AgentsPage';
import { AgentDetailPage } from './pages/AgentDetailPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppRouter: React.FC = () => {
  const { currentPath } = useApp();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentPath]);

  // Route matching
  const pathname = currentPath.split('?')[0];

  // Match /properties/:slug
  if (pathname.startsWith('/properties/') && pathname.length > '/properties/'.length) {
    const slug = pathname.substring('/properties/'.length);
    return <PropertyDetailPage slug={slug} />;
  }

  // Match /agents/:id
  if (pathname.startsWith('/agents/') && pathname.length > '/agents/'.length) {
    const id = pathname.substring('/agents/'.length);
    return <AgentDetailPage id={id} />;
  }

  // Match /blog/:slug
  if (pathname.startsWith('/blog/') && pathname.length > '/blog/'.length) {
    const slug = pathname.substring('/blog/'.length);
    return <BlogDetailPage slug={slug} />;
  }

  switch (pathname) {
    case '/':
      return <HomePage />;
    case '/properties':
      return <PropertiesPage />;
    case '/buy':
      return <BuyPage />;
    case '/rent':
      return <RentPage />;
    case '/sell':
      return <SellPage />;
    case '/about':
      return <AboutPage />;
    case '/services':
      return <ServicesPage />;
    case '/agents':
      return <AgentsPage />;
    case '/contact':
      return <ContactPage />;
    case '/blog':
      return <BlogPage />;
    case '/favorites':
      return <FavoritesPage />;
    case '/privacy':
      return <PrivacyPolicyPage />;
    case '/terms':
      return <TermsPage />;
    case '/admin':
      return <AdminPage />;
    default:
      return <NotFoundPage />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#111111] text-[#F7F5F0] flex flex-col selection:bg-[#B8955A] selection:text-[#111111]">
        {/* Navigation Header */}
        <Header />

        {/* Main Content Router */}
        <main className="flex-grow">
          <AppRouter />
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Modals & Notifications */}
        <InquiryModal />
        <ViewingModal />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
