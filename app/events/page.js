"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { fetchAllEvents } from "@/lib/events-data";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import EventTypeBadge from "@/components/events/EventTypeBadge";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "workshop", label: "Workshops" },
  { id: "hackathon", label: "Hackathons" },
  { id: "competition", label: "Competitions" },
];

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060b14]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    </div>
  );
}

export default function EventsPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;

    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) setProfile(snap.data());
    });
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAllEvents();
        if (!cancelled) setEvents(data);
      } catch (err) {
        console.error("Events fetch error:", err);
        if (!cancelled) {
          setError("Failed to load events. Please try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesFilter =
        activeFilter === "all" || event.type === activeFilter;
      const matchesSearch = event.title
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [events, activeFilter, searchQuery]);

  if (authLoading || loading) return <PageLoader />;
  if (!user) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Events</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Discover workshops, hackathons, competitions, and seminars hosted by
            CSI VIT Chennai.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "border border-blue-500/15 bg-[#0c1425] text-zinc-400 hover:border-blue-500/30 hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-sm">
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder="Search events by title…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-blue-500/15 bg-[#0c1425] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/30"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-blue-500/20 bg-[#0c1425]/50 px-6 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 ring-1 ring-blue-500/20">
              <svg
                className="h-8 w-8 text-blue-400"
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
            </div>
            <h2 className="text-lg font-semibold text-white">No events yet</h2>
            <p className="mt-2 max-w-md text-sm text-zinc-500">
              Events will appear here once they are added to the chapter calendar.
              Check back soon for upcoming workshops and hackathons.
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-blue-500/10 bg-[#0c1425]/50 px-6 py-16 text-center">
            <p className="text-sm text-zinc-500">
              No events match your search or filter. Try adjusting your criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => (
              <article
                key={event.id}
                className="group flex flex-col rounded-2xl border border-blue-500/10 bg-gradient-to-br from-[#0c1425] to-[#080d18] transition-all hover:border-blue-500/25 hover:shadow-lg hover:shadow-blue-900/20"
              >
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold leading-snug text-white group-hover:text-blue-300 transition-colors">
                      {event.title}
                    </h2>
                    <EventTypeBadge type={event.type} />
                  </div>

                  <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">
                    {event.description || "No description provided."}
                  </p>

                  <div className="mb-4 space-y-2 text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 shrink-0 text-blue-500/70"
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
                      {event.dateLabel}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 shrink-0 text-blue-500/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span
                        className={
                          event.seatsRemaining === 0
                            ? "text-red-400"
                            : "text-zinc-400"
                        }
                      >
                        {event.seatsRemaining === 0
                          ? "No seats remaining"
                          : `${event.seatsRemaining} seat${event.seatsRemaining !== 1 ? "s" : ""} remaining`}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/events/${event.id}`}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/25"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
