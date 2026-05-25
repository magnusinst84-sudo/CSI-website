"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  fetchPostById,
  fetchPostComments,
  upvotePost,
  addComment,
} from "@/lib/community-data";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageLoader from "@/components/shared/PageLoader";

export default function CommunityPostPage() {
  const params = useParams();
  const postId = params.id;
  const { user, loading: authLoading } = useAuth();
  const profile = useUserProfile(user);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

  useEffect(() => {
    if (!postId || !user) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [postData, commentsData] = await Promise.all([
          fetchPostById(postId),
          fetchPostComments(postId),
        ]);
        if (!cancelled) {
          if (!postData) setError("Post not found.");
          setPost(postData);
          setComments(commentsData);
        }
      } catch (err) {
        console.error("Post load error:", err);
        if (!cancelled) setError("Failed to load post.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [postId, user]);

  async function handleUpvote() {
    if (!user || !post) return;
    if (post.upvotes.includes(user.uid)) return;

    setUpvoting(true);
    try {
      const added = await upvotePost(postId, user.uid);
      if (added) {
        setPost((prev) =>
          prev
            ? {
                ...prev,
                upvotes: [...prev.upvotes, user.uid],
                upvoteCount: prev.upvoteCount + 1,
              }
            : prev
        );
      }
    } catch (err) {
      console.error("Upvote error:", err);
    } finally {
      setUpvoting(false);
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!user || !commentBody.trim()) return;

    setSubmitting(true);
    try {
      await addComment(
        postId,
        {
          uid: user.uid,
          displayName: profile?.name || user.displayName,
          photoURL: profile?.photoURL || user.photoURL,
        },
        commentBody.trim()
      );
      setCommentBody("");
      const commentsData = await fetchPostComments(postId);
      setComments(commentsData);
    } catch (err) {
      console.error("Comment error:", err);
      setError("Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loading) return <PageLoader />;
  if (!user) return null;

  const hasUpvoted = post?.upvotes.includes(user.uid);

  return (
    <DashboardLayout user={user} profile={profile}>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/community"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-blue-400"
        >
          ← Back to Community
        </Link>

        {error && !post ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-12 text-center text-red-400">
            {error}
          </div>
        ) : post ? (
          <div className="mx-auto max-w-2xl space-y-6">
            <article className="rounded-2xl border border-blue-500/10 bg-gradient-to-br from-[#0c1425] to-[#080d18] p-6 sm:p-8">
              <div className="flex items-start gap-3">
                {post.authorPhoto ? (
                  <Image
                    src={post.authorPhoto}
                    alt={post.authorName}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full border border-blue-500/20 object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 text-lg font-semibold text-blue-400">
                    {post.authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{post.authorName}</p>
                  <p className="text-xs text-zinc-500">{post.createdLabel}</p>
                </div>
              </div>

              <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
                {post.title}
              </h1>

              {post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-500/10 px-2.5 py-0.5 text-xs text-zinc-400 ring-1 ring-zinc-500/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                {post.body}
              </p>

              <div className="mt-6 border-t border-blue-500/10 pt-6">
                <button
                  type="button"
                  onClick={handleUpvote}
                  disabled={hasUpvoted || upvoting}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    hasUpvoted
                      ? "bg-blue-600/20 text-blue-400"
                      : "bg-blue-600/10 text-zinc-300 hover:bg-blue-600/20 hover:text-blue-400"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {post.upvoteCount} {post.upvoteCount === 1 ? "upvote" : "upvotes"}
                </button>
              </div>
            </article>

            <section className="rounded-2xl border border-blue-500/10 bg-[#0c1425]/80 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Comments ({comments.length})
              </h2>

              <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder="Write a comment…"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-blue-500/15 bg-[#080d18] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/30"
                />
                <button
                  type="submit"
                  disabled={submitting || !commentBody.trim()}
                  className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
                >
                  {submitting ? "Posting…" : "Add Comment"}
                </button>
              </form>

              {comments.length === 0 ? (
                <p className="text-center text-sm text-zinc-500 py-4">
                  No comments yet. Be the first to reply.
                </p>
              ) : (
                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <li
                      key={comment.id}
                      className="flex gap-3 rounded-xl border border-blue-500/10 bg-[#080d18]/60 p-4"
                    >
                      {comment.authorPhoto ? (
                        <Image
                          src={comment.authorPhoto}
                          alt={comment.authorName}
                          width={36}
                          height={36}
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-xs font-semibold text-blue-400">
                          {comment.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">
                          {comment.authorName}
                          <span className="ml-2 text-xs font-normal text-zinc-500">
                            {comment.createdLabel}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">{comment.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ) : null}
      </main>
    </DashboardLayout>
  );
}
