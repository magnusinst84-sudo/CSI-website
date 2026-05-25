import { useRef, useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import {
  Brain, Cloud, Shield, Blocks, Globe, Smartphone,
  Glasses, Radio, Bot, Code2, Palette, Heart
} from 'lucide-react';
import gsap from 'gsap';

const domains = [
  {
    icon: Brain, name: 'AI / ML', desc: 'Build intelligent systems, LLMs, deep learning, computer vision.',
    skills: ['PyTorch', 'TensorFlow', 'LLMs', 'OpenAI'],
    color: 'from-purple-500/20 to-pink-500/20',
    accent: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  {
    icon: Cloud, name: 'Cloud Computing', desc: 'Scalable infrastructure, Kubernetes, Docker, DevOps.',
    skills: ['AWS', 'Docker', 'K8s', 'Terraform'],
    color: 'from-cyan-500/20 to-blue-500/20',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
  {
    icon: Shield, name: 'Cybersecurity', desc: 'Ethical hacking, CTF, red teaming, defense systems.',
    skills: ['CTF', 'Networking', 'Kali', 'OSINT'],
    color: 'from-green-500/20 to-emerald-500/20',
    accent: 'text-green-400',
    border: 'border-green-500/20',
  },
  {
    icon: Blocks, name: 'Blockchain', desc: 'Smart contracts, DeFi, Web3, decentralized apps.',
    skills: ['Solidity', 'Ethereum', 'Hardhat', 'IPFS'],
    color: 'from-amber-500/20 to-orange-500/20',
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  {
    icon: Globe, name: 'Web Development', desc: 'Full-stack apps, SSR, APIs, real-time systems.',
    skills: ['React', 'Next.js', 'Node.js', 'GraphQL'],
    color: 'from-sky-500/20 to-indigo-500/20',
    accent: 'text-sky-400',
    border: 'border-sky-500/20',
  },
  {
    icon: Smartphone, name: 'App Development', desc: 'Native & cross-platform mobile experiences.',
    skills: ['Flutter', 'React Native', 'Swift', 'Kotlin'],
    color: 'from-teal-500/20 to-cyan-500/20',
    accent: 'text-teal-400',
    border: 'border-teal-500/20',
  },
  {
    icon: Glasses, name: 'AR / VR', desc: 'Immersive experiences, spatial computing, metaverse.',
    skills: ['Unity', 'Unreal', 'WebXR', 'Blender'],
    color: 'from-pink-500/20 to-rose-500/20',
    accent: 'text-pink-400',
    border: 'border-pink-500/20',
  },
  {
    icon: Radio, name: 'IoT', desc: 'Connected devices, embedded systems, edge computing.',
    skills: ['Arduino', 'Raspberry Pi', 'MQTT', 'ESP32'],
    color: 'from-yellow-500/20 to-amber-500/20',
    accent: 'text-yellow-400',
    border: 'border-yellow-500/20',
  },
  {
    icon: Bot, name: 'Robotics', desc: 'Autonomous systems, ROS, computer vision integration.',
    skills: ['ROS', 'OpenCV', 'Gazebo', 'PID'],
    color: 'from-red-500/20 to-orange-500/20',
    accent: 'text-red-400',
    border: 'border-red-500/20',
  },
  {
    icon: Code2, name: 'Competitive Programming', desc: 'Algorithms, data structures, contest preparation.',
    skills: ['C++', 'Python', 'Java', 'Math'],
    color: 'from-indigo-500/20 to-violet-500/20',
    accent: 'text-indigo-400',
    border: 'border-indigo-500/20',
  },
  {
    icon: Palette, name: 'UI / UX Design', desc: 'User research, prototyping, design systems.',
    skills: ['Figma', 'Framer', 'Adobe XD', 'Protopie'],
    color: 'from-fuchsia-500/20 to-purple-500/20',
    accent: 'text-fuchsia-400',
    border: 'border-fuchsia-500/20',
  },
  {
    icon: Heart, name: 'Open Source', desc: 'Contribution workflows, community building, maintainer skills.',
    skills: ['Git', 'GitHub', 'CI/CD', 'Docs'],
    color: 'from-emerald-500/20 to-green-500/20',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
];

function DomainCard({ domain, index }: { domain: typeof domains[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`);
  };

  const handleMouseLeave = () => {
    setTransform('');
  };

  return (
    <div
      ref={cardRef}
      className={`glass rounded-3xl p-8 spotlight-card card-lift transition-all duration-300 group ${domain.border}`}
      style={{
        transform,
        transitionDelay: `${index * 50}ms`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <domain.icon className={`w-8 h-8 ${domain.accent}`} />
      </div>

      <h3 className="text-xl font-bold text-white mb-3">{domain.name}</h3>
      <p className="text-sm text-[#a1a1aa] leading-relaxed mb-6">{domain.desc}</p>

      <div className="flex flex-wrap gap-2">
        {domain.skills.map((skill) => (
          <span key={skill} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Domains() {
  const { ref, isInView } = useInView(0.1);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInView || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.domain-card-wrapper');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out' }
    );
  }, [isInView]);

  return (
    <section id="domains" ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-cyan mb-4 inline-block">Special Interest Groups</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Explore Domains
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-[#a1a1aa]">
            Dive deep into cutting-edge technologies with specialized learning tracks,
            hands-on workshops, and expert mentorship.
          </p>
        </div>

        {/* Domain Grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {domains.map((domain, i) => (
            <div key={domain.name} className="domain-card-wrapper">
              <DomainCard domain={domain} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
