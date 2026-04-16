"use client";

import { cn } from "@/shared/lib/utils";

interface ChipOption {
  value: string;
  label: string;
  emoji?: string;
}

interface ChipSelectorProps {
  options:   ChipOption[];
  value:     string[];
  onChange:  (v: string[]) => void;
  max?:      number;
  error?:    string;
}

export function ChipSelector({ options, value, onChange, max, error }: ChipSelectorProps) {
  const toggle = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      if (max && value.length >= max) return;
      onChange([...value, v]);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value.includes(opt.value);
          const atMax  = !!max && value.length >= max && !active;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={atMax}
              onClick={() => toggle(opt.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "border-gold-500 bg-gold-500/10 text-oud-800 shadow-sm"
                  : atMax
                  ? "cursor-not-allowed border-border bg-muted text-muted-foreground/40"
                  : "border-border bg-background text-foreground hover:border-oud-300 hover:bg-oud-50",
              )}
            >
              {opt.emoji && <span>{opt.emoji}</span>}
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
