"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const WELCOME_LINES = [
  "Welcome to CSI VIT Chennai Terminal v1.0",
  "Type 'help' to see available commands.",
];

const HELP_TEXT = `Available commands:
  help              - Show this help message
  explore events    - Navigate to Events page
  join csi          - Go to login page
  show hackathons   - Navigate to Hackathons page
  leaderboard       - Navigate to Leaderboard page
  show projects     - Navigate to Projects page
  community         - Navigate to Community page
  about             - About CSI VIT Chennai
  members           - Chapter member stats
  events            - Event statistics
  whoami            - Show your account info
  clear             - Clear terminal output`;

function normalizeCommand(input) {
  return input.trim().toLowerCase();
}

export default function Terminal({ isOpen, onClose, user, profile }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const welcomedRef = useRef(false);
  const typewriterRef = useRef(null);

  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []);

  const appendLine = useCallback(
    (text, prefix = "") => {
      setLines((prev) => [...prev, { text, prefix, id: `${Date.now()}-${Math.random()}` }]);
      setTimeout(scrollToBottom, 0);
    },
    [scrollToBottom]
  );

  const typewriterPrint = useCallback(
    (text, onComplete) => {
      return new Promise((resolve) => {
        if (typewriterRef.current) clearInterval(typewriterRef.current);

        setIsTyping(true);
        const lineId = `${Date.now()}-tw-${Math.random()}`;
        let index = 0;

        setLines((prev) => [
          ...prev,
          { text: "", prefix: "> ", id: lineId, typing: true },
        ]);

        typewriterRef.current = setInterval(() => {
          index += 1;
          const slice = text.slice(0, index);
          setLines((prev) =>
            prev.map((l) => (l.id === lineId ? { ...l, text: slice } : l))
          );
          scrollToBottom();

          if (index >= text.length) {
            clearInterval(typewriterRef.current);
            typewriterRef.current = null;
            setLines((prev) =>
              prev.map((l) => (l.id === lineId ? { ...l, typing: false } : l))
            );
            setIsTyping(false);
            onComplete?.();
            resolve();
          }
        }, 20);
      });
    },
    [scrollToBottom]
  );

  const runCommand = useCallback(
    (raw) => {
      const cmd = normalizeCommand(raw);
      if (!cmd) return;

      appendLine(raw, "$ ");

      const navigate = (path, message) => {
        typewriterPrint(message, () => {
          setTimeout(() => {
            router.push(path);
            onClose();
          }, 1000);
        });
      };

      switch (cmd) {
        case "help":
          typewriterPrint(HELP_TEXT);
          break;
        case "explore events":
          navigate("/events", "Navigating to Events...");
          break;
        case "join csi":
          navigate("/login", "Redirecting to login...");
          break;
        case "show hackathons":
          navigate("/hackathons", "Navigating to Hackathons...");
          break;
        case "leaderboard":
          navigate("/leaderboard", "Navigating to Leaderboard...");
          break;
        case "show projects":
          navigate("/projects", "Navigating to Projects...");
          break;
        case "community":
          navigate("/community", "Navigating to Community...");
          break;
        case "about":
          typewriterPrint(
            "CSI VIT Chennai is the student chapter of Computer Society of India at VIT Chennai, empowering students through tech events, hackathons, workshops, and mentorship."
          );
          break;
        case "members":
          typewriterPrint("500+ active members and growing.");
          break;
        case "events":
          typewriterPrint("50+ events conducted so far.");
          break;
        case "clear":
          setLines([]);
          break;
        case "whoami":
          if (user) {
            const name = profile?.name || user.displayName || "Member";
            const role = profile?.role || "student";
            typewriterPrint(`${name} (${role})`);
          } else {
            typewriterPrint(
              "You are a guest. Type 'join csi' to become a member."
            );
          }
          break;
        default:
          typewriterPrint(
            `Command not found: ${raw.trim()}. Type 'help' for available commands.`
          );
      }
    },
    [appendLine, typewriterPrint, router, onClose, user, profile]
  );

  useEffect(() => {
    if (!isOpen || welcomedRef.current) return;

    welcomedRef.current = true;

    async function showWelcome() {
      for (const line of WELCOME_LINES) {
        await typewriterPrint(line);
      }
    }

    showWelcome();
  }, [isOpen, typewriterPrint]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
    };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const value = input;
    setInput("");
    runCommand(value);
  }

  return (
    <div
      className={`fixed left-0 right-0 z-40 flex flex-col bg-[#0a0a0a] font-mono transition-transform duration-300 ease-out ${
        isOpen ? "translate-y-0" : "translate-y-full pointer-events-none"
      }`}
      style={{ bottom: 56, height: "40vh" }}
      aria-hidden={!isOpen}
    >
      {/* Chrome */}
      <div className="flex shrink-0 items-center gap-3 border-b border-zinc-800 bg-[#111111] px-4 py-2.5">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onClose}
            className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-400"
            aria-label="Close terminal"
          />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <span className="flex-1 text-center text-xs text-zinc-500">
          CSI VIT Chennai Terminal
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-500 transition-colors hover:text-zinc-300"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto px-4 py-3 text-sm leading-relaxed text-[#22c55e]"
      >
        {lines.map((line) => (
          <div key={line.id} className="mb-1 whitespace-pre-wrap break-words">
            {line.prefix && (
              <span className="text-[#16a34a]/70">{line.prefix}</span>
            )}
            {line.text}
            {line.typing && (
              <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-[#22c55e]" />
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-center gap-2 border-t border-zinc-800 px-4 py-2.5"
      >
        <span className="text-[#22c55e]">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!isOpen || isTyping}
          className="flex-1 bg-transparent text-sm text-[#22c55e] outline-none placeholder:text-[#16a34a]/40 caret-[#22c55e]"
          placeholder="Type a command..."
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
