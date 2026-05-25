import { useInView } from '@/hooks/useInView';
import {
  MessageSquare, Map, CalendarCheck, FileText,
  Lightbulb, Users, Code, Layout
} from 'lucide-react';

const tools = [
  {
    icon: MessageSquare,
    name: 'CSI Assistant',
    desc: 'AI-powered chatbot for answering community questions, event info, and resource recommendations.',
    status: 'Live',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    accent: 'text-cyan-400',
  },
  {
    icon: Map,
    name: 'AI Roadmap Generator',
    desc: 'Personalized learning paths based on your goals, skills, and time availability.',
    status: 'Beta',
    gradient: 'from-purple-500/20 to-pink-500/20',
    accent: 'text-purple-400',
  },
  {
    icon: CalendarCheck,
    name: 'Event Recommender',
    desc: 'Smart event suggestions based on your domain interests and past participation.',
    status: 'Live',
    gradient: 'from-green-500/20 to-emerald-500/20',
    accent: 'text-green-400',
  },
  {
    icon: FileText,
    name: 'Resume Analyzer',
    desc: 'AI critique of your resume with actionable suggestions for improvement.',
    status: 'Live',
    gradient: 'from-amber-500/20 to-orange-500/20',
    accent: 'text-amber-400',
  },
  {
    icon: Lightbulb,
    name: 'Hackathon Idea Generator',
    desc: 'Generate unique hackathon project ideas tailored to your team skills.',
    status: 'Beta',
    gradient: 'from-rose-500/20 to-red-500/20',
    accent: 'text-rose-400',
  },
  {
    icon: Users,
    name: 'Teammate Finder',
    desc: 'AI-matched team formation based on complementary skills and interests.',
    status: 'Live',
    gradient: 'from-indigo-500/20 to-violet-500/20',
    accent: 'text-indigo-400',
  },
  {
    icon: Code,
    name: 'Code Mentor',
    desc: 'Interactive coding assistant with explanations, debugging, and best practices.',
    status: 'Live',
    gradient: 'from-teal-500/20 to-cyan-500/20',
    accent: 'text-teal-400',
  },
  {
    icon: Layout,
    name: 'Portfolio Reviewer',
    desc: 'Get AI feedback on your developer portfolio, projects, and GitHub profile.',
    status: 'Beta',
    gradient: 'from-fuchsia-500/20 to-purple-500/20',
    accent: 'text-fuchsia-400',
  },
];

export default function AITools() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="ai-tools" ref={ref} className="py-32 relative">
      {/* Background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/3 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-cyan mb-4 inline-block">Powered by AI</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            AI Tools Suite
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-[#a1a1aa]">
            Leverage cutting-edge AI tools designed to accelerate your learning, coding, and career growth.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, i) => (
            <div
              key={tool.name}
              className={`glass rounded-2xl p-6 card-lift group cursor-pointer transition-all duration-500 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 75}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center`}>
                  <tool.icon className={`w-6 h-6 ${tool.accent}`} />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  tool.status === 'Live'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {tool.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                {tool.desc}
              </p>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-sm text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Try it now</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#a1a1aa] mb-4">
            More AI tools coming soon. Have an idea?
          </p>
          <button className="btn-secondary px-8 py-3 rounded-full text-sm font-semibold text-white">
            Suggest a Tool
          </button>
        </div>
      </div>
    </section>
  );
}
