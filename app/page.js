"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import LandingNavbarHero from "@/components/landing/LandingNavbarHero";
import EventTypeBadge from "@/components/events/EventTypeBadge";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ScrollCountUp component to trigger count up when scrolled into view
function ScrollCountUp({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px 0px" });

  useEffect(() => {
    if (!inView) return;

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Cubic out easing
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, inView]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// Code tokens for the animated terminal visual in About section
const CODE_TOKENS = [
  { text: "const ", type: "keyword" },
  { text: "csi", type: "variable" },
  { text: " = ", type: "operator" },
  { text: "new ", type: "keyword" },
  { text: "CSI", type: "class" },
  { text: "(", type: "punctuation" },
  { text: '"VIT Chennai"', type: "string" },
  { text: ");\n\n", type: "punctuation" },

  { text: "csi", type: "variable" },
  { text: ".", type: "punctuation" },
  { text: "on", type: "method" },
  { text: "(", type: "punctuation" },
  { text: '"join"', type: "string" },
  { text: ", ", type: "punctuation" },
  { text: "(", type: "punctuation" },
  { text: "student", type: "variable" },
  { text: ")", type: "punctuation" },
  { text: " => ", type: "operator" },
  { text: "{\n", type: "punctuation" },

  { text: "  student", type: "variable" },
  { text: ".", type: "punctuation" },
  { text: "learn", type: "method" },
  { text: "(", type: "punctuation" },
  { text: "[", type: "punctuation" },
  { text: '"AI"', type: "string" },
  { text: ", ", type: "punctuation" },
  { text: '"Web Dev"', type: "string" },
  { text: ", ", type: "punctuation" },
  { text: '"Cloud"', type: "string" },
  { text: "]", type: "punctuation" },
  { text: ");\n", type: "punctuation" },

  { text: "  student", type: "variable" },
  { text: ".", type: "punctuation" },
  { text: "build", type: "method" },
  { text: "(", type: "punctuation" },
  { text: '"Innovation"', type: "string" },
  { text: ");\n", type: "punctuation" },

  { text: "  student", type: "variable" },
  { text: ".", type: "punctuation" },
  { text: "lead", type: "method" },
  { text: "(", type: "punctuation" },
  { text: '"Community"', type: "string" },
  { text: ");\n", type: "punctuation" },

  { text: "});\n\n", type: "punctuation" },

  { text: "csi", type: "variable" },
  { text: ".", type: "punctuation" },
  { text: "startJourney", type: "method" },
  { text: "();", type: "punctuation" }
];

function CodeTerminal() {
  const [visibleChars, setVisibleChars] = useState(0);
  const totalLength = CODE_TOKENS.reduce((acc, token) => acc + token.text.length, 0);

  useEffect(() => {
    let timer;
    const tick = () => {
      setVisibleChars((prev) => {
        if (prev >= totalLength) {
          clearInterval(timer);
          setTimeout(() => {
            setVisibleChars(0);
          }, 4000); // Wait 4 seconds and restart typing animation
          return prev;
        }
        return prev + 1;
      });
    };

    timer = setInterval(tick, 35);
    return () => clearInterval(timer);
  }, [totalLength, visibleChars]);

  useEffect(() => {
    if (visibleChars === 0) {
      const timer = setInterval(() => {
        setVisibleChars((prev) => {
          if (prev >= totalLength) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 35);
      return () => clearInterval(timer);
    }
  }, [visibleChars, totalLength]);

  const getColorClass = (type) => {
    switch (type) {
      case "keyword":
        return "text-[#f472b6]"; // pink
      case "variable":
        return "text-[#93c5fd]"; // light blue
      case "operator":
        return "text-[#f43f5e]"; // light red
      case "class":
        return "text-[#fbbf24]"; // amber
      case "string":
        return "text-[#34d399]"; // emerald
      case "method":
        return "text-[#22d3ee]"; // cyan
      case "punctuation":
      default:
        return "text-[#a1a1aa]"; // zinc-400
    }
  };

  let charCounter = 0;
  const renderedTokens = [];

  for (const token of CODE_TOKENS) {
    if (charCounter >= visibleChars) break;
    const remaining = visibleChars - charCounter;
    const slicedText = token.text.slice(0, remaining);
    renderedTokens.push(
      <span key={charCounter} className={getColorClass(token.type)}>
        {slicedText}
      </span>
    );
    charCounter += token.text.length;
  }

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-[#050814]/90 p-5 shadow-2xl backdrop-blur-md">
      {/* Terminal Title Bar */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
        <div className="h-3 w-3 rounded-full bg-rose-500/80" />
        <div className="h-3 w-3 rounded-full bg-amber-500/80" />
        <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
        <span className="ml-2 text-xs font-mono text-zinc-500">join_csi.js</span>
      </div>
      
      {/* Code Area */}
      <div className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre min-h-[260px] select-none">
        {renderedTokens}
        <span className="inline-block w-2 h-4 bg-[#3b82f6] ml-1 align-middle animate-terminal-cursor" />
      </div>
    </div>
  );
}

const HIGHLIGHT_CARDS = [
  {
    title: "Community",
    description: "Connect with a diverse network of peer developers, designers, and tech enthusiasts.",
    icon: (
      <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    title: "Innovation",
    description: "Hack, build, and prototype next-gen solutions using cutting-edge technologies.",
    icon: (
      <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    title: "Leadership",
    description: "Lead initiatives, organize large-scale events, and direct technical projects.",
    icon: (
      <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  }
];

const EVENTS_DATA = [
  {
    id: "cloud-computing-workshop",
    type: "workshop",
    title: "Intro to Cloud Computing",
    date: "May 30, 2026",
    venue: "MG Auditorium, VITC",
    shadowColor: "hover:shadow-[0_0_30px_rgba(59,130,246,0.25)] hover:border-blue-500/30",
  },
  {
    id: "build-for-tomorrow",
    type: "hackathon",
    title: "24hr Build for Tomorrow",
    date: "June 4, 2026",
    venue: "Netaji Auditorium, VITC",
    shadowColor: "hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] hover:border-violet-500/30",
  },
  {
    id: "web-dev-championship",
    type: "competition",
    title: "Web Dev Championship",
    date: "June 9, 2026",
    venue: "Smart Classroom, VITC",
    shadowColor: "hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:border-amber-500/30",
  }
];

const FEATURES_DATA = [
  {
    title: "Events & Workshops",
    description: "Hands-on tech workshops, hackathons, and seminars led by industry experts.",
    iconColor: "text-blue-400 bg-blue-500/10 ring-blue-500/20",
    glowColor: "hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "Hackathons",
    description: "Intense coding battles to build, collaborate, and compete for exciting prizes.",
    iconColor: "text-purple-400 bg-purple-500/10 ring-purple-500/20",
    glowColor: "hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "Resource Library",
    description: "Access shared templates, reading material, roadmap guides, and code repositories.",
    iconColor: "text-cyan-400 bg-cyan-500/10 ring-cyan-500/20",
    glowColor: "hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    title: "Leaderboard",
    description: "Earn points by participating, contributing, and climbing the community ladder.",
    iconColor: "text-yellow-400 bg-yellow-500/10 ring-yellow-500/20",
    glowColor: "hover:border-yellow-500/30 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15a4 4 0 004-4V5H8v6a4 4 0 004 4zM3 9h4v2H3V9zm14 0h4v2h-4V9zm-5 6v4m-3 0h6" />
      </svg>
    )
  },
  {
    title: "Mentor Network",
    description: "Get 1-on-1 career path guidance, project feedback, and portfolio review sessions.",
    iconColor: "text-green-400 bg-green-500/10 ring-green-500/20",
    glowColor: "hover:border-green-500/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    title: "Project Showcase",
    description: "Build team projects, share open-source products, and gain visibility.",
    iconColor: "text-pink-400 bg-pink-500/10 ring-pink-500/20",
    glowColor: "hover:border-pink-500/30 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  }
];

const COUNCIL_DATA = [
  {
    initials: "AV",
    name: "Aditya Verma",
    role: "President",
    gradient: "from-blue-600 to-cyan-500",
    borderClass: "border-blue-500/20 hover:border-blue-500/50",
    glowClass: "hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]",
  },
  {
    initials: "KS",
    name: "Kavya Sharma",
    role: "Vice President",
    gradient: "from-purple-600 to-pink-500",
    borderClass: "border-purple-500/20 hover:border-purple-500/50",
    glowClass: "hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]",
  },
  {
    initials: "RS",
    name: "Rohan Sen",
    role: "Technical Lead",
    gradient: "from-cyan-500 to-blue-600",
    borderClass: "border-cyan-500/20 hover:border-cyan-500/50",
    glowClass: "hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]",
  },
  {
    initials: "IS",
    name: "Isha Singh",
    role: "Design Lead",
    gradient: "from-pink-500 to-rose-400",
    borderClass: "border-pink-500/20 hover:border-pink-500/50",
    glowClass: "hover:shadow-[0_0_25px_rgba(236,72,153,0.2)]",
  },
  {
    initials: "AM",
    name: "Aman Mehta",
    role: "Events Head",
    gradient: "from-emerald-500 to-teal-600",
    borderClass: "border-emerald-500/20 hover:border-emerald-500/50",
    glowClass: "hover:shadow-[0_0_25px_rgba(34,197,94,0.2)]",
  }
];

const TESTIMONIALS_DATA = [
  {
    quote: "CSI VIT Chennai completely transformed my college experience. The hackathons and workshops gave me real-world skills.",
    name: "Rahul Sharma",
    info: "3rd Year CSE",
    accentClass: "border-l-4 border-l-blue-500",
  },
  {
    quote: "From zero to landing an internship — the mentor network and project showcase made all the difference.",
    name: "Priya Nair",
    info: "2nd Year IT",
    accentClass: "border-l-4 border-l-violet-500",
  },
  {
    quote: "The community here is incredible. I found my co-founders for my startup at a CSI hackathon.",
    name: "Arjun Mehta",
    info: "4th Year ECE",
    accentClass: "border-l-4 border-l-cyan-500",
  }
];

const FAQ_DATA = [
  {
    question: "What is CSI VIT Chennai?",
    answer: "CSI VIT Chennai is the student chapter of the Computer Society of India at VIT Chennai, dedicated to fostering technical excellence and innovation among students."
  },
  {
    question: "How do I join CSI VIT Chennai?",
    answer: "Click \"Join Now\" and sign in with your Google account. Membership is open to all VIT Chennai students."
  },
  {
    question: "Is membership free?",
    answer: "Yes, the platform and all digital resources are completely free for VIT Chennai students."
  },
  {
    question: "What kind of events do you host?",
    answer: "We host workshops, hackathons, coding competitions, seminars, guest lectures, and project showcases throughout the year."
  },
  {
    question: "How do I get certificates?",
    answer: "Certificates are issued automatically after you attend and complete registered events. You can download them from your profile dashboard."
  },
  {
    question: "Can first-year students join?",
    answer: "Absolutely! We welcome students from all years and all branches. Many of our most active members joined in their first year."
  }
];

const StarIcon = (
  <svg className="h-4 w-4 text-amber-400 fill-current shrink-0" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-5 px-6 flex items-center justify-between text-left text-base sm:text-lg font-semibold text-white hover:text-[#3b82f6] transition-colors duration-200"
      >
        <span>{question}</span>
        <span className="ml-4 shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-white/5 border border-white/10 text-zinc-400 transition-colors duration-200">
          {isOpen ? (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
            </svg>
          ) : (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </span>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 px-6 text-sm sm:text-base leading-relaxed text-zinc-400">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomePage() {
  const aboutRef = useRef(null);
  const eventsRef = useRef(null);
  const featuresRef = useRef(null);
  const achievementsRef = useRef(null);
  const teamRef = useRef(null);
  const testimonialsRef = useRef(null);
  const faqRef = useRef(null);

  const isAboutInView = useInView(aboutRef, { once: true, margin: "-100px 0px" });
  const isEventsInView = useInView(eventsRef, { once: true, margin: "-100px 0px" });
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px 0px" });
  const isAchievementsInView = useInView(achievementsRef, { once: true, margin: "-100px 0px" });
  const isTeamInView = useInView(teamRef, { once: true, margin: "-100px 0px" });
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px 0px" });
  const isFaqInView = useInView(faqRef, { once: true, margin: "-100px 0px" });

  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleFaqToggle = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollToId = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`${spaceGrotesk.className} min-h-screen bg-[#020408] text-white antialiased overflow-x-hidden`}
    >
      {/* Hero & Navbar wrapper */}
      <LandingNavbarHero />

      {/* About Section */}
      <section id="about" className="relative py-20 lg:py-28 overflow-hidden border-t border-white/5 scroll-mt-20 lg:scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Glow orb */}
        <div className="pointer-events-none absolute right-[-10%] top-[20%] h-[350px] w-[350px] rounded-full bg-[#8b5cf6]/10 blur-[100px]" />

        <motion.div
          ref={aboutRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isAboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10"
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column: Text */}
            <div className="flex flex-col">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                About{" "}
                <span className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
                  CSI VIT Chennai
                </span>
              </h2>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-zinc-400">
                The Computer Society of India (CSI) student chapter at VIT Chennai is a premier technical community dedicated to nurturing technological curiosity and development. We serve as a vibrant bridge between theoretical academia and industry standards, giving students the resources and mentorship to excel in fields like software engineering, artificial intelligence, cyber security, and cloud computing.
              </p>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-400">
                Through regular hands-on workshops, nationwide hackathons, guest lectures by industry veterans, and real-world collaboration, we cultivate an ecosystem of continuous learning. Whether you are writing your first line of code or deploying complex full-stack architectures, CSI provides the platform to refine your skills and build a rewarding tech career.
              </p>

              {/* Highlight cards */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {HIGHLIGHT_CARDS.map((card) => (
                  <div
                    key={card.title}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{card.title}</h3>
                      <p className="mt-1 text-xs text-zinc-500 leading-normal">
                        {card.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Code Terminal */}
            <div className="w-full">
              <CodeTerminal />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Events Showcase Section */}
      <section id="events" className="relative py-20 lg:py-28 overflow-hidden border-t border-white/5 scroll-mt-20 lg:scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#8b5cf6]/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Glow orb */}
        <div className="pointer-events-none absolute left-[-10%] bottom-[10%] h-[350px] w-[350px] rounded-full bg-[#3b82f6]/10 blur-[100px]" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Upcoming Events
            </h2>
            <p className="mt-4 text-base text-zinc-400">
              Level up your skill set. Join our industry-leading workshops, competitive hackathons, and web-dev design championships.
            </p>
          </div>

          {/* Stagger cards */}
          <motion.div
            ref={eventsRef}
            variants={staggerContainer}
            initial="hidden"
            animate={isEventsInView ? "show" : "hidden"}
            className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-x-visible md:pb-0 px-1"
          >
            {EVENTS_DATA.map((event) => (
              <motion.div
                key={event.id}
                variants={cardVariant}
                className={`snap-center shrink-0 w-[290px] sm:w-[340px] md:w-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${event.shadowColor}`}
              >
                <div>
                  <div className="mb-4">
                    <EventTypeBadge type={event.type} />
                  </div>
                  <h3 className="text-xl font-bold text-white leading-snug group-hover:text-blue-300 min-h-[56px] flex items-center">
                    {event.title}
                  </h3>
                  
                  <div className="mt-4 space-y-2.5 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2.5 text-xs text-zinc-400">
                      <svg className="h-4 w-4 text-[#3b82f6]/70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-zinc-400">
                      <svg className="h-4 w-4 text-[#3b82f6]/70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.venue}
                    </div>
                  </div>
                </div>

                <Link
                  href="/events"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-white/5 border border-white/10 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg"
                >
                  Register Now
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* View All Events Button */}
          <div className="mt-16 text-center">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-full border border-[#3b82f6]/50 bg-transparent px-8 py-3.5 text-sm font-semibold text-[#3b82f6] transition-all hover:border-[#3b82f6] hover:bg-[#3b82f6]/10"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="relative py-20 lg:py-28 overflow-hidden border-t border-white/5 scroll-mt-20 lg:scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Glow orbs */}
        <div className="pointer-events-none absolute right-[-10%] bottom-[20%] h-[350px] w-[350px] rounded-full bg-[#06b6d4]/5 blur-[100px]" />
        
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Everything in one place
            </h2>
            <p className="mt-4 text-base text-zinc-400">
              Your complete student chapter ecosystem
            </p>
          </div>

          <motion.div
            ref={featuresRef}
            variants={staggerContainer}
            initial="hidden"
            animate={isFeaturesInView ? "show" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-1"
          >
            {FEATURES_DATA.map((feat) => (
              <motion.div
                key={feat.title}
                variants={cardVariant}
                className={`group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col transition-all duration-300 hover:-translate-y-1.5 ${feat.glowColor}`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 transition-all duration-300 group-hover:scale-110 ${feat.iconColor}`}>
                  {feat.icon}
                </div>
                <h3 className="mt-6 text-lg font-bold text-white transition-colors group-hover:text-white">
                  {feat.title}
                </h3>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed line-clamp-2">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="relative py-24 overflow-hidden border-t border-white/5 bg-gradient-to-r from-blue-950/15 via-purple-950/10 to-blue-950/15">
        {/* Top and bottom horizontal gradient border lines */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 flex flex-col items-center">
          <motion.div
            ref={achievementsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isAchievementsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-8 sm:grid-cols-4 w-full text-center"
          >
            <div>
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                <ScrollCountUp target={500} suffix="+" />
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Members</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                <ScrollCountUp target={50} suffix="+" />
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Events</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                <ScrollCountUp target={30} suffix="+" />
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Projects</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                <ScrollCountUp target={100} suffix="%" />
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Free</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isAchievementsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 text-center max-w-xl"
          >
            <p className="text-base sm:text-lg text-zinc-400 font-medium leading-relaxed">
              Join the fastest growing tech community at VIT Chennai
            </p>
            <div className="mt-8">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30"
              >
                Become a Member
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="relative py-20 lg:py-28 overflow-hidden border-t border-white/5 scroll-mt-20 lg:scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Glow orb */}
        <div className="pointer-events-none absolute left-[-10%] top-[20%] h-[350px] w-[350px] rounded-full bg-[#8b5cf6]/5 blur-[100px]" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Meet the Council
            </h2>
            <p className="mt-4 text-base text-zinc-400">
              The team behind CSI VIT Chennai
            </p>
          </div>

          <motion.div
            ref={teamRef}
            variants={staggerContainer}
            initial="hidden"
            animate={isTeamInView ? "show" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-1"
          >
            {COUNCIL_DATA.map((member) => (
              <motion.div
                key={member.role}
                variants={cardVariant}
                className={`group rounded-2xl border bg-white/5 backdrop-blur-md p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1.5 ${member.borderClass} ${member.glowClass}`}
              >
                <div className={`h-16 w-16 rounded-full flex items-center justify-center text-lg font-bold text-white mb-4 bg-gradient-to-tr transition-all duration-300 group-hover:scale-105 shadow-md ${member.gradient}`}>
                  {member.initials}
                </div>
                <h3 className="text-base font-bold text-white mt-2">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-20 lg:py-28 overflow-hidden border-t border-white/5 scroll-mt-20 lg:scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Glow orb */}
        <div className="pointer-events-none absolute right-[-10%] bottom-[15%] h-[350px] w-[350px] rounded-full bg-[#3b82f6]/5 blur-[100px]" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              What our members say
            </h2>
          </div>

          <motion.div
            ref={testimonialsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isTestimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 px-1"
          >
            {TESTIMONIALS_DATA.map((item, index) => (
              <div
                key={index}
                className={`rounded-2xl bg-white/5 backdrop-blur-md p-6 border border-white/10 flex flex-col justify-between transition-all duration-300 hover:bg-white/10 hover:border-white/20 ${item.accentClass}`}
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }, (_, idx) => (
                      <span key={idx}>{StarIcon}</span>
                    ))}
                  </div>
                  {/* Quote Text */}
                  <p className="text-sm sm:text-base text-zinc-300 italic leading-relaxed select-none">
                    "{item.quote}"
                  </p>
                </div>
                {/* Member Identity */}
                <div className="mt-6 pt-4 border-t border-white/5">
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.info}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="relative py-20 lg:py-28 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Glow orb */}
        <div className="pointer-events-none absolute left-[-10%] top-[30%] h-[350px] w-[350px] rounded-full bg-[#8b5cf6]/5 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isFaqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl px-4 sm:px-6 relative z-10"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md divide-y divide-white/5 overflow-hidden">
            {FAQ_DATA.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openFaqIndex === index}
                onToggle={() => handleFaqToggle(index)}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer (id="contact") */}
      <footer id="contact" className="relative border-t border-white/5 bg-[#020408] scroll-mt-20 lg:scroll-mt-24">
        {/* Subtle gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Top Join Banner */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between border-b border-white/5 relative z-10">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to join?</h3>
            <p className="mt-2 text-sm sm:text-base text-zinc-400">Embark on your journey of building, innovating, and leading.</p>
          </div>
          <Link
            href="/login"
            className="rounded-full bg-[#3b82f6] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Get Started
          </Link>
        </div>

        {/* Main Footer Links & Info */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid grid-cols-1 gap-10 md:grid-cols-3 relative z-10">
          {/* Column 1: Left */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-white tracking-tight">
              CSI <span className="text-[#3b82f6]">VIT</span> Chennai
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              The Computer Society of India student chapter at VIT Chennai — where developers, designers, and innovators come together.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 transition-all duration-300 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400 hover:-translate-y-0.5" aria-label="GitHub">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a href="#" className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 transition-all duration-300 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400 hover:-translate-y-0.5" aria-label="LinkedIn">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 transition-all duration-300 hover:bg-pink-500/10 hover:border-pink-500/30 hover:text-pink-400 hover:-translate-y-0.5" aria-label="Instagram">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                </svg>
              </a>
              <a href="#" className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 transition-all duration-300 hover:bg-blue-400/10 hover:border-blue-400/30 hover:text-blue-400 hover:-translate-y-0.5" aria-label="Twitter">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Center */}
          <div className="flex flex-col gap-4">
            <h4 className="text-base font-bold text-white tracking-wide uppercase">Quick Links</h4>
            <nav className="flex flex-col gap-2.5">
              <button onClick={() => scrollToId("")} className="text-sm text-zinc-400 text-left hover:text-white transition-colors duration-200">
                Home
              </button>
              <button onClick={() => scrollToId("about")} className="text-sm text-zinc-400 text-left hover:text-white transition-colors duration-200">
                About
              </button>
              <Link href="/events" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                Events
              </Link>
              <button onClick={() => scrollToId("team")} className="text-sm text-zinc-400 text-left hover:text-white transition-colors duration-200">
                Team
              </button>
              <Link href="/login" className="text-sm text-[#3b82f6] font-semibold hover:text-blue-400 transition-colors duration-200">
                Join Now
              </Link>
            </nav>
          </div>

          {/* Column 3: Right */}
          <div className="flex flex-col gap-4">
            <h4 className="text-base font-bold text-white tracking-wide uppercase">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-zinc-400">
              <div className="flex items-start gap-2.5">
                <svg className="h-5 w-5 text-[#3b82f6]/70 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:csi.vitcc@gmail.com" className="hover:text-white transition-colors duration-200">
                  csi.vitcc@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <svg className="h-5 w-5 text-[#3b82f6]/70 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="leading-relaxed">
                  Vellore Institute of Technology (VIT) Chennai,<br />
                  Vandalur-Kelambakkam Road, Chennai,<br />
                  Tamil Nadu 600127
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-white/5 py-8 text-center relative z-10">
          <p className="text-xs text-zinc-500">
            &copy; 2026 CSI VIT Chennai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
