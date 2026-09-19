import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { BlogPost } from '../types';
import { ArrowLeft, Calendar, Clock, User, Share2, Tag } from 'lucide-react';

interface BlogDetailPageProps {
  slug: string;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ slug }) => {
  const { navigate, showToast } = useApp();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const blogs = await api.getBlogs();
        const current = blogs.find((b) => b.slug === slug || b.id === slug);
        if (current) {
          setPost(current);
          setRelated(blogs.filter((b) => b.id !== current.id).slice(0, 2));
        }
      } catch (err) {
        console.error('Failed to load blog post', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard', 'info');
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 animate-pulse space-y-6">
        <div className="h-10 bg-[#161616] w-3/4 rounded-sm" />
        <div className="h-80 bg-[#161616] rounded-sm" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-36 pb-24 max-w-xl mx-auto text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#F7F5F0]">Article Not Found</h2>
        <button
          onClick={() => navigate('/blog')}
          className="px-6 py-2.5 bg-[#B8955A] text-[#111] font-bold text-xs uppercase"
        >
          Back to Journal
        </button>
      </div>
    );
  }

  return (
    <article className="pt-28 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Back Button */}
      <button
        onClick={() => navigate('/blog')}
        className="inline-flex items-center gap-2 text-xs text-[#8E8E8E] hover:text-[#B8955A] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to The Journal</span>
      </button>

      {/* Header Info */}
      <div className="space-y-4 border-b border-[#242424] pb-8">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-widest text-[#B8955A] font-semibold bg-[#1C1C1C] px-3 py-1 rounded-xs border border-[#333]">
            {post.category}
          </span>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-[#8E8E8E] hover:text-[#F7F5F0] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Article</span>
          </button>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0] font-bold leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-xs text-[#8E8E8E] pt-2">
          <span className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-[#B8955A]" />
            <span className="text-[#F7F5F0] font-medium">{post.author?.name || 'Aura Editorial'}</span>
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>{post.date}</span>
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#B8955A]" />
            <span>{post.readTime}</span>
          </span>
        </div>
      </div>

      {/* Featured Banner Image */}
      <div className="aspect-[16/9] rounded-sm overflow-hidden border border-[#262626]">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Excerpt Lead */}
      <div className="p-6 bg-[#161616] border-l-2 border-[#B8955A] rounded-sm text-sm sm:text-base text-[#D8C29D] italic font-serif leading-relaxed">
        {post.excerpt}
      </div>

      {/* Full Body Text */}
      <div className="prose prose-invert max-w-none text-sm sm:text-base text-[#B3B3B3] leading-relaxed space-y-6 font-light">
        {post.content.split('\n\n').map((paragraph, i) => (
          <p key={i} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-6 border-t border-[#242424] flex items-center gap-2 flex-wrap">
          <Tag className="w-3.5 h-3.5 text-[#B8955A]" />
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-[#161616] border border-[#2E2E2E] text-[#8E8E8E] px-2.5 py-1 rounded-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-[#242424] space-y-6">
          <h3 className="font-serif text-2xl text-[#F7F5F0]">Related Insights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/blog/${rel.slug}`)}
                className="bg-[#161616] border border-[#262626] rounded-sm p-4 hover:border-[#B8955A]/50 transition-colors cursor-pointer space-y-2"
              >
                <span className="text-[10px] uppercase tracking-widest text-[#B8955A] font-semibold">
                  {rel.category}
                </span>
                <h4 className="font-serif text-base text-[#F7F5F0] line-clamp-2">{rel.title}</h4>
                <p className="text-xs text-[#8E8E8E] line-clamp-2">{rel.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
