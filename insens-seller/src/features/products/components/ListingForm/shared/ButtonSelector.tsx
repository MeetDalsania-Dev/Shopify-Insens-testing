"use client";

import { cn } from "@/shared/lib/utils";

interface Option<T extends string> {
  value: T;
  label: string;
  icon?: string;
  description?: string;
}

interface ButtonSelectorProps<T extends string> {
  options:   Option<T>[];
  value:     T | "";
  onChange:  (v: T) => void;
  columns?:  2 | 3 | 4;
  size?:     "sm" | "md" | "lg";
  error?:    string;
}

export function ButtonSelector<T extends string>({
  options,
  value,
  onChange,
  columns = 3,
  size = "md",
  error,
}: ButtonSelectorProps<T>) {
  const gridCols = { 2: "grid-cols-2", 3: "grid-cols-2 sm:grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4" }[columns];
  const padding  = { sm: "px-3 py-2", md: "px-4 py-3", lg: "px-5 py-4" }[size];

  return (
    <div className="space-y-1.5">
      <div className={cn("grid gap-2", gridCols)}>
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex flex-col items-start rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                padding,
                active
                  ? "border-gold-500 bg-gold-500/8 ring-1 ring-gold-500/40 shadow-sm"
                  : "border-border bg-background hover:border-oud-300 hover:bg-oud-50",
              )}
            >
              {opt.icon && (
                <span className="mb-1 text-lg leading-none">{opt.icon}</span>
              )}
              <span className={cn(
                "text-sm font-medium leading-snug",
                active ? "text-oud-800" : "text-foreground",
              )}>
                {opt.label}
              </span>
              {opt.description && (
                <span className="mt-0.5 text-xs text-muted-foreground leading-tight">
                  {opt.description}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
