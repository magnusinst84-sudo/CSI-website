"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { db } from "@/lib/firebase";
import {
  createEvent,
  issueCertificate,
  addUserPoints,
  fetchAllApplications,
  updateApplicationStatus,
} from "@/lib/admin-data";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageLoader from "@/components/shared/PageLoader";
import FormField from "@/components/shared/FormField";
import StatusBadge from "@/components/shared/StatusBadge";

const EVENT_TYPES = ["workshop", "hackathon", "competition", "seminar"];

const EMPTY_EVENT = {
  title: "",
  description: "",
  type: "workshop",
  venue: "",
  seats: "",
  date: "",
  teamSize: "",
  duration: "",
};

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const profile = useUserProfile(user);

  const [roleChecked, setRoleChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  const [eventForm, setEventForm] = useState(EMPTY_EVENT);
  const [certForm, setCertForm] = useState({ userId: "", eventName: "", eventId: "" });
  const [pointsForm, setPointsForm] = useState({ userId: "", points: "" });

  const [submitting, setSubmitting] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!user) return;

    async function checkRole() {
      const snap = await getDoc(doc(db, "users", user.uid));
      const role = snap.exists() ? snap.data().role : "student";
      if (role !== "admin") {
        router.replace("/dashboard");
        return;
      }
      setIsAdmin(true);
      setRoleChecked(true);
    }

    checkRole();
  }, [user, router]);

  useEffect(() => {
    if (!isAdmin) return;

    async function loadApps() {
      setLoadingApps(true);
      try {
        const data = await fetchAllApplications();
        setApplications(data);
      } catch (err) {
        console.error("Applications load error:", err);
      } finally {
        setLoadingApps(false);
      }
    }

    loadApps();
  }, [isAdmin]);

  function showMessage(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  }

  async function handleCreateEvent(e) {
    e.preventDefault();
    setSubmitting("event");
    try {
      await createEvent(eventForm);
      setEventForm(EMPTY_EVENT);
      showMessage("success", "Event created successfully!");
    } catch (err) {
      console.error("Create event error:", err);
      showMessage("error", "Failed to create event.");
    } finally {
      setSubmitting("");
    }
  }

  async function handleIssueCertificate(e) {
    e.preventDefault();
    setSubmitting("cert");
    try {
      const certId = await issueCertificate(certForm);
      setCertForm({ userId: "", eventName: "", eventId: "" });
      showMessage("success", `Certificate issued! ID: ${certId}`);
    } catch (err) {
      console.error("Issue certificate error:", err);
      showMessage("error", "Failed to issue certificate.");
    } finally {
      setSubmitting("");
    }
  }

  async function handleAddPoints(e) {
    e.preventDefault();
    setSubmitting("points");
    try {
      await addUserPoints(pointsForm.userId, pointsForm.points);
      setPointsForm({ userId: "", points: "" });
      showMessage("success", "Points updated successfully!");
    } catch (err) {
      if (err.message === "USER_NOT_FOUND") {
        showMessage("error", "User not found.");
      } else {
        console.error("Add points error:", err);
        showMessage("error", "Failed to update points.");
      }
    } finally {
      setSubmitting("");
    }
  }

  async function handleApplicationAction(appId, status) {
    try {
      await updateApplicationStatus(appId, status);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a))
      );
      showMessage("success", `Application ${status}.`);
    } catch (err) {
      console.error("Update application error:", err);
      showMessage("error", "Failed to update application.");
    }
  }

  if (authLoading || !roleChecked) {
    return <PageLoader message="Verifying access…" />;
  }

  if (!isAdmin) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Admin Panel</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Manage events, certificates, points, and applications for CSI VIT Chennai.
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-2">
          {/* Create Event */}
          <section className="rounded-2xl border border-blue-500/10 bg-[#0c1425]/80 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Create Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-3">
              <FormField
                label="Title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                required
              />
              <FormField
                label="Description"
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
                rows={3}
                required
              />
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Type
                </label>
                <select
                  value={eventForm.type}
                  onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                  className="w-full rounded-xl border border-blue-500/15 bg-[#080d18] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/40"
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <FormField
                label="Venue"
                value={eventForm.venue}
                onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                  label="Seats"
                  type="number"
                  value={eventForm.seats}
                  onChange={(e) => setEventForm({ ...eventForm, seats: e.target.value })}
                />
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    required
                    className="w-full rounded-xl border border-blue-500/15 bg-[#080d18] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/40"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                  label="Team Size (hackathons)"
                  type="number"
                  value={eventForm.teamSize}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, teamSize: e.target.value })
                  }
                />
                <FormField
                  label="Duration (workshops)"
                  value={eventForm.duration}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, duration: e.target.value })
                  }
                  placeholder="e.g. 3 hours"
                />
              </div>
              <button
                type="submit"
                disabled={submitting === "event"}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
              >
                {submitting === "event" ? "Creating…" : "Create Event"}
              </button>
            </form>
          </section>

          {/* Issue Certificate */}
          <section className="rounded-2xl border border-blue-500/10 bg-[#0c1425]/80 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Issue Certificate</h2>
            <form onSubmit={handleIssueCertificate} className="space-y-3">
              <FormField
                label="User ID"
                value={certForm.userId}
                onChange={(e) => setCertForm({ ...certForm, userId: e.target.value })}
                placeholder="Firebase UID"
                required
              />
              <FormField
                label="Event Name"
                value={certForm.eventName}
                onChange={(e) =>
                  setCertForm({ ...certForm, eventName: e.target.value })
                }
                required
              />
              <FormField
                label="Event ID (optional)"
                value={certForm.eventId}
                onChange={(e) => setCertForm({ ...certForm, eventId: e.target.value })}
              />
              <button
                type="submit"
                disabled={submitting === "cert"}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
              >
                {submitting === "cert" ? "Issuing…" : "Issue Certificate"}
              </button>
            </form>
          </section>

          {/* Update Points */}
          <section className="rounded-2xl border border-blue-500/10 bg-[#0c1425]/80 p-6 xl:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-white">Update Points</h2>
            <form
              onSubmit={handleAddPoints}
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <div className="flex-1">
                <FormField
                  label="User ID"
                  value={pointsForm.userId}
                  onChange={(e) =>
                    setPointsForm({ ...pointsForm, userId: e.target.value })
                  }
                  placeholder="Firebase UID"
                  required
                />
              </div>
              <div className="w-full sm:w-40">
                <FormField
                  label="Points to Add"
                  type="number"
                  value={pointsForm.points}
                  onChange={(e) =>
                    setPointsForm({ ...pointsForm, points: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting === "points"}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
              >
                {submitting === "points" ? "Updating…" : "Add Points"}
              </button>
            </form>
          </section>
        </div>

        {/* Applications table */}
        <section className="mt-8 rounded-2xl border border-blue-500/10 bg-[#0c1425]/80 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Applications</h2>

          {loadingApps ? (
            <p className="text-sm text-zinc-500">Loading applications…</p>
          ) : applications.length === 0 ? (
            <p className="text-sm text-zinc-500">No applications submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-blue-500/10 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="pb-3 pr-4">User ID</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Role</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10">
                  {applications.map((app) => (
                    <tr key={app.id} className="text-zinc-300">
                      <td className="py-3 pr-4 font-mono text-xs text-zinc-500">
                        {app.userId.slice(0, 12)}…
                      </td>
                      <td className="py-3 pr-4 capitalize">{app.type}</td>
                      <td className="py-3 pr-4">{app.role}</td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-3">
                        {app.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleApplicationAction(app.id, "approved")
                              }
                              className="rounded-lg bg-emerald-600/20 px-3 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-600/30"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleApplicationAction(app.id, "rejected")
                              }
                              className="rounded-lg bg-red-600/20 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-600/30"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </DashboardLayout>
  );
}
