"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { fetchUserCertificates } from "@/lib/certificates-data";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageLoader from "@/components/shared/PageLoader";
import CertificateCard from "@/components/certificates/CertificateCard";

export default function CertificatesPage() {
  const { user, loading: authLoading } = useAuth();
  const profile = useUserProfile(user);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchUserCertificates(user.uid);
        if (!cancelled) setCertificates(data);
      } catch (err) {
        console.error("Certificates fetch error:", err);
        if (!cancelled) setError("Failed to load certificates.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading || loading) return <PageLoader message="Loading certificates…" />;
  if (!user) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            My Certificates
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Your verified certificates of participation from CSI VIT Chennai events.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {certificates.length === 0 ? (
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
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white">No certificates yet</h2>
            <p className="mt-2 max-w-md text-sm text-zinc-500">
              Certificates are issued after you participate in chapter events. Check
              back once you&apos;ve attended a workshop or hackathon.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {certificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
