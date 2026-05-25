"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function CertificateCard({ certificate }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!cardRef.current) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0c1425",
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `CSI-Certificate-${certificate.certificateId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Certificate download error:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-[#0a1628] via-[#0c1425] to-[#060b14] p-8 text-center shadow-xl shadow-blue-900/20"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-600/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-blue-500/10 blur-xl" />

        <div className="relative border-b border-blue-500/20 pb-6">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-600/30">
            <span className="text-lg font-bold text-white">CSI</span>
          </div>
          <p className="text-sm font-semibold tracking-wide text-blue-400">
            CSI VIT Chennai
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Computer Society of India
          </p>
        </div>

        <div className="relative py-6">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
            Certificate of Participation
          </p>
          <p className="mt-4 text-xl font-bold text-white sm:text-2xl">
            {certificate.eventName}
          </p>
          <p className="mt-4 text-sm text-zinc-400">
            Issued on{" "}
            <span className="font-medium text-zinc-300">
              {certificate.issuedLabel}
            </span>
          </p>
        </div>

        <div className="relative border-t border-blue-500/20 pt-4">
          <p className="text-[10px] uppercase tracking-wider text-zinc-600">
            Certificate ID
          </p>
          <p className="mt-1 font-mono text-xs text-blue-400/90">
            {certificate.certificateId}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/25 disabled:opacity-60"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        {downloading ? "Generating…" : "Download"}
      </button>
    </div>
  );
}
