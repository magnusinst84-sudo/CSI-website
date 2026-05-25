"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { fetchMentors, createMentorRequest } from "@/lib/mentors-data";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageLoader from "@/components/shared/PageLoader";

export default function MentorsPage() {
  const { user, loading: authLoading } = useAuth();
  const profile = useUserProfile(user);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestingId, setRequestingId] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchMentors();
        if (!cancelled) setMentors(data);
      } catch (err) {
        console.error("Mentors fetch error:", err);
        if (!cancelled) setError("Failed to load mentors.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleConfirmRequest(mentorId) {
    if (!user || !message.trim()) return;

    setSubmitting(true);
    setError("");
    try {
      await createMentorRequest(user.uid, mentorId, message.trim());
      setSuccess("Session request sent successfully!");
      setRequestingId(null);
      setMessage("");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Mentor request error:", err);
      setError("Failed to send request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loading) return <PageLoader message="Loading mentors…" />;
  if (!user) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Mentors</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Connect with experienced mentors from CSI VIT Chennai for guidance and
            career support.
          </p>
        </div>

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {mentors.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-blue-500/20 bg-[#0c1425]/50 px-6 py-20 text-center">
            <h2 className="text-lg font-semibold text-white">No mentors yet</h2>
            <p className="mt-2 max-w-md text-sm text-zinc-500">
              Mentor profiles will appear here once they are added to the chapter.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {mentors.map((mentor) => (
              <article
                key={mentor.id}
                className="flex flex-col rounded-2xl border border-blue-500/10 bg-gradient-to-br from-[#0c1425] to-[#080d18] p-5 transition-all hover:border-blue-500/25"
              >
                <div className="flex items-start gap-4">
                  {mentor.photoURL ? (
                    <Image
                      src={mentor.photoURL}
                      alt={mentor.name}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full border-2 border-blue-500/20 object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-blue-500/20 bg-blue-600/20 text-lg font-semibold text-blue-400">
                      {mentor.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-white">{mentor.name}</h2>
                    <span className="mt-1 inline-flex rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-violet-400 ring-1 ring-violet-500/25">
                      Mentor
                    </span>
                  </div>
                </div>

                {mentor.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {mentor.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-600/10 px-2.5 py-0.5 text-[10px] font-medium text-blue-400 ring-1 ring-blue-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-400">
                  {mentor.bio || "No bio provided."}
                </p>

                {requestingId === mentor.id ? (
                  <div className="mt-4 space-y-3">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What would you like help with?"
                      rows={3}
                      className="w-full resize-none rounded-xl border border-blue-500/15 bg-[#080d18] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/30"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRequestingId(null);
                          setMessage("");
                        }}
                        className="flex-1 rounded-xl border border-zinc-700 px-3 py-2 text-xs text-zinc-400 hover:bg-white/5"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConfirmRequest(mentor.id)}
                        disabled={submitting || !message.trim()}
                        className="flex-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-60"
                      >
                        {submitting ? "Sending…" : "Confirm Request"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setRequestingId(mentor.id);
                      setMessage("");
                      setError("");
                    }}
                    className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/25"
                  >
                    Request Session
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
