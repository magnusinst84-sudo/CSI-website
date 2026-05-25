"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import BottomNav from "@/components/nav/BottomNav";
import Terminal from "@/components/terminal/Terminal";

export default function DashboardLayout({ user, profile, children }) {
  const [terminalOpen, setTerminalOpen] = useState(false);

  function handleTerminalToggle() {
    setTerminalOpen((prev) => !prev);
  }

  function handleTerminalClose() {
    setTerminalOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Uniform Background Patterns and Overlays */}
      <div className="grid-bg" />
      <div className="noise-overlay" />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/8 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-800/6 blur-[100px]" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <DashboardNavbar user={user} profile={profile} />

        <div className="flex-1 pb-[56px]">{children}</div>

        <Terminal
          isOpen={terminalOpen}
          onClose={handleTerminalClose}
          user={user}
          profile={profile}
        />

        <BottomNav
          terminalOpen={terminalOpen}
          onTerminalToggle={handleTerminalToggle}
        />
      </div>
    </div>
  );
}
