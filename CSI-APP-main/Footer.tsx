import { Cpu, Github, Linkedin, Twitter, Instagram, Mail, MapPin, Phone, ArrowRight, Heart } from 'lucide-react';

const footerLinks = {
  Community: ['About Us', 'Our Team', 'Join CSI', 'Alumni Network', 'Code of Conduct'],
  Events: ['HackNova', 'DevSprint', 'Workshops', 'Meetups', 'Calendar'],
  Resources: ['Blog', 'Documentation', 'Open Source', 'AI Tools', 'Learning Paths'],
  Support: ['Contact Us', 'FAQs', 'Report Issue', 'Feedback', 'Partnerships'],
};

const socials = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="relative pt-32 pb-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* CTA Section */}
        <div className="glass-strong rounded-3xl p-10 md:p-16 mb-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-amber-500/5" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Ready to Build the
              <span className="block bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">
                Future with Us?
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-lg text-[#a1a1aa] mb-8">
              Join 1,200+ developers, innovators, and creators in the most advanced student tech community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn-primary px-10 py-4 rounded-full text-lg font-semibold text-white flex items-center gap-2">
                Join Community
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="btn-secondary px-10 py-4 rounded-full text-lg font-semibold text-white">
                Partner with Us
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                CSI<span className="text-cyan-400">.</span>NextGen
              </span>
            </div>
            <p className="text-[#a1a1aa] leading-relaxed mb-6 max-w-sm">
              The future of student technology communities — immersive, innovative, collaborative,
              and built for the next generation of creators.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                <MapPin className="w-4 h-4 text-cyan-400" />
                VIT Chennai, Tamil Nadu, India
              </div>
              <div className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                <Mail className="w-4 h-4 text-cyan-400" />
                hello@csi-nextgen.org
              </div>
              <div className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                <Phone className="w-4 h-4 text-cyan-400" />
                +91 98765 43210
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-3 rounded-xl glass hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-[#a1a1aa] group-hover:text-cyan-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#a1a1aa] hover:text-cyan-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="glass rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-1">Stay in the loop</h4>
            <p className="text-sm text-[#a1a1aa]">Get updates on events, hackathons, and community news.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-64 px-4 py-3 glass rounded-xl text-white placeholder:text-[#a1a1aa] focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
            <button className="btn-primary px-6 py-3 rounded-xl text-sm font-semibold text-white whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#a1a1aa]">
            &copy; 2026 CSI NextGen · VIT Chennai. All rights reserved.
          </p>
          <p className="text-sm text-[#a1a1aa] flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-rose-400 fill-rose-400" /> by the CSI Tech Team
          </p>
        </div>
      </div>
    </footer>
  );
}
