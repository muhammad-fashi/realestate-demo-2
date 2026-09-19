import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { DatabaseSchema, Property, Agent, Inquiry, ViewingRequest, ValuationRequest, BlogPost, Testimonial, WebsiteSettings } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

// Memory cache + disk persistence
let db: DatabaseSchema;

function loadDB(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(data);
      return db;
    }
  } catch (err) {
    console.error('Error reading db.json, initializing fallback', err);
  }
  return db;
}

function saveDB() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json', err);
  }
}

// Load initial database
loadDB();

// Active admin sessions tokens
const activeSessions = new Set<string>();
const DEFAULT_ADMIN_TOKEN = 'aura-admin-secure-token-2025';
activeSessions.add(DEFAULT_ADMIN_TOKEN);

function isAdmin(req: express.Request): boolean {
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-admin-token'] as string;
  const token = customHeader || (authHeader && authHeader.replace('Bearer ', ''));
  return !!token && activeSessions.has(token);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Auth endpoints
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    if (
      email.toLowerCase() === db.adminUser.email.toLowerCase() &&
      password === db.adminUser.passwordHash
    ) {
      const token = `aura-session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      activeSessions.add(token);
      res.json({
        token,
        user: {
          email: db.adminUser.email,
          name: db.adminUser.name,
          role: db.adminUser.role,
        },
      });
      return;
    }

    res.status(401).json({ error: 'Invalid administrator credentials' });
  });

  app.get('/api/auth/me', (req, res) => {
    if (!isAdmin(req)) {
      res.status(401).json({ authenticated: false });
      return;
    }
    res.json({
      authenticated: true,
      user: {
        email: db.adminUser.email,
        name: db.adminUser.name,
        role: db.adminUser.role,
      },
    });
  });

  app.post('/api/auth/logout', (req, res) => {
    const customHeader = req.headers['x-admin-token'] as string;
    const authHeader = req.headers.authorization;
    const token = customHeader || (authHeader && authHeader.replace('Bearer ', ''));
    if (token) {
      activeSessions.delete(token);
    }
    res.json({ success: true });
  });

  // ------------------------------------------
  // PROPERTIES API
  // ------------------------------------------
  app.get('/api/properties', (req, res) => {
    const adminMode = isAdmin(req) && req.query.admin === 'true';
    let list = db.properties;

    // If not admin mode, show only published properties
    if (!adminMode) {
      list = list.filter((p) => p.isPublished);
    }

    // Filter by type
    if (req.query.type && req.query.type !== 'all') {
      const type = (req.query.type as string).toLowerCase();
      list = list.filter((p) => p.type.toLowerCase() === type);
    }

    // Filter by listingType (sale / rent)
    if (req.query.listingType && req.query.listingType !== 'all') {
      const lt = (req.query.listingType as string).toLowerCase();
      list = list.filter((p) => p.listingType.toLowerCase() === lt);
    }

    // Filter by status
    if (req.query.status && req.query.status !== 'all') {
      const st = (req.query.status as string).toLowerCase();
      list = list.filter((p) => p.status.toLowerCase() === st);
    }

    // Filter by city / location
    if (req.query.city && req.query.city !== 'all') {
      const city = (req.query.city as string).toLowerCase();
      list = list.filter(
        (p) =>
          p.location.city.toLowerCase().includes(city) ||
          p.location.area.toLowerCase().includes(city) ||
          p.location.country.toLowerCase().includes(city)
      );
    }

    // Filter by featured
    if (req.query.featured === 'true') {
      list = list.filter((p) => p.isFeatured);
    }

    // Filter by bedrooms
    if (req.query.bedrooms && req.query.bedrooms !== 'any') {
      const beds = parseInt(req.query.bedrooms as string, 10);
      if (!isNaN(beds)) {
        list = list.filter((p) => p.details.bedrooms >= beds);
      }
    }

    // Filter by bathrooms
    if (req.query.bathrooms && req.query.bathrooms !== 'any') {
      const baths = parseInt(req.query.bathrooms as string, 10);
      if (!isNaN(baths)) {
        list = list.filter((p) => p.details.bathrooms >= baths);
      }
    }

    // Filter by price range
    if (req.query.minPrice) {
      const min = parseFloat(req.query.minPrice as string);
      if (!isNaN(min)) {
        list = list.filter((p) => p.price >= min);
      }
    }
    if (req.query.maxPrice) {
      const max = parseFloat(req.query.maxPrice as string);
      if (!isNaN(max)) {
        list = list.filter((p) => p.price <= max);
      }
    }

    // Filter by search keyword
    if (req.query.search) {
      const q = (req.query.search as string).toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.area.toLowerCase().includes(q) ||
          p.location.address.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      );
    }

    // Sort
    const sort = (req.query.sort as string) || 'newest';
    if (sort === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sort === 'area-desc') {
      list = [...list].sort((a, b) => b.details.sqft - a.details.sqft);
    } else if (sort === 'popular') {
      list = [...list].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    } else {
      // newest
      list = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const total = list.length;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 12;
    const paginated = list.slice((page - 1) * limit, page * limit);

    res.json({
      properties: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  });

  app.get('/api/properties/:idOrSlug', (req, res) => {
    const { idOrSlug } = req.params;
    const property = db.properties.find(
      (p) => p.id === idOrSlug || p.slug.toLowerCase() === idOrSlug.toLowerCase()
    );

    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    // Increment view count
    property.viewsCount = (property.viewsCount || 0) + 1;
    saveDB();

    // Find agent
    const agent = db.agents.find((a) => a.id === property.agentId);

    // Find similar properties
    const similar = db.properties
      .filter(
        (p) =>
          p.id !== property.id &&
          p.isPublished &&
          (p.type === property.type ||
            p.location.city === property.location.city ||
            p.listingType === property.listingType)
      )
      .slice(0, 4);

    res.json({ property, agent, similar });
  });

  // Admin create property
  app.post('/api/properties', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const body = req.body;
    const id = `prop-${Date.now()}`;
    const slug =
      body.slug ||
      (body.title || 'property')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newProperty: Property = {
      id,
      title: body.title || 'Untitled Luxury Property',
      slug,
      description: body.description || '',
      type: body.type || 'Villa',
      listingType: body.listingType || 'sale',
      status: body.status || 'For Sale',
      price: Number(body.price) || 0,
      currency: body.currency || 'USD',
      pricePeriod: body.pricePeriod,
      location: body.location || {
        country: 'Pakistan',
        state: 'Federal Territory',
        city: 'Islamabad',
        area: 'F-7',
        address: 'Islamabad',
      },
      details: body.details || {
        bedrooms: 4,
        bathrooms: 4,
        sqft: 3500,
      },
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
      media: body.media || {
        featuredImage:
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
        gallery: [],
      },
      agentId: body.agentId || (db.agents[0]?.id || 'agent-1'),
      isFeatured: !!body.isFeatured,
      isPublished: body.isPublished !== undefined ? !!body.isPublished : true,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seo: body.seo,
    };

    db.properties.unshift(newProperty);
    saveDB();
    res.status(201).json(newProperty);
  });

  // Admin update property
  app.put('/api/properties/:id', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const index = db.properties.findIndex((p) => p.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    const current = db.properties[index];
    const updated: Property = {
      ...current,
      ...req.body,
      id: current.id,
      updatedAt: new Date().toISOString(),
    };

    db.properties[index] = updated;
    saveDB();
    res.json(updated);
  });

  // Admin duplicate property
  app.post('/api/properties/:id/duplicate', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const source = db.properties.find((p) => p.id === id);
    if (!source) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    const duplicated: Property = {
      ...source,
      id: `prop-${Date.now()}`,
      title: `${source.title} (Copy)`,
      slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
      isPublished: false,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.properties.unshift(duplicated);
    saveDB();
    res.status(201).json(duplicated);
  });

  // Admin delete property
  app.delete('/api/properties/:id', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const initialLen = db.properties.length;
    db.properties = db.properties.filter((p) => p.id !== id);

    if (db.properties.length === initialLen) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    saveDB();
    res.json({ success: true, message: 'Property deleted successfully' });
  });

  // ------------------------------------------
  // AGENTS API
  // ------------------------------------------
  app.get('/api/agents', (req, res) => {
    res.json(db.agents);
  });

  app.get('/api/agents/:id', (req, res) => {
    const agent = db.agents.find((a) => a.id === req.params.id);
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }
    const assignedProperties = db.properties.filter(
      (p) => p.agentId === agent.id && p.isPublished
    );
    res.json({ agent, properties: assignedProperties });
  });

  app.post('/api/agents', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const id = `agent-${Date.now()}`;
    const newAgent: Agent = {
      id,
      name: req.body.name || 'New Agent',
      position: req.body.position || 'Property Consultant',
      bio: req.body.bio || '',
      photo:
        req.body.photo ||
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
      phone: req.body.phone || '+92 (51) 844-9000',
      email: req.body.email || 'agent@auraluxury.com',
      specialization: Array.isArray(req.body.specialization) ? req.body.specialization : [],
      social: req.body.social || {},
      active: req.body.active !== undefined ? !!req.body.active : true,
    };

    db.agents.push(newAgent);
    saveDB();
    res.status(201).json(newAgent);
  });

  app.put('/api/agents/:id', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const index = db.agents.findIndex((a) => a.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    db.agents[index] = {
      ...db.agents[index],
      ...req.body,
      id,
    };
    saveDB();
    res.json(db.agents[index]);
  });

  app.delete('/api/agents/:id', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    db.agents = db.agents.filter((a) => a.id !== req.params.id);
    saveDB();
    res.json({ success: true });
  });

  // ------------------------------------------
  // LEADS / INQUIRIES API
  // ------------------------------------------
  app.get('/api/inquiries', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }
    res.json(db.inquiries);
  });

  app.post('/api/inquiries', (req, res) => {
    const { name, email, phone, propertyId, propertyTitle, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email and message are required' });
      return;
    }

    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      propertyId,
      propertyTitle,
      subject: subject || 'General Inquiry',
      message,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    db.inquiries.unshift(newInquiry);
    saveDB();
    res.status(201).json({ success: true, inquiry: newInquiry });
  });

  app.patch('/api/inquiries/:id', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const item = db.inquiries.find((i) => i.id === req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    if (req.body.status) item.status = req.body.status;
    if (req.body.notes !== undefined) item.notes = req.body.notes;

    saveDB();
    res.json(item);
  });

  // ------------------------------------------
  // VIEWING REQUESTS API
  // ------------------------------------------
  app.get('/api/viewings', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }
    res.json(db.viewings);
  });

  app.post('/api/viewings', (req, res) => {
    const { name, email, phone, propertyId, propertyTitle, preferredDate, preferredTime, message } =
      req.body;

    if (!name || !email || !preferredDate) {
      res.status(400).json({ error: 'Name, email, and preferred date are required' });
      return;
    }

    const newViewing: ViewingRequest = {
      id: `view-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      propertyId: propertyId || '',
      propertyTitle: propertyTitle || 'Selected Property',
      preferredDate,
      preferredTime: preferredTime || 'Morning (10:00 AM)',
      message,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    db.viewings.unshift(newViewing);
    saveDB();
    res.status(201).json({ success: true, viewing: newViewing });
  });

  app.patch('/api/viewings/:id', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const item = db.viewings.find((v) => v.id === req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Viewing not found' });
      return;
    }

    if (req.body.status) item.status = req.body.status;
    saveDB();
    res.json(item);
  });

  // ------------------------------------------
  // SELL / VALUATION REQUESTS API
  // ------------------------------------------
  app.get('/api/valuations', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }
    res.json(db.valuations);
  });

  app.post('/api/valuations', (req, res) => {
    const { ownerName, email, phone, propertyAddress, propertyType, estimatedValue, message, images } =
      req.body;

    if (!ownerName || !email || !propertyAddress) {
      res.status(400).json({ error: 'Owner name, email, and address are required' });
      return;
    }

    const newValuation: ValuationRequest = {
      id: `val-${Date.now()}`,
      ownerName,
      email,
      phone: phone || '',
      propertyAddress,
      propertyType: propertyType || 'House',
      estimatedValue,
      message,
      images: Array.isArray(images) ? images : [],
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    db.valuations.unshift(newValuation);
    saveDB();
    res.status(201).json({ success: true, valuation: newValuation });
  });

  app.patch('/api/valuations/:id', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const item = db.valuations.find((v) => v.id === req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Valuation not found' });
      return;
    }

    if (req.body.status) item.status = req.body.status;
    saveDB();
    res.json(item);
  });

  // ------------------------------------------
  // BLOGS API
  // ------------------------------------------
  app.get('/api/blogs', (req, res) => {
    const adminMode = isAdmin(req) && req.query.admin === 'true';
    let blogs = db.blogs;
    if (!adminMode) {
      blogs = blogs.filter((b) => b.published);
    }
    if (req.query.category && req.query.category !== 'all') {
      const cat = (req.query.category as string).toLowerCase();
      blogs = blogs.filter((b) => b.category.toLowerCase() === cat);
    }
    res.json(blogs);
  });

  app.get('/api/blogs/:slug', (req, res) => {
    const post = db.blogs.find(
      (b) => b.slug.toLowerCase() === req.params.slug.toLowerCase() || b.id === req.params.slug
    );
    if (!post) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }
    const related = db.blogs.filter((b) => b.id !== post.id && b.published).slice(0, 3);
    res.json({ post, related });
  });

  app.post('/api/blogs', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const id = `blog-${Date.now()}`;
    const slug =
      req.body.slug ||
      (req.body.title || 'article')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newPost: BlogPost = {
      id,
      title: req.body.title || 'Untitled Post',
      slug,
      excerpt: req.body.excerpt || '',
      content: req.body.content || '',
      category: req.body.category || 'Real Estate News',
      author: req.body.author || {
        name: 'Alexander Vance',
        role: 'Principal Partner',
        avatar:
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      },
      featuredImage:
        req.body.featuredImage ||
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      readTime: req.body.readTime || '5 min read',
      published: req.body.published !== undefined ? !!req.body.published : true,
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    };

    db.blogs.unshift(newPost);
    saveDB();
    res.status(201).json(newPost);
  });

  app.put('/api/blogs/:id', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const index = db.blogs.findIndex((b) => b.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    db.blogs[index] = { ...db.blogs[index], ...req.body, id: req.params.id };
    saveDB();
    res.json(db.blogs[index]);
  });

  app.delete('/api/blogs/:id', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    db.blogs = db.blogs.filter((b) => b.id !== req.params.id);
    saveDB();
    res.json({ success: true });
  });

  // ------------------------------------------
  // TESTIMONIALS API
  // ------------------------------------------
  app.get('/api/testimonials', (req, res) => {
    res.json(db.testimonials.filter((t) => t.active));
  });

  app.post('/api/testimonials', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const newTestimonial: Testimonial = {
      id: `test-${Date.now()}`,
      name: req.body.name || 'Anonymous Client',
      role: req.body.role || 'Property Buyer',
      company: req.body.company,
      review: req.body.review || '',
      rating: req.body.rating || 5,
      photo:
        req.body.photo ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      active: true,
    };

    db.testimonials.push(newTestimonial);
    saveDB();
    res.status(201).json(newTestimonial);
  });

  app.delete('/api/testimonials/:id', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    db.testimonials = db.testimonials.filter((t) => t.id !== req.params.id);
    saveDB();
    res.json({ success: true });
  });

  // ------------------------------------------
  // SETTINGS API
  // ------------------------------------------
  app.get('/api/settings', (req, res) => {
    res.json(db.settings);
  });

  app.put('/api/settings', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    db.settings = { ...db.settings, ...req.body };
    saveDB();
    res.json(db.settings);
  });

  // ------------------------------------------
  // DASHBOARD STATS API
  // ------------------------------------------
  app.get('/api/stats', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const totalProperties = db.properties.length;
    const published = db.properties.filter((p) => p.isPublished).length;
    const drafts = db.properties.filter((p) => !p.isPublished).length;
    const featured = db.properties.filter((p) => p.isFeatured).length;
    const forSale = db.properties.filter((p) => p.listingType === 'sale').length;
    const forRent = db.properties.filter((p) => p.listingType === 'rent').length;
    const newInquiries = db.inquiries.filter((i) => i.status === 'New').length;
    const pendingViewings = db.viewings.filter((v) => v.status === 'Pending').length;
    const valuations = db.valuations.length;

    // Location breakdown
    const locationsMap: Record<string, number> = {};
    db.properties.forEach((p) => {
      const loc = p.location.city || 'Other';
      locationsMap[loc] = (locationsMap[loc] || 0) + 1;
    });

    // Type breakdown
    const typeMap: Record<string, number> = {};
    db.properties.forEach((p) => {
      typeMap[p.type] = (typeMap[p.type] || 0) + 1;
    });

    res.json({
      summary: {
        totalProperties,
        published,
        drafts,
        featured,
        forSale,
        forRent,
        newInquiries,
        pendingViewings,
        valuations,
      },
      locations: Object.entries(locationsMap).map(([name, count]) => ({ name, count })),
      types: Object.entries(typeMap).map(([name, count]) => ({ name, count })),
      recentInquiries: db.inquiries.slice(0, 5),
      recentViewings: db.viewings.slice(0, 5),
    });
  });

  // ------------------------------------------
  // IMAGE / ASSET UPLOAD
  // ------------------------------------------
  app.post('/api/upload', (req, res) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      res.status(400).json({ error: 'Image data is required' });
      return;
    }

    // In a production server, this saves to storage or returns data URL
    // To ensure 100% reliable preview rendering without complex external storage setup:
    res.json({
      url: imageBase64,
      filename: filename || `property-photo-${Date.now()}.jpg`,
    });
  });

  // ==========================================
  // VITE / SPA MIDDLEWARE
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aura Real Estate Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
