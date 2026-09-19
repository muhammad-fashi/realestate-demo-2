import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface PropertyGalleryProps {
  featuredImage: string;
  gallery: string[];
  title: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  featuredImage,
  gallery,
  title,
}) => {
  const images = [featuredImage, ...(gallery || [])].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') setLightboxOpen(false);
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative aspect-[16/9] md:aspect-[21/10] overflow-hidden rounded-sm bg-[#141414] group">
        <img
          src={images[activeIndex]}
          alt={`${title} - Photo ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#111111]/70 hover:bg-[#B8955A] text-[#F7F5F0] hover:text-[#111111] transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#111111]/70 hover:bg-[#B8955A] text-[#F7F5F0] hover:text-[#111111] transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Lightbox Trigger & Counter */}
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <span className="text-xs bg-[#111111]/80 backdrop-blur-md px-3 py-1.5 rounded-sm border border-[#333333] text-[#D8C29D]">
            {activeIndex + 1} / {images.length}
          </span>
          <button
            onClick={() => setLightboxOpen(true)}
            className="flex items-center gap-1.5 text-xs bg-[#111111]/80 hover:bg-[#B8955A] hover:text-[#111111] text-[#F7F5F0] backdrop-blur-md px-3 py-1.5 rounded-sm border border-[#333333] transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative shrink-0 w-24 sm:w-32 aspect-[16/10] rounded-sm overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? 'border-[#B8955A] opacity-100 scale-100'
                  : 'border-transparent opacity-60 hover:opacity-90'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Fullscreen Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-[#F7F5F0] border-b border-[#222222] pb-4">
            <span className="font-serif text-lg truncate max-w-md">{title}</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#B8955A] tracking-widest uppercase">
                Image {activeIndex + 1} of {images.length}
              </span>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-full hover:bg-[#222222] text-[#F7F5F0] transition-colors"
                aria-label="Close fullscreen"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Central Image View */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={images[activeIndex]}
              alt={`${title} - High resolution view`}
              className="max-h-full max-w-full object-contain select-none shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 p-3 rounded-full bg-[#1C1C1C]/80 hover:bg-[#B8955A] text-[#F7F5F0] hover:text-[#111111] transition-all"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 p-3 rounded-full bg-[#1C1C1C]/80 hover:bg-[#B8955A] text-[#F7F5F0] hover:text-[#111111] transition-all"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex justify-center gap-2 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-16 h-12 rounded-sm overflow-hidden border-2 shrink-0 ${
                  activeIndex === idx ? 'border-[#B8955A]' : 'border-transparent opacity-40'
                }`}
              >
                <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
