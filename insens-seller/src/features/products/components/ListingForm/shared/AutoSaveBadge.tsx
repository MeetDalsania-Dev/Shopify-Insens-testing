import { Check, Cloud, CloudOff, Loader2 } from "lucide-react";
import { AutoSaveStatus } from "@/features/products/hooks/useAutoSave";
import { cn } from "@/shared/lib/utils";

export function AutoSaveBadge({ status }: { status: AutoSaveStatus }) {
  const map = {
    idle:   { icon: Cloud,    text: "Not saved",    cls: "text-muted-foreground/50" },
    saving: { icon: Loader2,  text: "Saving…",      cls: "text-gold-600"           },
    saved:  { icon: Check,    text: "Draft saved",  cls: "text-emerald-600"        },
    error:  { icon: CloudOff, text: "Save failed",  cls: "text-destructive"        },
  } as const;

  const { icon: Icon, text, cls } = map[status];

  return (
    <div className={cn("inline-flex items-center gap-1.5 text-xs font-medium", cls)}>
      <Icon className={cn("h-3.5 w-3.5", status === "saving" && "animate-spin")} />
      {text}
    </div>
  );
}
