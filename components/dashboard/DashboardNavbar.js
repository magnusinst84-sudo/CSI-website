"use client";

import Image from "next/image";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function DashboardNavbar({ user, profile }) {
  const router = useRouter();
  const displayName = profile?.name || user?.displayName || "Member";
  const photoURL = profile?.photoURL || user?.photoURL;

  async function handleSignOut() {
    try {
      await signOut(auth);
      await fetch("/api/auth/session", { method: "DELETE" });
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-blue-500/10 bg-[#060b14]/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <img src="/csi-logo.png" alt="CSI Logo" className="h-8 w-8 rounded-lg object-cover" />
        <span className="text-sm font-semibold text-white">CSI VIT Chennai</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-white">{displayName}</p>
          <p className="text-xs text-zinc-500">{user?.email}</p>
        </div>

        {photoURL ? (
          <Image
            src={photoURL}
            alt={displayName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border-2 border-blue-500/30 object-cover ring-2 ring-blue-600/20"
            unoptimized
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-500/30 bg-blue-600/20 text-sm font-semibold text-blue-400">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-lg border border-blue-500/20 bg-blue-600/10 px-3 py-2 text-xs font-medium text-blue-400 transition-all hover:border-blue-500/40 hover:bg-blue-600/20 sm:px-4 sm:text-sm"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
