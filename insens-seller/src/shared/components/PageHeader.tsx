import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, backHref, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="flex items-start gap-3">
        {backHref && (
          <Button variant="ghost" size="icon" asChild className="mt-0.5 h-8 w-8 shrink-0 text-muted-foreground">
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        )}
        <div>
          <h1 className="font-display text-2xl font-semibold text-oud-900">{title}</h1>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
          <div className="mt-2 gold-divider" />
        </div>
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
