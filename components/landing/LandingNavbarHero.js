"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "About", id: "about" },
  { label: "Events", id: "events" },
  { label: "Team", id: "team" },
  { label: "Contact", id: "contact" },
];

const STATS = [
  { value: 500, suffix: "+", label: "Members" },
  { value: 50, suffix: "+", label: "Events" },
  { value: 30, suffix: "+", label: "Projects" },
  { value: 20, suffix: "+", label: "Mentors" },
];

const FLOATING_CARDS = [
  { text: "🏆 Hackathon Champions", position: "left-[4%] top-[28%] hidden lg:block" },
  { text: "👥 500+ Members", position: "right-[6%] top-[22%] hidden md:block" },
  { text: "⭐ Top CS Chapter", position: "right-[10%] bottom-[32%] hidden lg:block" },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

function CountUp({ target, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame;
    const duration = 2000;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function LandingNavbarHero() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-white/5 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:h-[72px]">
          <Link href="/" className="text-lg font-bold tracking-tight text-white sm:text-xl">
            CSI <span className="text-[#3b82f6]">VIT</span> Chennai
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/login"
              className="rounded-full bg-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Join Now
            </Link>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-[#020408]/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => {
                    scrollToSection(link.id);
                    setMenuOpen(false);
                  }}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-300 hover:bg-white/5"
                >
                  {link.label}
                </button>
              ))}
              <Link
                href="/login"
                className="mt-2 rounded-full bg-[#3b82f6] px-4 py-2.5 text-center text-sm font-semibold text-white"
                onClick={() => setMenuOpen(false)}
              >
                Join Now
              </Link>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden pt-16 lg:pt-[72px]">
        {/* Grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Glow orbs */}
        <motion.div
          className="pointer-events-none absolute -bottom-32 -left-32 h-[480px] w-[480px] rounded-full bg-[#3b82f6]/20 blur-[120px]"
          animate={{ opacity: [0.4, 0.65, 0.4], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#8b5cf6]/15 blur-[110px]"
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Floating cards */}
        {FLOATING_CARDS.map((card, i) => (
          <motion.div
            key={card.text}
            className={`absolute z-10 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/90 shadow-xl backdrop-blur-md ${card.position}`}
            animate={{ y: [0, -14, 0] }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          >
            {card.text}
          </motion.div>
        ))}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative z-20 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:min-h-[calc(100vh-72px)]"
        >
          <motion.h1
            variants={fadeUp}
            className="max-w-5xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">
              Build. Innovate. Lead.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            The Computer Society of India student chapter at VIT Chennai — where
            developers, designers, and innovators come together.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#3b82f6] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30 sm:w-auto"
            >
              Join the Chapter
            </Link>
            <Link
              href="/events"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#3b82f6]/50 bg-transparent px-8 py-3.5 text-sm font-semibold text-[#3b82f6] transition-all hover:border-[#3b82f6] hover:bg-[#3b82f6]/10 sm:w-auto"
            >
              Explore Events
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 backdrop-blur-md"
              >
                <p className="text-2xl font-bold text-white sm:text-3xl">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs font-medium text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

      </section>
    </>
  );
}
