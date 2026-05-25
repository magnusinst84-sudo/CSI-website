const TYPE_STYLES = {
  workshop: "bg-blue-500/15 text-blue-400 ring-blue-500/30",
  hackathon: "bg-violet-500/15 text-violet-400 ring-violet-500/30",
  competition: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  seminar: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
};

export default function EventTypeBadge({ type }) {
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.workshop;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${style}`}
    >
      {type}
    </span>
  );
}
