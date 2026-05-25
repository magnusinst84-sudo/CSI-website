import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  { src: '/images/carousel-1.jpg', category: 'Events', caption: 'Coding sessions in action' },
  { src: '/images/carousel-2.jpg', category: 'Campus', caption: 'VIT Chennai campus' },
  { src: '/images/carousel-3.jpg', category: 'Tech', caption: 'Abstract tech visualization' },
  { src: '/images/carousel-4.jpg', category: 'Team', caption: 'Team collaboration' },
  { src: '/images/carousel-5.jpg', category: 'Tech', caption: 'Developer workspace' },
  { src: '/images/carousel-6.jpg', category: 'Events', caption: 'Hackathon venue' },
  { src: '/images/carousel-7.jpg', category: 'Team', caption: 'Developer portrait' },
  { src: '/images/carousel-8.jpg', category: 'Tech', caption: 'Network visualization' },
  { src: '/images/carousel-9.jpg', category: 'Awards', caption: 'Trophy showcase' },
  { src: '/images/grid-3.jpg', category: 'Events', caption: 'Project demo day' },
  { src: '/images/grid-5.jpg', category: 'Team', caption: 'Team photo' },
  { src: '/images/grid-7.jpg', category: 'Tech', caption: 'Robotics showcase' },
  { src: '/images/grid-8.jpg', category: 'Awards', caption: 'Award ceremony' },
  { src: '/images/grid-1.jpg', category: 'Team', caption: 'Member spotlight' },
  { src: '/images/grid-9.jpg', category: 'Tech', caption: 'Product showcase' },
];

const categories = ['All', 'Events', 'Team', 'Tech', 'Awards', 'Campus'];

export default function Gallery() {
  const { ref, isInView } = useInView(0.1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeCategory === 'All'
    ? images
    : images.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => setLightbox(index);
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
