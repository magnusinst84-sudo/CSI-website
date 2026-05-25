"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  fetchUserApplications,
  createApplication,
} from "@/lib/applications-data";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageLoader from "@/components/shared/PageLoader";
import FormField from "@/components/shared/FormField";
import StatusBadge from "@/components/shared/StatusBadge";

const TABS = [
  { id: "team", label: "Project Team" },
  { id: "council", label: "Council" },
];

const EMPTY_FORM = { role: "", motivation: "", skills: "" };

export default function ApplyPage() {
  const { user, loading: authLoading } = useAuth();
  const profile = useUserProfile(user);
  const [activeTab, setActiveTab] = useState("team");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  async function loadApplications() {
    if (!user) return;
    const data = await fetchUserApplications(user.uid);
    setApplications(data);
  }

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchUserApplications(user.uid);
        if (!cancelled) setApplications(data);
      } catch (err) {
        console.error("Applications fetch error:", err);
        if (!cancelled) setError("Failed to load applications.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const tabApplications = applications.filter((a) => a.type === activeTab);
  const hasPending = tabApplications.some((a) => a.status === "pending");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const skills = form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await createApplication(user.uid, {
        type: activeTab,
        role: form.role.trim(),
        motivation: form.motivation.trim(),
        skills,
      });

      setForm(EMPTY_FORM);
      setSuccess(
        `Your ${activeTab === "team" ? "Project Team" : "Council"} application has been submitted!`
      );
      await loadApplications();
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      if (err.message === "DUPLICATE_PENDING") {
        setError(
          "You already have a pending application for this category. Please wait for a decision."
        );
      } else {
        console.error("Application submit error:", err);
        setError("Failed to submit application. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loading) return <PageLoader message="Loading applications…" />;
  if (!user) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Apply for Team / Council
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Join the CSI VIT Chennai project team or student council.
          </p>
        </div>

        <div className="mb-6 flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setForm(EMPTY_FORM);
                setError("");
              }}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "border border-blue-500/15 bg-[#0c1425] text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-2xl space-y-8">
          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              {success}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-blue-500/10 bg-[#0c1425]/80 p-6 sm:p-8"
          >
            <h2 className="text-lg font-semibold text-white">
              {activeTab === "team" ? "Project Team Application" : "Council Application"}
            </h2>

            {hasPending && (
              <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
                You have a pending application for this section. A new submission is
                blocked until it is reviewed.
              </p>
            )}

            <FormField
              label="Role Applying For"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder={
                activeTab === "team"
                  ? "e.g. Frontend Developer, Designer"
                  : "e.g. Technical Secretary, Events Head"
              }
              required
            />
            <FormField
              label="Motivation"
              value={form.motivation}
              onChange={(e) => setForm({ ...form, motivation: e.target.value })}
              placeholder="Why do you want to join?"
              rows={5}
              required
            />
            <FormField
              label="Skills"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="React, Leadership, Public Speaking (comma-separated)"
            />

            <button
              type="submit"
              disabled={submitting || hasPending}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          </form>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-white">
              Your Applications
            </h2>
            {tabApplications.length === 0 ? (
              <p className="rounded-xl border border-blue-500/10 bg-[#0c1425]/50 px-6 py-8 text-center text-sm text-zinc-500">
                No applications submitted for this section yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {tabApplications.map((app) => (
                  <li
                    key={app.id}
                    className="rounded-xl border border-blue-500/10 bg-[#0c1425]/80 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{app.role}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Submitted {app.createdLabel}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-zinc-400">
                      {app.motivation}
                    </p>
                    {app.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {app.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-blue-600/10 px-2 py-0.5 text-[10px] text-blue-400 ring-1 ring-blue-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}
