export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  rows,
}) {
  const inputClass =
    "w-full rounded-xl border border-blue-500/15 bg-[#080d18] px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/30";

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-400">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </label>
      {rows ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClass}
        />
      )}
    </div>
  );
}
