"use client";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge";

interface SectionCardProps {
  title:        string;
  required?:    boolean;
  badge?:       string;
  badgeVariant?: "warning" | "info" | "success" | "secondary";
  children:     React.ReactNode;
  className?:   string;
}

const BADGE_STYLES: Record<string, string> = {
  warning:   "bg-amber-100 text-amber-700 border-amber-200",
  info:      "bg-blue-100 text-blue-700 border-blue-200",
  success:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  secondary: "bg-muted text-muted-foreground border-border",
};

export function SectionCard({
  title,
  required,
  badge,
  badgeVariant = "secondary",
  children,
  className,
}: SectionCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-background p-5 space-y-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          {title}
          {required && <span className="ml-1 text-red-500">*</span>}
        </h3>
        {badge && (
          <span className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            BADGE_STYLES[badgeVariant],
          )}>
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
