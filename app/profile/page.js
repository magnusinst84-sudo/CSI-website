"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageLoader from "@/components/shared/PageLoader";
import FormField from "@/components/shared/FormField";
import TagInput from "@/components/shared/TagInput";
import { formatEventDate } from "@/lib/events-utils";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    twitter: "",
  });

  useEffect(() => {
    if (!user) return;

    async function load() {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setProfile(data);
          setName(data.name ?? user.displayName ?? "");
          setBio(data.bio ?? "");
          setSkills(Array.isArray(data.skills) ? data.skills : []);
          setSocialLinks({
            github: data.socialLinks?.github ?? "",
            linkedin: data.socialLinks?.linkedin ?? "",
            twitter: data.socialLinks?.twitter ?? "",
          });
        }
      } catch (err) {
        console.error("Profile load error:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        bio: bio.trim(),
        skills,
        socialLinks: {
          github: socialLinks.github.trim(),
          linkedin: socialLinks.linkedin.trim(),
          twitter: socialLinks.twitter.trim(),
        },
      });

      const updated = {
        ...profile,
        name: name.trim(),
        bio: bio.trim(),
        skills,
        socialLinks: {
          github: socialLinks.github.trim(),
          linkedin: socialLinks.linkedin.trim(),
          twitter: socialLinks.twitter.trim(),
        },
      };
      setProfile(updated);
      setSuccess("Profile saved successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Profile save error:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) return <PageLoader message="Loading profile…" />;
  if (!user) return null;

  const photoURL = profile?.photoURL || user.photoURL;
  const joinedLabel = formatEventDate(profile?.joinedAt);

  return (
    <DashboardLayout user={user} profile={profile ?? {}}>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Profile</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Manage your CSI VIT Chennai member profile.
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

        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-center gap-5 rounded-2xl border border-blue-500/10 bg-[#0c1425]/80 p-6">
            {photoURL ? (
              <Image
                src={photoURL}
                alt={name}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full border-2 border-blue-500/30 object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-500/30 bg-blue-600/20 text-2xl font-bold text-blue-400">
                {name.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <div>
              <p className="text-lg font-semibold text-white">{name || "Member"}</p>
              <p className="text-sm text-zinc-500">{user.email}</p>
              <span className="mt-2 inline-flex rounded-full bg-blue-600/15 px-2.5 py-0.5 text-xs font-medium capitalize text-blue-400 ring-1 ring-blue-500/25">
                {profile?.role ?? "student"}
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSave}
            className="space-y-6 rounded-2xl border border-blue-500/10 bg-[#0c1425]/80 p-6 sm:p-8"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Editable
            </h2>

            <FormField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              required
            />

            <FormField
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself…"
              rows={4}
            />

            <TagInput
              label="Skills"
              tags={skills}
              onAdd={(tag) => setSkills([...skills, tag])}
              onRemove={(tag) => setSkills(skills.filter((s) => s !== tag))}
              placeholder="Add a skill"
            />

            <div>
              <h3 className="mb-3 text-xs font-medium text-zinc-400">Social Links</h3>
              <div className="space-y-3">
                <FormField
                  label="GitHub"
                  value={socialLinks.github}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, github: e.target.value })
                  }
                  placeholder="https://github.com/username"
                />
                <FormField
                  label="LinkedIn"
                  value={socialLinks.linkedin}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/username"
                />
                <FormField
                  label="Twitter / X"
                  value={socialLinks.twitter}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, twitter: e.target.value })
                  }
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>

            <div className="border-t border-blue-500/10 pt-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Account Info (read-only)
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-blue-500/10 bg-[#080d18]/60 p-4">
                  <p className="text-xs text-zinc-500">Email</p>
                  <p className="mt-1 truncate text-sm font-medium text-white">
                    {user.email}
                  </p>
                </div>
                <div className="rounded-xl border border-blue-500/10 bg-[#080d18]/60 p-4">
                  <p className="text-xs text-zinc-500">Role</p>
                  <p className="mt-1 text-sm font-medium capitalize text-white">
                    {profile?.role ?? "student"}
                  </p>
                </div>
                <div className="rounded-xl border border-blue-500/10 bg-[#080d18]/60 p-4">
                  <p className="text-xs text-zinc-500">Joined</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {joinedLabel === "Date TBA" ? "—" : joinedLabel}
                  </p>
                </div>
                <div className="rounded-xl border border-blue-500/10 bg-[#080d18]/60 p-4 sm:col-span-3">
                  <p className="text-xs text-zinc-500">Points</p>
                  <p className="mt-1 text-2xl font-bold text-blue-400">
                    {(profile?.points ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/25 disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </form>
        </div>
      </main>
    </DashboardLayout>
  );
}
