"use client";

import { useEffect, useId, useRef, useState } from "react";

type FilterDropdownProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  minWidthClassName?: string;
};

export default function FilterDropdown({
  options,
  value,
  onChange,
  minWidthClassName = "min-w-[168px]",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonId = useId();
  const listboxId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${minWidthClassName}`}>
      <button
        id={buttonId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className={`tap-press flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_10px_24px_rgba(15,23,42,0.05)] transition focus:outline-none focus:ring-4 focus:ring-[#de8b34]/10 ${
          open
            ? "border-[#de8b34]/35 bg-white text-[#2f3747]"
            : "border-[rgba(132,144,165,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,245,240,0.96))] text-[#36445d] hover:border-[#de8b34]/25"
        }`}
      >
        <span className="truncate">{value}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`ml-3 h-4 w-4 text-[#8f99ad] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-[90] overflow-hidden rounded-2xl border border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,246,241,0.98))] p-2 shadow-[0_22px_44px_rgba(25,36,58,0.14)] backdrop-blur-xl">
          <ul
            id={listboxId}
            role="listbox"
            aria-labelledby={buttonId}
            className="max-h-72 space-y-1 overflow-auto"
          >
            {options.map((option) => {
              const selected = option === value;

              return (
                <li key={option} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      selected
                        ? "bg-gradient-to-r from-[#de8b34] to-[#e36d58] text-white shadow-[0_10px_18px_rgba(227,109,88,0.2)]"
                        : "text-[#42516b] hover:bg-[#f5efe7]"
                    }`}
                  >
                    <span>{option}</span>
                    {selected && (
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                        <path d="M6.5 12.5l3.1 3.1L17.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

