"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  fetchEventById,
  isUserRegistered,
  registerForEvent,
} from "@/lib/events-data";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import EventTypeBadge from "@/components/events/EventTypeBadge";

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060b14]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState({});
  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) setProfile(snap.data());
    });
  }, [user]);

  useEffect(() => {
    if (!eventId || !user) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [eventData, isRegistered] = await Promise.all([
          fetchEventById(eventId),
          isUserRegistered(user.uid, eventId),
        ]);

        if (!cancelled) {
          if (!eventData) {
            setError("Event not found.");
            setEvent(null);
          } else {
            setEvent(eventData);
            setRegistered(isRegistered);
          }
        }
      } catch (err) {
        console.error("Event detail error:", err);
        if (!cancelled) setError("Failed to load event details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [eventId, user]);

  async function handleRegister() {
    if (!user || !event) return;

    setRegistering(true);
    setRegisterMessage("");
    setError("");

    try {
      await registerForEvent(user.uid, eventId);
      setRegistered(true);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              registeredCount: prev.registeredCount + 1,
              seatsRemaining: Math.max(0, prev.seatsRemaining - 1),
            }
          : prev
      );
      setRegisterMessage("Successfully registered for this event!");
    } catch (err) {
      if (err.message === "ALREADY_REGISTERED") {
        setRegistered(true);
        setRegisterMessage("You are already registered for this event.");
      } else if (err.message === "EVENT_FULL") {
        setError("This event is full. No seats remaining.");
      } else if (err.message === "EVENT_NOT_FOUND") {
        setError("Event not found.");
      } else {
        console.error("Registration error:", err);
        setError("Registration failed. Please try again.");
      }
    } finally {
      setRegistering(false);
    }
  }

  if (authLoading || loading) return <PageLoader />;
  if (!user) return null;

  const isFull = event?.seatsRemaining === 0;
  const canRegister = !registered && !isFull;

  return (
    <DashboardLayout user={user} profile={profile}>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-blue-400"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Events
        </Link>

        {error && !event ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-16 text-center">
            <p className="text-red-400">{error}</p>
            <button
              type="button"
              onClick={() => router.push("/events")}
              className="mt-4 text-sm text-blue-400 hover:underline"
            >
              Return to events list
            </button>
          </div>
        ) : event ? (
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-blue-500/15 bg-gradient-to-br from-[#0c1425] to-[#080d18]">
              <div className="border-b border-blue-500/10 bg-blue-600/5 px-6 py-8 sm:px-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    {event.title}
                  </h1>
                  <EventTypeBadge type={event.type} />
                </div>
              </div>

              <div className="space-y-6 px-6 py-8 sm:px-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-blue-500/10 bg-[#080d18]/60 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Date
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {event.dateLabel}
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-500/10 bg-[#080d18]/60 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Venue
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {event.venue || "To be announced"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-500/10 bg-[#080d18]/60 p-4 sm:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Seats Remaining
                    </p>
                    <p
                      className={`mt-1 text-sm font-medium ${
                        isFull ? "text-red-400" : "text-white"
                      }`}
                    >
                      {isFull
                        ? "No seats remaining"
                        : `${event.seatsRemaining} of ${event.seats} seats available`}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                    About this event
                  </h2>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                    {event.description || "No description provided for this event."}
                  </p>
                </div>

                {registerMessage && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                    {registerMessage}
                  </div>
                )}

                {error && event && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={!canRegister || registering}
                  className={`w-full rounded-xl px-6 py-3.5 text-sm font-semibold transition-all sm:w-auto ${
                    canRegister
                      ? "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/25 disabled:opacity-60"
                      : "cursor-not-allowed border border-zinc-700 bg-zinc-800/50 text-zinc-500"
                  }`}
                >
                  {registering
                    ? "Registering…"
                    : registered
                      ? "Already Registered"
                      : isFull
                        ? "Event Full"
                        : "Register"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </DashboardLayout>
  );
}
