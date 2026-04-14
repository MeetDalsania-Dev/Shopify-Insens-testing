import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-oud-600", sizes[size])} />
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-cream-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-oud-700" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}
