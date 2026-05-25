"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { fetchLeaderboard } from "@/lib/leaderboard-data";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageLoader from "@/components/shared/PageLoader";

const RANK_BADGES = {
  1: {
    label: "Gold",
    className: "bg-amber-400/20 text-amber-300 ring-amber-400/40",
    icon: "🥇",
  },
  2: {
    label: "Silver",
    className: "bg-zinc-300/15 text-zinc-200 ring-zinc-300/30",
    icon: "🥈",
  },
  3: {
    label: "Bronze",
    className: "bg-orange-600/20 text-orange-400 ring-orange-500/30",
    icon: "🥉",
  },
};

function RankBadge({ rank }) {
  const badge = RANK_BADGES[rank];
  if (!badge) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#080d18] text-sm font-bold text-zinc-400 ring-1 ring-blue-500/10">
        {rank}
      </span>
    );
  }

  return (
    <span
      className={`flex h-8 min-w-[2rem] items-center justify-center gap-1 rounded-lg px-2 text-xs font-bold ring-1 ${badge.className}`}
      title={badge.label}
    >
      <span>{badge.icon}</span>
      <span className="hidden sm:inline">{badge.label}</span>
    </span>
  );
}

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const profile = useUserProfile(user);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchLeaderboard();
        if (!cancelled) setEntries(data);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        if (!cancelled) {
          setError("Failed to load leaderboard. Ensure a Firestore index exists for users.points.");
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

  if (authLoading || loading) return <PageLoader message="Loading leaderboard…" />;
  if (!user) return null;

  const currentUserEntry = entries.find((e) => e.id === user.uid);

  return (
    <DashboardLayout user={user} profile={profile}>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Leaderboard</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Top performers in the CSI VIT Chennai chapter ranked by activity points.
          </p>
        </div>

        {currentUserEntry && (
          <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-600/5 px-4 py-3 text-sm text-blue-300">
            Your rank:{" "}
            <span className="font-bold text-white">#{currentUserEntry.rank}</span>
            {" · "}
            <span className="font-bold text-white">
              {currentUserEntry.points.toLocaleString()} points
            </span>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-blue-500/20 bg-[#0c1425]/50 px-6 py-20 text-center">
            <h2 className="text-lg font-semibold text-white">No members yet</h2>
            <p className="mt-2 max-w-md text-sm text-zinc-500">
              The leaderboard will populate as members earn points from events and
              activities.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-blue-500/10 bg-[#0c1425]/80">
            <div className="hidden border-b border-blue-500/10 bg-blue-600/5 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:grid sm:grid-cols-[auto_1fr_auto] sm:gap-4">
              <span>Rank</span>
              <span>Member</span>
              <span className="text-right">Points</span>
            </div>
            <ul className="divide-y divide-blue-500/10">
              {entries.map((entry) => {
                const isCurrentUser = entry.id === user.uid;
                return (
                  <li
                    key={entry.id}
                    className={`flex items-center gap-4 px-4 py-4 transition-colors sm:grid sm:grid-cols-[auto_1fr_auto] sm:px-6 ${
                      isCurrentUser
                        ? "bg-blue-600/10 ring-1 ring-inset ring-blue-500/30"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="shrink-0">
                      <RankBadge rank={entry.rank} />
                    </div>

                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {entry.photoURL ? (
                        <Image
                          src={entry.photoURL}
                          alt={entry.name}
                          width={44}
                          height={44}
                          className="h-11 w-11 shrink-0 rounded-full border-2 border-blue-500/20 object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-blue-500/20 bg-blue-600/20 text-sm font-semibold text-blue-400">
                          {entry.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p
                          className={`truncate font-medium ${isCurrentUser ? "text-blue-300" : "text-white"}`}
                        >
                          {entry.name}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs font-normal text-blue-400">
                              (You)
                            </span>
                          )}
                        </p>
                        <p className="text-xs capitalize text-zinc-500">
                          {entry.role}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`text-lg font-bold tabular-nums ${isCurrentUser ? "text-blue-400" : "text-white"}`}
                      >
                        {entry.points.toLocaleString()}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                        pts
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
