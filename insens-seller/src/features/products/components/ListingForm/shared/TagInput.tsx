"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface TagInputProps {
  value:        string[];
  onChange:     (v: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  max?:         number;
  error?:       string;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter…",
  suggestions = [],
  max,
  error,
}: TagInputProps) {
  const [input, setInput]               = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s),
  );

  const addTag = (tag: string) => {
    const clean = tag.trim();
    if (!clean || value.includes(clean)) return;
    if (max && value.length >= max) return;
    onChange([...value, clean]);
    setInput("");
    setShowDropdown(false);
  };

  const removeTag = (tag: string) => onChange(value.filter((v) => v !== tag));

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-1.5">
      <div
        className={cn(
          "flex min-h-[2.5rem] flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2",
          "focus-within:ring-2 focus-within:ring-ring cursor-text",
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-oud-100 px-2.5 py-0.5 text-xs font-medium text-oud-800"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className="rounded-full hover:bg-oud-200 focus:outline-none focus:ring-1 focus:ring-oud-400"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <div className="relative flex-1 min-w-[100px]">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); setShowDropdown(true); }}
            onKeyDown={handleKey}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder={value.length === 0 ? placeholder : ""}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />

          {showDropdown && input && filtered.length > 0 && (
            <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded-lg border border-border bg-background shadow-lg">
              {filtered.slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={() => addTag(s)}
                  className="block w-full px-3 py-1.5 text-left text-sm hover:bg-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Press Enter or comma to add</p>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
