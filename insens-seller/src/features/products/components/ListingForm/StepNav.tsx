"use client";

import { Check } from "lucide-react";
import { STEPS } from "@/features/products/types/listing-form.types";
import { cn } from "@/shared/lib/utils";

interface StepNavProps {
  currentStep:    number;
  completedSteps: Set<number>;
  isEditMode?:    boolean;
  onStepClick:    (step: number) => void;
}

export function StepNav({ currentStep, completedSteps, isEditMode, onStepClick }: StepNavProps) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Form steps">
      {STEPS.map((step) => {
        const isCompleted = completedSteps.has(step.index);
        const isCurrent   = currentStep === step.index;
        const canJump     = isCompleted || isEditMode || step.index === currentStep;

        return (
          <button
            key={step.index}
            type="button"
            disabled={!canJump}
            onClick={() => canJump && onStepClick(step.index)}
            className={cn(
              "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
              isCurrent
                ? "bg-oud-800 text-cream-50 shadow-sm"
                : canJump
                ? "text-foreground hover:bg-oud-100"
                : "cursor-default text-muted-foreground/50",
            )}
          >
            {/* Circle indicator */}
            <div className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
              isCurrent
                ? "border-gold-400 bg-gold-400 text-oud-900"
                : isCompleted
                ? "border-emerald-500 bg-emerald-500 text-white"
                : canJump
                ? "border-border bg-background text-muted-foreground"
                : "border-border/40 bg-transparent text-muted-foreground/40",
            )}>
              {isCompleted && !isCurrent ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                step.index + 1
              )}
            </div>

            {/* Labels */}
            <div className="min-w-0">
              <p className={cn(
                "text-sm font-medium leading-tight truncate",
                isCurrent ? "text-cream-50" : isCompleted ? "text-foreground" : canJump ? "text-foreground" : "text-muted-foreground/50",
              )}>
                {step.label}
              </p>
              <p className={cn(
                "text-xs leading-tight truncate mt-0.5",
                isCurrent ? "text-cream-100/70" : "text-muted-foreground",
              )}>
                {step.description}
              </p>
            </div>
          </button>
        );
      })}
    </nav>
  );
}

// ── Compact progress bar for mobile ──────────────────────────────────────────

interface ProgressBarProps {
  current: number;
  total:   number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Step {current + 1} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-oud-700 to-gold-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
