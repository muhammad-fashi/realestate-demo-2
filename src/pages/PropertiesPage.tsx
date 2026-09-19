import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const PropertiesPage: React.FC = () => {
  const { currentPath, navigate } = useApp();

  // Parse current URL search params
  const [searchKeyword, setSearchKeyword] = useState('');
  const [listingType, setListingType] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [city, setCity] = useState('all');
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Data state
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Initialize filters from URL on mount and path change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('search')) setSearchKeyword(params.get('search') || '');
    if (params.get('listingType')) setListingType(params.get('listingType') || 'all');
    if (params.get('type')) setPropertyType(params.get('type') || 'all');
    if (params.get('city')) setCity(params.get('city') || 'all');
    if (params.get('bedrooms')) setBedrooms(params.get('bedrooms') || 'any');
    if (params.get('bathrooms')) setBathrooms(params.get('bathrooms') || 'any');
    if (params.get('minPrice')) setMinPrice(params.get('minPrice') || '');
    if (params.get('maxPrice')) setMaxPrice(params.get('maxPrice') || '');
    if (params.get('featured') === 'true') setFeaturedOnly(true);
    if (params.get('sort')) setSortBy(params.get('sort') || 'newest');
    if (params.get('page')) setPage(parseInt(params.get('page') || '1', 10));
  }, [currentPath]);

  // Fetch properties from server
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getProperties({
        search: searchKeyword || undefined,
        listingType: listingType !== 'all' ? listingType : undefined,
        type: propertyType !== 'all' ? propertyType : undefined,
        city: city !== 'all' ? city : undefined,
        bedrooms: bedrooms !== 'any' ? bedrooms : undefined,
        bathrooms: bathrooms !== 'any' ? bathrooms : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        featured: featuredOnly ? true : undefined,
        sort: sortBy,
        page,
        limit: 12,
      });

      let filtered = res.properties;
      // Client-side amenity filter if selected
      if (selectedAmenities.length > 0) {
        filtered = filtered.filter((p) =>
          selectedAmenities.every((amenity) => p.amenities?.includes(amenity))
        );
      }

      setProperties(filtered);
      setTotalCount(selectedAmenities.length > 0 ? filtered.length : res.total);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Error fetching properties', err);
    } finally {
      setLoading(false);
    }
  }, [
    searchKeyword,
    listingType,
    propertyType,
    city,
    bedrooms,
    bathrooms,
    minPrice,
    maxPrice,
    featuredOnly,
    selectedAmenities,
    sortBy,
    page,
  ]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Sync state changes with URL query parameters
  const updateUrlParams = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== 'any') {
        params.set(k, v);
      } else {
        params.delete(k);
      }
    });
    navigate(`/properties?${params.toString()}`, { replace: true });
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setListingType('all');
    setPropertyType('all');
    setCity('all');
    setBedrooms('any');
    setBathrooms('any');
    setMinPrice('');
    setMaxPrice('');
    setFeaturedOnly(false);
    setSelectedAmenities([]);
    setSortBy('newest');
    setPage(1);
    navigate('/properties', { replace: true });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const allAmenitiesList = [
    'Swimming Pool',
    'Private Garden',
    'Smart Home',
    '24/7 Security',
    'Gym / Wellness Suite',
    'Central Air Conditioning',
    'Central Heating',
    'Elevator',
    'Balcony / Terrace',
    'Staff Quarters',
    'Wine Cellar',
    'Marble Flooring',
    'Valet Parking',
  ];

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Banner & Header */}
      <div className="border-b border-[#242424] pb-8">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block mb-2">
          Curated Marketplace
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0]">Explore Properties</h1>
        <p className="text-sm text-[#8E8E8E] mt-2 max-w-2xl">
          Find a property that fits your lifestyle, goals, and budget. Browse our portfolio of prime
          villas, sky penthouses, and architectural landmarks.
        </p>
      </div>

      {/* Control Bar: Search input + View toggle + Mobile filter button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#161616] p-4 rounded-sm border border-[#262626]">
        {/* Search Keyword */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#B8955A] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              updateUrlParams({ search: e.target.value || undefined, page: '1' });
            }}
            placeholder="Search address, neighborhood, style..."
            className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm pl-10 pr-4 py-2 text-xs text-[#F7F5F0] placeholder-[#555] focus:outline-none focus:border-[#B8955A]"
          />
        </div>

        {/* Right tools */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden px-4 py-2 bg-[#1C1C1C] border border-[#333] rounded-sm text-xs text-[#F7F5F0] flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>Filters</span>
          </button>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#8E8E8E] uppercase tracking-wider hidden sm:inline">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateUrlParams({ sort: e.target.value });
              }}
              className="bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="area-desc">Largest Area (sq ft)</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Grid / List Layout Toggle */}
          <div className="flex items-center border border-[#2E2E2E] rounded-sm overflow-hidden">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-2 transition-colors ${
                layoutMode === 'grid'
                  ? 'bg-[#B8955A] text-[#111111]'
                  : 'bg-[#111111] text-[#8E8E8E] hover:text-[#F7F5F0]'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-2 transition-colors ${
                layoutMode === 'list'
                  ? 'bg-[#B8955A] text-[#111111]'
                  : 'bg-[#111111] text-[#8E8E8E] hover:text-[#F7F5F0]'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* ================================================= */}
        {/* DESKTOP FILTER SIDEBAR */}
        {/* ================================================= */}
        <aside
          className={`lg:block ${
            mobileFiltersOpen
              ? 'fixed inset-0 z-50 bg-[#141414] p-6 overflow-y-auto'
              : 'hidden'
          } lg:relative lg:inset-auto lg:p-6 lg:bg-[#161616] lg:border lg:border-[#262626] rounded-sm space-y-6`}
        >
          {mobileFiltersOpen && (
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A] lg:hidden">
              <span className="font-serif text-lg text-[#F7F5F0]">Filters</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-xs uppercase tracking-widest text-[#B8955A] font-semibold"
              >
                Done
              </button>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#F7F5F0] font-semibold">
              <Filter className="w-3.5 h-3.5 text-[#B8955A]" />
              <span>Filter Portfolio</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[#8E8E8E] hover:text-[#B8955A] flex items-center gap-1 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Purpose (Buy / Rent) */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-medium block">
              Purpose
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#111111] p-1 rounded-sm border border-[#2E2E2E]">
              {['all', 'sale', 'rent'].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setListingType(val);
                    updateUrlParams({ listingType: val, page: '1' });
                  }}
                  className={`py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-colors ${
                    listingType === val
                      ? 'bg-[#B8955A] text-[#111111]'
                      : 'text-[#8E8E8E] hover:text-[#F7F5F0]'
                  }`}
                >
                  {val === 'all' ? 'All' : val === 'sale' ? 'Buy' : 'Rent'}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-medium block">
              Location / City
            </label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                updateUrlParams({ city: e.target.value, page: '1' });
              }}
              className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
            >
              <option value="all">All Locations</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Lahore">Lahore</option>
              <option value="Dubai">Dubai</option>
              <option value="London">London</option>
            </select>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-medium block">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => {
                setPropertyType(e.target.value);
                updateUrlParams({ type: e.target.value, page: '1' });
              }}
              className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
            >
              <option value="all">All Types</option>
              <option value="Villa">Villa</option>
              <option value="House">House</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Apartment">Apartment</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Commercial">Commercial</option>
              <option value="Land">Land</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-medium block">
              Price Range (USD)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  updateUrlParams({ minPrice: e.target.value || undefined, page: '1' });
                }}
                placeholder="Min Price"
                className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-2 text-xs text-[#F7F5F0] placeholder-[#555] focus:outline-none focus:border-[#B8955A]"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  updateUrlParams({ maxPrice: e.target.value || undefined, page: '1' });
                }}
                placeholder="Max Price"
                className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-2 text-xs text-[#F7F5F0] placeholder-[#555] focus:outline-none focus:border-[#B8955A]"
              />
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-medium block">
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => {
                  setBedrooms(e.target.value);
                  updateUrlParams({ bedrooms: e.target.value, page: '1' });
                }}
                className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
              >
                <option value="any">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-medium block">
                Bathrooms
              </label>
              <select
                value={bathrooms}
                onChange={(e) => {
                  setBathrooms(e.target.value);
                  updateUrlParams({ bathrooms: e.target.value, page: '1' });
                }}
                className="w-full bg-[#111111] border border-[#2E2E2E] rounded-sm px-2.5 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#B8955A]"
              >
                <option value="any">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          {/* Featured Only Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#D8C29D]">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => {
                  setFeaturedOnly(e.target.checked);
                  updateUrlParams({
                    featured: e.target.checked ? 'true' : undefined,
                    page: '1',
                  });
                }}
                className="rounded-xs border-[#333] text-[#B8955A] focus:ring-0 bg-[#111]"
              />
              <span>Show Featured Only</span>
            </label>
          </div>

          {/* Amenities Filter Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-[#262626]">
            <label className="text-[11px] uppercase tracking-wider text-[#A3A3A3] font-medium block">
              Amenities & Specs
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {allAmenitiesList.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 cursor-pointer text-xs text-[#A3A3A3] hover:text-[#F7F5F0]"
                  >
                    <div
                      onClick={() => toggleAmenity(amenity)}
                      className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center transition-colors ${
                        checked
                          ? 'bg-[#B8955A] border-[#B8955A] text-[#111]'
                          : 'border-[#333] bg-[#111]'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span onClick={() => toggleAmenity(amenity)}>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ================================================= */}
        {/* PROPERTY LISTING GRID / LIST */}
        {/* ================================================= */}
        <div className="lg:col-span-3 space-y-8">
          {/* Result Count Status */}
          <div className="flex items-center justify-between text-xs text-[#8E8E8E] px-1">
            <span>
              Showing <strong className="text-[#F7F5F0]">{properties.length}</strong> of{' '}
              <strong className="text-[#F7F5F0]">{totalCount}</strong> properties
            </span>
            {(listingType !== 'all' || propertyType !== 'all' || city !== 'all') && (
              <span className="text-[#B8955A] font-medium">Filtered results</span>
            )}
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div
              className={`grid ${
                layoutMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              } gap-6`}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 bg-[#161616] rounded-sm animate-pulse border border-[#262626]"
                />
              ))}
            </div>
          ) : properties.length === 0 ? (
            /* Empty State */
            <div className="bg-[#161616] border border-[#262626] rounded-sm p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#1C1C1C] border border-[#333] flex items-center justify-center text-[#B8955A] mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#F7F5F0]">No properties found</h3>
              <p className="text-xs text-[#8E8E8E] max-w-md mx-auto leading-relaxed">
                Try adjusting your search filters or explore another location. You can also reset all
                filters to view our complete collection.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#B8955A] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D8C29D] transition-colors inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            </div>
          ) : (
            /* Properties Grid / List */
            <div
              className={`grid ${
                layoutMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              } gap-6`}
            >
              {properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} layout={layoutMode} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-8 border-t border-[#222222] flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => {
                  const p = Math.max(1, page - 1);
                  setPage(p);
                  updateUrlParams({ page: String(p) });
                }}
                className="p-2.5 rounded-sm bg-[#161616] border border-[#2E2E2E] text-[#F7F5F0] hover:border-[#B8955A] disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 text-xs font-medium">
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        setPage(p);
                        updateUrlParams({ page: String(p) });
                      }}
                      className={`w-9 h-9 rounded-sm flex items-center justify-center transition-colors ${
                        page === p
                          ? 'bg-[#B8955A] text-[#111111] font-bold'
                          : 'bg-[#161616] border border-[#2E2E2E] text-[#8E8E8E] hover:text-[#F7F5F0]'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => {
                  const p = Math.min(totalPages, page + 1);
                  setPage(p);
                  updateUrlParams({ page: String(p) });
                }}
                className="p-2.5 rounded-sm bg-[#161616] border border-[#2E2E2E] text-[#F7F5F0] hover:border-[#B8955A] disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
