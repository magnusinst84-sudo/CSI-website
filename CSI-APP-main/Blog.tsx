import { useInView } from '@/hooks/useInView';
import { Clock, ArrowRight, TrendingUp } from 'lucide-react';

const blogs = [
  {
    title: 'The Future of Student Tech Communities in the AI Era',
    excerpt: 'How AI is transforming the way student developers learn, collaborate, and build products that matter.',
    category: 'Community',
    readTime: '5 min read',
    date: 'Jan 15, 2026',
    featured: true,
    image: '/images/carousel-3.jpg',
  },
  {
    title: 'Building LLM-Powered Applications: A Complete Guide',
    excerpt: 'From prompt engineering to RAG pipelines — everything you need to build production-ready AI apps.',
    category: 'AI/ML',
    readTime: '12 min read',
    date: 'Jan 10, 2026',
    featured: false,
    image: '/images/carousel-1.jpg',
  },
  {
    title: 'HackNova 2026: Behind the Scenes of a 1500-Hacker Event',
    excerpt: 'The planning, technology, and community effort that went into our biggest hackathon yet.',
    category: 'Events',
    readTime: '8 min read',
    date: 'Jan 5, 2026',
    featured: false,
    image: '/images/carousel-6.jpg',
  },
  {
    title: 'Zero to Hero: Kubernetes for Student Developers',
    excerpt: 'A practical guide to container orchestration that doesnt require a PhD in distributed systems.',
    category: 'DevOps',
    readTime: '15 min read',
    date: 'Dec 28, 2025',
    featured: false,
    image: '/images/carousel-2.jpg',
  },
];

export default function Blog() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-cyan mb-4 inline-block">Insights</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            From the Blog
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-[#a1a1aa]">
            Technical deep dives, community stories, and lessons learned from building the future.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured post */}
          {blogs.filter((b) => b.featured).map((blog) => (
            <div
              key={blog.title}
              className={`lg:row-span-2 glass rounded-3xl overflow-hidden card-lift group cursor-pointer ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0ms' }}
            >
              <div className="relative h-64 lg:h-80 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Featured
                </span>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4 text-sm text-[#a1a1aa]">
                  <span className="text-cyan-400 font-medium">{blog.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {blog.readTime}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-[#a1a1aa] leading-relaxed mb-6">{blog.excerpt}</p>
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
                  Read Article
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}

          {/* Other posts */}
          <div className="space-y-6">
            {blogs.filter((b) => !b.featured).map((blog, i) => (
              <div
                key={blog.title}
                className={`glass rounded-2xl overflow-hidden card-lift group cursor-pointer flex flex-col sm:flex-row ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              >
                <div className="sm:w-48 h-40 sm:h-auto overflow-hidden flex-shrink-0">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex-1">
                  <div className="flex items-center gap-3 mb-2 text-xs text-[#a1a1aa]">
                    <span className="text-cyan-400 font-medium">{blog.category}</span>
                    <span>{blog.date}</span>
                  </div>
                  <h4 className="font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h4>
                  <p className="text-sm text-[#a1a1aa] line-clamp-2">{blog.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
