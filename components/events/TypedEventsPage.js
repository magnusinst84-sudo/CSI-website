"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { fetchEventsByType } from "@/lib/events-data";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import EventTypeBadge from "@/components/events/EventTypeBadge";
import PageLoader from "@/components/shared/PageLoader";

function SearchInput({ value, onChange, placeholder }) {
  return (
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
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-blue-500/15 bg-[#0c1425] py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/30"
      />
    </div>
  );
}

function EventMetaRow({ icon, children, className = "text-zinc-400" }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${className}`}>
      {icon}
      {children}
    </div>
  );
}

const CalendarIcon = (
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
);

const UsersIcon = (
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
);

const ClockIcon = (
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default function TypedEventsPage({
  type,
  title,
  subtitle,
  searchPlaceholder,
  emptyTitle,
  emptyDescription,
  extraField,
}) {
  const { user, loading: authLoading } = useAuth();
  const profile = useUserProfile(user);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchEventsByType(type);
        if (!cancelled) setEvents(data);
      } catch (err) {
        console.error(`${type} fetch error:`, err);
        if (!cancelled) setError("Failed to load events. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [type]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [events, searchQuery]);

  if (authLoading || loading) return <PageLoader />;
  if (!user) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
          </div>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={searchPlaceholder}
          />
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
            <h2 className="text-lg font-semibold text-white">{emptyTitle}</h2>
            <p className="mt-2 max-w-md text-sm text-zinc-500">{emptyDescription}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-blue-500/10 bg-[#0c1425]/50 px-6 py-16 text-center">
            <p className="text-sm text-zinc-500">
              No results match your search. Try a different keyword.
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
                    <h2 className="text-lg font-semibold leading-snug text-white transition-colors group-hover:text-blue-300">
                      {event.title}
                    </h2>
                    <EventTypeBadge type={event.type} />
                  </div>

                  <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">
                    {event.description || "No description provided."}
                  </p>

                  <div className="mb-4 space-y-2">
                    <EventMetaRow icon={CalendarIcon}>{event.dateLabel}</EventMetaRow>
                    <EventMetaRow
                      icon={UsersIcon}
                      className={
                        event.seatsRemaining === 0 ? "text-red-400" : "text-zinc-400"
                      }
                    >
                      {event.seatsRemaining === 0
                        ? "No seats remaining"
                        : `${event.seatsRemaining} seat${event.seatsRemaining !== 1 ? "s" : ""} remaining`}
                    </EventMetaRow>
                    {extraField === "teamSize" && event.teamSize != null && (
                      <EventMetaRow icon={UsersIcon}>
                        Team Size: {event.teamSize}
                      </EventMetaRow>
                    )}
                    {extraField === "duration" && event.duration && (
                      <EventMetaRow icon={ClockIcon}>
                        Duration: {event.duration}
                      </EventMetaRow>
                    )}
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
