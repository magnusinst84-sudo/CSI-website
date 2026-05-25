"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { fetchAllPosts, createPost, upvotePost } from "@/lib/community-data";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageLoader from "@/components/shared/PageLoader";
import Modal from "@/components/shared/Modal";
import FormField from "@/components/shared/FormField";

function PostCard({ post, userId, onUpvote, upvoting }) {
  const hasUpvoted = post.upvotes.includes(userId);
  const preview =
    post.body.length > 180 ? `${post.body.slice(0, 180)}…` : post.body;

  return (
    <article className="rounded-2xl border border-blue-500/10 bg-gradient-to-br from-[#0c1425] to-[#080d18] p-5 transition-all hover:border-blue-500/25">
      <div className="flex items-start gap-3">
        {post.authorPhoto ? (
          <Image
            src={post.authorPhoto}
            alt={post.authorName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border border-blue-500/20 object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 text-sm font-semibold text-blue-400">
            {post.authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white">{post.authorName}</p>
          <p className="text-xs text-zinc-500">{post.createdLabel}</p>
        </div>
      </div>

      <Link href={`/community/${post.id}`} className="mt-4 block group">
        <h2 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
          {post.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{preview}</p>
      </Link>

      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-500/10 px-2 py-0.5 text-[10px] text-zinc-400 ring-1 ring-zinc-500/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-blue-500/10 pt-4">
        <button
          type="button"
          onClick={() => onUpvote(post.id)}
          disabled={hasUpvoted || upvoting === post.id}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all ${
            hasUpvoted
              ? "bg-blue-600/20 text-blue-400 cursor-default"
              : "text-zinc-400 hover:bg-blue-600/10 hover:text-blue-400"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
          {post.upvoteCount} {post.upvoteCount === 1 ? "upvote" : "upvotes"}
        </button>
        <Link
          href={`/community/${post.id}`}
          className="text-xs font-medium text-blue-400 hover:underline"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}

export default function CommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const profile = useUserProfile(user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [upvoting, setUpvoting] = useState(null);
  const [form, setForm] = useState({ title: "", body: "", tags: "" });

  async function loadPosts() {
    const data = await fetchAllPosts();
    setPosts(data);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAllPosts();
        if (!cancelled) setPosts(data);
      } catch (err) {
        console.error("Posts fetch error:", err);
        if (!cancelled) setError("Failed to load posts.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreatePost(e) {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await createPost(
        {
          uid: user.uid,
          displayName: profile?.name || user.displayName,
          photoURL: profile?.photoURL || user.photoURL,
        },
        {
          title: form.title.trim(),
          body: form.body.trim(),
          tags,
        }
      );

      setForm({ title: "", body: "", tags: "" });
      setModalOpen(false);
      await loadPosts();
    } catch (err) {
      console.error("Create post error:", err);
      setError("Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpvote(postId) {
    if (!user) return;
    setUpvoting(postId);
    try {
      const added = await upvotePost(postId, user.uid);
      if (added) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  upvotes: [...p.upvotes, user.uid],
                  upvoteCount: p.upvoteCount + 1,
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Upvote error:", err);
    } finally {
      setUpvoting(null);
    }
  }

  if (authLoading || loading) return <PageLoader message="Loading community…" />;
  if (!user) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Community</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Discuss ideas, share updates, and connect with CSI VIT Chennai members.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/25"
          >
            New Post
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-blue-500/20 bg-[#0c1425]/50 px-6 py-20 text-center">
            <h2 className="text-lg font-semibold text-white">No posts yet</h2>
            <p className="mt-2 max-w-md text-sm text-zinc-500">
              Start the conversation. Create the first post for the community.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                userId={user.uid}
                onUpvote={handleUpvote}
                upvoting={upvoting}
              />
            ))}
          </div>
        )}
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Post">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <FormField
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Post title"
            required
          />
          <FormField
            label="Body"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Share your thoughts…"
            rows={6}
            required
          />
          <FormField
            label="Tags"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="tech, career, events (comma-separated)"
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
              {submitting ? "Posting…" : "Publish"}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
