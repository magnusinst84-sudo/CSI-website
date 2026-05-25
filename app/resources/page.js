"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { fetchAllResources } from "@/lib/resources-data";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageLoader from "@/components/shared/PageLoader";

const TYPE_STYLES = {
  pdf: "bg-red-500/15 text-red-400 ring-red-500/30",
  video: "bg-purple-500/15 text-purple-400 ring-purple-500/30",
  link: "bg-blue-500/15 text-blue-400 ring-blue-500/30",
};

function ResourceTypeBadge({ type }) {
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.link;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${style}`}
    >
      {type}
    </span>
  );
}

function CategoryBadge({ category }) {
  return (
    <span className="inline-flex rounded-full bg-zinc-500/15 px-2.5 py-0.5 text-[10px] font-medium text-zinc-400 ring-1 ring-zinc-500/25">
      {category}
    </span>
  );
}

const TYPE_ICONS = {
  pdf: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  ),
  video: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  ),
  link: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  ),
};

export default function ResourcesPage() {
  const { user, loading: authLoading } = useAuth();
  const profile = useUserProfile(user);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAllResources();
        if (!cancelled) setResources(data);
      } catch (err) {
        console.error("Resources fetch error:", err);
        if (!cancelled) setError("Failed to load resources. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return resources;
    return resources.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [resources, searchQuery]);

  if (authLoading || loading) return <PageLoader />;
  if (!user) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Resources</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Study materials, recordings, and useful links curated by CSI VIT
              Chennai.
            </p>
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
              placeholder="Search resources…"
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

        {resources.length === 0 ? (
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
                  d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white">No resources yet</h2>
            <p className="mt-2 max-w-md text-sm text-zinc-500">
              Learning resources will appear here once uploaded by the chapter.
              Check back for PDFs, videos, and helpful links.
            </p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="rounded-2xl border border-blue-500/10 bg-[#0c1425]/50 px-6 py-16 text-center">
            <p className="text-sm text-zinc-500">
              No resources match your search. Try a different keyword.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredResources.map((resource) => (
              <article
                key={resource.id}
                className="group flex flex-col rounded-2xl border border-blue-500/10 bg-gradient-to-br from-[#0c1425] to-[#080d18] transition-all hover:border-blue-500/25 hover:shadow-lg hover:shadow-blue-900/20"
              >
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 ring-1 ring-blue-500/20">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {TYPE_ICONS[resource.type] ?? TYPE_ICONS.link}
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-lg font-semibold text-white transition-colors group-hover:text-blue-300">
                        {resource.title}
                      </h2>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <ResourceTypeBadge type={resource.type} />
                        <CategoryBadge category={resource.category} />
                      </div>
                    </div>
                  </div>

                  <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">
                    {resource.description || "No description provided."}
                  </p>

                  {resource.uploadedLabel !== "Date TBA" && (
                    <p className="mb-4 text-xs text-zinc-500">
                      Uploaded {resource.uploadedLabel}
                    </p>
                  )}

                  <a
                    href={resource.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                      resource.url
                        ? "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/25"
                        : "cursor-not-allowed border border-zinc-700 bg-zinc-800/50 text-zinc-500"
                    }`}
                    aria-disabled={!resource.url}
                    onClick={(e) => {
                      if (!resource.url) e.preventDefault();
                    }}
                  >
                    Open Resource
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
