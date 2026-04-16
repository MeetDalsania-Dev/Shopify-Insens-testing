"use client";

import { cn } from "@/shared/lib/utils";

interface SliderRatingProps {
  value:    number;
  onChange: (v: number) => void;
  min?:     number;
  max?:     number;
  labels?:  Record<number, string>;
}

const DEFAULT_LABELS: Record<number, string> = {
  1: "Very Low",
  2: "Low",
  3: "Moderate",
  4: "Strong",
  5: "Intense",
};

export function SliderRating({
  value,
  onChange,
  min = 1,
  max = 5,
  labels = DEFAULT_LABELS,
}: SliderRatingProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="relative">
        {/* Track */}
        <div className="h-2 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Native input (invisible but functional) */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        {/* Thumb indicator */}
        <div
          className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-gold-500 bg-background shadow transition-all"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
      </div>
      {/* Tick marks */}
      <div className="flex justify-between">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={cn(
              "flex flex-col items-center gap-0.5 focus:outline-none",
              v === value ? "text-oud-800" : "text-muted-foreground",
            )}
          >
            <span className={cn(
              "h-1.5 w-1.5 rounded-full",
              v <= value ? "bg-gold-500" : "bg-border",
            )} />
            <span className="text-[10px] font-medium">{v}</span>
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {labels[value] ?? value}
      </p>
    </div>
  );
}
