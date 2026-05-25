export default function PageLoader({ message = "Loading…" }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060b14]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <p className="text-sm text-zinc-500">{message}</p>
      </div>
    </div>
  );
}
