const TYPE_STYLES = {
  workshop: "bg-blue-500/15 text-blue-400 ring-blue-500/30",
  hackathon: "bg-indigo-500/15 text-indigo-400 ring-indigo-500/30",
  competition: "bg-cyan-500/15 text-cyan-400 ring-cyan-500/30",
  seminar: "bg-sky-500/15 text-sky-400 ring-sky-500/30",
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
