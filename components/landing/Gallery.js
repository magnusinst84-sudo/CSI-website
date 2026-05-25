"use client";

import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80', category: 'Events', caption: 'Coding sessions in action' },
  { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80', category: 'Campus', caption: 'VIT Chennai campus' },
  { src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80', category: 'Tech', caption: 'Abstract tech visualization' },
  { src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80', category: 'Team', caption: 'Team collaboration' },
  { src: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80', category: 'Tech', caption: 'Developer workspace' },
  { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80', category: 'Events', caption: 'Hackathon venue' },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', category: 'Team', caption: 'Developer portrait' },
  { src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', category: 'Tech', caption: 'Network visualization' },
  { src: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80', category: 'Awards', caption: 'Trophy showcase' },
  { src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80', category: 'Events', caption: 'Project demo day' },
  { src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80', category: 'Team', caption: 'Team photo' },
  { src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80', category: 'Tech', caption: 'Robotics showcase' },
  { src: 'https://images.unsplash.com/photo-1567427017947-545c5f89c6ad?auto=format&fit=crop&w=600&q=80', category: 'Awards', caption: 'Award ceremony' },
  { src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80', category: 'Team', caption: 'Member spotlight' },
  { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80', category: 'Tech', caption: 'Product showcase' },
];

const categories = ['All', 'Events', 'Team', 'Tech', 'Awards', 'Campus'];

export default function Gallery() {
  const { ref, isInView } = useInView(0.1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = (index) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);
  const nextImage = () => setLightbox((prev) => (prev !== null ? (prev + 1) % filtered.length : null));
  const prevImage = () => setLightbox((prev) => (prev !== null ? (prev - 1 + filtered.length) % filtered.length : null));

  return (
    <section id="gallery" ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge-cyan mb-4 inline-block">Moments</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Community Gallery
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-[#a1a1aa]">
            Captured moments from our events, workshops, hackathons, and celebrations.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setLightbox(null); }}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'glass text-[#a1a1aa] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className={`break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 50}ms` }}
              onClick={() => openLightbox(i)}
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                <span className="text-xs text-cyan-400 font-medium">{img.category}</span>
                <p className="text-sm text-white font-medium">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 rounded-full glass hover:bg-white/10 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/10 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/10 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-5xl max-h-[85vh] px-20" onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[lightbox].src}
              alt={filtered[lightbox].caption}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4">
              <span className="text-cyan-400 text-sm">{filtered[lightbox].category}</span>
              <p className="text-white text-lg">{filtered[lightbox].caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
