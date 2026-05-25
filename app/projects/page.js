"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { fetchAllProjects, createProject } from "@/lib/projects-data";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageLoader from "@/components/shared/PageLoader";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/shared/FormField";

export default function ProjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const profile = useUserProfile(user);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    githubUrl: "",
    demoUrl: "",
    coverImage: "",
  });

  async function loadProjects() {
    const data = await fetchAllProjects();
    setProjects(data);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAllProjects();
        if (!cancelled) setProjects(data);
      } catch (err) {
        console.error("Projects fetch error:", err);
        if (!cancelled) setError("Failed to load projects.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const techStack = form.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await createProject(user.uid, {
        title: form.title.trim(),
        description: form.description.trim(),
        techStack,
        githubUrl: form.githubUrl.trim(),
        demoUrl: form.demoUrl.trim(),
        coverImage: form.coverImage.trim(),
      });

      setForm({
        title: "",
        description: "",
        techStack: "",
        githubUrl: "",
        demoUrl: "",
        coverImage: "",
      });
      setModalOpen(false);
      await loadProjects();
    } catch (err) {
      console.error("Submit project error:", err);
      setError("Failed to submit project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loading) return <PageLoader message="Loading projects…" />;
  if (!user) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Projects</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Showcase innovative builds from CSI VIT Chennai members.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/25"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Submit Project
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-blue-500/20 bg-[#0c1425]/50 px-6 py-20 text-center">
            <h2 className="text-lg font-semibold text-white">No projects yet</h2>
            <p className="mt-2 max-w-md text-sm text-zinc-500">
              Be the first to share your work. Click Submit Project to add yours.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-blue-500/10 bg-gradient-to-br from-[#0c1425] to-[#080d18] transition-all hover:border-blue-500/25 hover:shadow-lg hover:shadow-blue-900/20"
              >
                {project.coverImage ? (
                  <div className="relative h-40 w-full overflow-hidden bg-[#080d18]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center bg-blue-600/5">
                    <svg className="h-12 w-12 text-blue-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {project.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-zinc-400">
                    {project.description || "No description."}
                  </p>
                  {project.techStack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-blue-600/10 px-2.5 py-0.5 text-[10px] font-medium text-blue-400 ring-1 ring-blue-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-blue-500/20 bg-blue-600/10 px-3 py-2 text-xs font-medium text-blue-400 transition-all hover:bg-blue-600/20"
                      >
                        GitHub
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-blue-500"
                      >
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Submit Project">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Project name"
            required
          />
          <FormField
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What does your project do?"
            rows={4}
            required
          />
          <FormField
            label="Tech Stack"
            value={form.techStack}
            onChange={(e) => setForm({ ...form, techStack: e.target.value })}
            placeholder="React, Node.js, Firebase (comma-separated)"
          />
          <FormField
            label="GitHub URL"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            placeholder="https://github.com/..."
          />
          <FormField
            label="Demo URL"
            value={form.demoUrl}
            onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
            placeholder="https://..."
          />
          <FormField
            label="Cover Image URL"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            placeholder="https://..."
          />
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
