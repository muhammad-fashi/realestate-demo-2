import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Heart, Menu, X, ArrowRight, Phone } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPath, navigate, settings, favorites, openInquiryModal } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = currentPath === '/' || currentPath === '';

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      setSearchOpen(false);
      navigate(`/properties?search=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Buy', path: '/buy' },
    { name: 'Rent', path: '/rent' },
    { name: 'Sell', path: '/sell' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Agents', path: '/agents' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled || !isHome
            ? 'bg-[#111111]/90 backdrop-blur-md border-b border-[#2A2A2A] shadow-lg py-3.5'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* LEFT: Logo */}
          <div
            onClick={() => handleNav('/')}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-sm border border-[#B8955A] flex items-center justify-center bg-[#1C1C1C] transition-transform duration-300 group-hover:scale-105">
              <span className="font-serif text-lg font-bold text-[#B8955A] tracking-wider">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-[#F7F5F0] uppercase">
                {settings?.logoText || 'AURA'}
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#B8955A] -mt-1 font-medium">
                Luxury Real Estate
              </span>
            </div>
          </div>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.slice(0, 7).map((item) => {
              const active = currentPath === item.path || currentPath.startsWith(item.path + '?');
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`text-sm tracking-wider uppercase transition-colors relative py-1 font-medium ${
                    active
                      ? 'text-[#B8955A]'
                      : 'text-[#D8C29D]/80 hover:text-[#F7F5F0]'
                  }`}
                >
                  {item.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B8955A]" />
                  )}
                </button>
              );
            })}
            <button
              onClick={() => handleNav('/contact')}
              className="text-sm tracking-wider uppercase transition-colors py-1 font-medium text-[#D8C29D]/80 hover:text-[#F7F5F0]"
            >
              Contact
            </button>
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Icon Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full text-[#D8C29D]/80 hover:text-[#F7F5F0] hover:bg-[#1C1C1C] transition-all"
              title="Search Properties"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Saved / Favorites Icon */}
            <button
              onClick={() => handleNav('/favorites')}
              className="p-2.5 rounded-full text-[#D8C29D]/80 hover:text-[#F7F5F0] hover:bg-[#1C1C1C] transition-all relative"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#B8955A] text-[#111111] text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Book Consultation CTA Button */}
            <button
              onClick={() => openInquiryModal(undefined, 'VIP Private Consultation')}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#B8955A] text-[#111111] text-xs uppercase tracking-widest font-semibold hover:bg-[#D8C29D] transition-all duration-300 shadow-md hover:shadow-[#B8955A]/20"
            >
              <span>Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-sm text-[#F7F5F0] hover:bg-[#1C1C1C] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Inline Quick Search Dropdown Bar */}
        {searchOpen && (
          <div className="max-w-4xl mx-auto px-4 pt-3 pb-2 transition-all">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-[#B8955A]" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search by city, sector (e.g. E-7, Downtown), or property style..."
                className="w-full pl-12 pr-28 py-3.5 bg-[#1C1C1C] border border-[#B8955A]/50 rounded-sm text-sm text-[#F7F5F0] placeholder-[#6B6B6B] focus:outline-none focus:border-[#B8955A] shadow-2xl"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-[#B8955A] text-[#111111] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#D8C29D] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-[#111111]/98 backdrop-blur-xl flex flex-col justify-between p-6 overflow-y-auto animate-fadeIn">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#2A2A2A]">
              <div
                onClick={() => handleNav('/')}
                className="cursor-pointer flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-sm border border-[#B8955A] flex items-center justify-center bg-[#1C1C1C]">
                  <span className="font-serif text-base font-bold text-[#B8955A]">A</span>
                </div>
                <span className="font-serif text-xl font-bold tracking-widest text-[#F7F5F0] uppercase">
                  {settings?.logoText || 'AURA'}
                </span>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#6B6B6B] hover:text-[#F7F5F0]"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4 py-8">
              {navLinks.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className="text-left font-serif text-2xl text-[#F7F5F0] hover:text-[#B8955A] transition-colors flex items-center justify-between py-2 border-b border-[#1C1C1C]"
                >
                  <span>{item.name}</span>
                  <ArrowRight className="w-5 h-5 text-[#B8955A]/50" />
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-[#2A2A2A] space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openInquiryModal(undefined, 'Mobile Consultation Request');
              }}
              className="w-full py-4 rounded-sm bg-[#B8955A] text-[#111111] text-center font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <span>Book VIP Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-[#6B6B6B]">
              <Phone className="w-3.5 h-3.5 text-[#B8955A]" />
              <span>{settings?.contactPhone || '+92 (51) 844-9000'}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
