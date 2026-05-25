"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchDashboardData } from "@/lib/dashboard-data";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

function TypeBadge({ type }) {
  const styles = {
    workshop: "bg-blue-500/15 text-blue-400 ring-blue-500/30",
    hackathon: "bg-indigo-500/15 text-indigo-400 ring-indigo-500/30",
    competition: "bg-cyan-500/15 text-cyan-400 ring-cyan-500/30",
  };
  const style = styles[type] ?? styles.workshop;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${style}`}
    >
      {type}
    </span>
  );
}

function StatCard({ label, value, subtext, icon, accent }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-blue-500/10 bg-gradient-to-br from-[#0c1425] to-[#080d18] p-5 transition-all hover:border-blue-500/25 hover:shadow-lg hover:shadow-blue-900/20">
      <div
        className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full blur-2xl ${accent}`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {subtext && (
            <p className="mt-1 text-xs text-zinc-500">{subtext}</p>
          )}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 ring-1 ring-blue-500/20">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children, emptyMessage }) {
  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <div className="rounded-2xl border border-blue-500/10 bg-[#0c1425]/80 backdrop-blur-sm">
      <div className="border-b border-blue-500/10 px-5 py-4">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>}
      </div>
      <div className="p-5">
        {isEmpty ? (
          <p className="py-6 text-center text-sm text-zinc-500">{emptyMessage}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060b14]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <p className="text-sm text-zinc-500">Loading your dashboard…</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const dashboardData = await fetchDashboardData(user.uid);
        if (!cancelled) setData(dashboardData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (!cancelled) {
          setError(
            "Unable to load dashboard data. Check your Firestore rules and indexes."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading || (user && loading)) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return null;
  }

  const { profile, stats, upcomingEvents, recentCertificates, pendingApplications } =
    data ?? {
      profile: {},
      stats: {
        points: 0,
        leaderboardRank: "—",
        eventsRegistered: 0,
        certificatesEarned: 0,
      },
      upcomingEvents: [],
      recentCertificates: [],
      pendingApplications: [],
    };

  return (
    <DashboardLayout user={user} profile={profile}>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Welcome banner */}
          <div className="relative mb-8 overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/80 via-[#0c1425] to-[#080d18] p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
            <div className="relative">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-600/15 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-blue-500/25">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                </span>
                VIT Chennai · Student Chapter Portal
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Welcome to CSI VIT Chennai
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                The Computer Society of India student chapter at VIT Chennai —
                empowering students through workshops, hackathons, competitions,
                mentorship, and a thriving tech community. Track your progress,
                events, and achievements here.
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Points"
              value={stats.points.toLocaleString()}
              subtext="Earned from events & activities"
              accent="bg-blue-600/20"
              icon={
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Leaderboard Rank"
              value={`#${stats.leaderboardRank}`}
              subtext="Among all chapter members"
              accent="bg-indigo-600/20"
              icon={
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Events Registered"
              value={stats.eventsRegistered}
              subtext="Total registrations"
              accent="bg-cyan-600/15"
              icon={
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Certificates Earned"
              value={stats.certificatesEarned}
              subtext="Verified achievements"
              accent="bg-emerald-600/15"
              icon={
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              }
            />
          </div>

          {/* Content grid */}
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {/* Upcoming events — spans 2 cols on xl */}
            <div className="xl:col-span-2">
              <SectionCard
                title="Upcoming Registered Events"
                subtitle="Events you've signed up for"
                emptyMessage="No upcoming events. Browse Events to register."
              >
                {upcomingEvents.length > 0 && (
                  <ul className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <li
                        key={event.id}
                        className="flex items-center justify-between gap-4 rounded-xl border border-blue-500/10 bg-[#080d18]/60 px-4 py-3.5 transition-colors hover:border-blue-500/20"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-white">
                            {event.name}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            {event.dateLabel}
                          </p>
                        </div>
                        <TypeBadge type={event.type} />
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>
            </div>

            {/* Pending applications */}
            <div>
              <SectionCard
                title="Pending Applications"
                subtitle="Team & council applications"
                emptyMessage="No pending applications."
              >
                {pendingApplications.length > 0 && (
                  <ul className="space-y-3">
                    {pendingApplications.map((app) => (
                      <li
                        key={app.id}
                        className="rounded-xl border border-blue-500/15 bg-blue-500/5 px-4 py-3.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-white">{app.role}</p>
                          <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-blue-400 ring-1 ring-blue-500/25">
                            pending
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-zinc-500">{app.type}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>
            </div>

            {/* Recent certificates — full width on large screens */}
            <div className="lg:col-span-2 xl:col-span-3">
              <SectionCard
                title="Recent Certificates"
                subtitle="Your latest verified certificates"
                emptyMessage="No certificates yet. Complete events to earn them."
              >
                {recentCertificates.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {recentCertificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex items-start gap-3 rounded-xl border border-blue-500/10 bg-[#080d18]/60 p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/15 ring-1 ring-blue-500/20">
                          <svg
                            className="h-5 w-5 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">
                            {cert.eventName}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            Issued {cert.issuedLabel}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>
          </div>
      </main>
    </DashboardLayout>
  );
}
