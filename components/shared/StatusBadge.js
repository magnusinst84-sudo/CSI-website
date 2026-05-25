const STATUS_STYLES = {
  pending: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  rejected: "bg-red-500/15 text-red-400 ring-red-500/30",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${style}`}
    >
      {status}
    </span>
  );
}
