import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { BlogPost } from '../types';
import { Calendar, Clock } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { navigate } = useApp();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Real Estate News',
    'Buying Guide',
    'Selling Guide',
    'Investment',
    'Market Insights',
    'Home & Lifestyle',
  ];

  useEffect(() => {
    api
      .getBlogs({ category: activeCategory !== 'All' ? activeCategory : undefined })
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8955A] font-semibold block">
          The Aura Journal
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#F7F5F0] leading-tight">
          Market Insights & Curated Living
        </h1>
        <p className="text-sm sm:text-base text-[#8E8E8E] leading-relaxed font-light">
          In-depth analyses of prime property cycles, architectural preservation, and international
          capital flows.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#242424] pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all ${
              activeCategory === cat
                ? 'bg-[#B8955A] text-[#111111]'
                : 'text-[#8E8E8E] hover:text-[#F7F5F0] hover:bg-[#161616]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-[#161616] rounded-sm animate-pulse" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 text-[#8E8E8E] text-sm">
          No journal entries published in this category yet.
        </div>
      ) : (
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

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#B8955A] font-semibold">
                    <span>{post.category}</span>
                    <span className="flex items-center gap-1 text-[#8E8E8E]">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-[#F7F5F0] group-hover:text-[#B8955A] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#8E8E8E] leading-relaxed line-clamp-3 font-light">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-[#222] flex items-center justify-between text-xs text-[#6B6B6B]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </span>
                  <span className="text-[#B8955A] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Article &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
