"use client";

import { useState } from "react";

export default function TagInput({ tags, onAdd, onRemove, placeholder, label }) {
  const [input, setInput] = useState("");

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = input.trim();
      if (value && !tags.includes(value)) {
        onAdd(value);
        setInput("");
      }
    }
  }

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-zinc-400">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2 rounded-xl border border-blue-500/15 bg-[#080d18] p-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-blue-600/15 px-2.5 py-1 text-xs text-blue-300 ring-1 ring-blue-500/25"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="text-blue-400 hover:text-white"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-w-[120px] flex-1 bg-transparent px-2 py-1 text-sm text-white outline-none placeholder:text-zinc-600"
        />
      </div>
      <p className="mt-1 text-[10px] text-zinc-600">Press Enter to add</p>
    </div>
  );
}
