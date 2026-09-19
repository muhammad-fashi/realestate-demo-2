export type PropertyType =
  | 'House'
  | 'Villa'
  | 'Apartment'
  | 'Penthouse'
  | 'Townhouse'
  | 'Commercial'
  | 'Office'
  | 'Land';

export type ListingType = 'sale' | 'rent';

export type PropertyStatus =
  | 'For Sale'
  | 'For Rent'
  | 'Sold'
  | 'Rented'
  | 'Coming Soon'
  | 'Off Market';

export interface PropertyLocation {
  country: string;
  state: string;
  city: string;
  area: string;
  address: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
  nearby?: {
    schools?: string;
    hospitals?: string;
    shopping?: string;
    transit?: string;
    airports?: string;
  };
}

export interface PropertyDetails {
  bedrooms: number;
  bathrooms: number;
  garage?: number;
  parking?: number;
  sqft: number;
  lotSqft?: number;
  yearBuilt?: number;
}

export interface PropertyMedia {
  featuredImage: string;
  gallery: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
}

export interface PropertySEO {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  price: number;
  currency: 'USD' | 'PKR' | 'AED' | 'GBP';
  pricePeriod?: 'month' | 'year';
  location: PropertyLocation;
  details: PropertyDetails;
  amenities: string[];
  media: PropertyMedia;
  agentId: string;
  isFeatured: boolean;
  isPublished: boolean;
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
  seo?: PropertySEO;
}

export interface Agent {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo: string;
  phone: string;
  email: string;
  specialization: string[];
  social: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
  active: boolean;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  subject?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Viewing Scheduled' | 'Closed';
  createdAt: string;
  notes?: string;
}

export interface ViewingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyTitle: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface ValuationRequest {
  id: string;
  ownerName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  propertyType: string;
  estimatedValue?: string;
  message?: string;
  images?: string[];
  status: 'New' | 'Reviewing' | 'Valuation Sent' | 'Closed';
  createdAt: string;
}

export type BlogCategory =
  | 'Real Estate News'
  | 'Buying Guide'
  | 'Selling Guide'
  | 'Investment'
  | 'Market Insights'
  | 'Home & Lifestyle';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  featuredImage: string;
  date: string;
  readTime: string;
  published: boolean;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  review: string;
  rating: number;
  photo: string;
  active: boolean;
}

export interface WebsiteSettings {
  brandName: string;
  tagline: string;
  logoText: string;
  contactPhone: string;
  contactEmail: string;
  officeAddress: string;
  businessHours: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  stats: {
    propertiesListed: string;
    successfulTransactions: string;
    yearsExperience: string;
    clientSatisfaction: string;
  };
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    facebook?: string;
  };
}

export interface DatabaseSchema {
  properties: Property[];
  agents: Agent[];
  inquiries: Inquiry[];
  viewings: ViewingRequest[];
  valuations: ValuationRequest[];
  blogs: BlogPost[];
  testimonials: Testimonial[];
  settings: WebsiteSettings;
  adminUser: {
    email: string;
    passwordHash: string; // simple verification in demo
    name: string;
    role: string;
  };
}
