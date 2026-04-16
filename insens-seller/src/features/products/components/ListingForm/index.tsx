"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast }   from "@/shared/hooks/useToast";

import { fullProductSchema, FullProductFormValues } from "@/features/products/validation/listing-form.schema";
import {
  FORM_DEFAULTS, STEP_REQUIRED_FIELDS, STEPS,
} from "@/features/products/types/listing-form.types";
import { useAutoSave } from "@/features/products/hooks/useAutoSave";

import { StepNav, ProgressBar }  from "./StepNav";
import { AutoSaveBadge }          from "./shared/AutoSaveBadge";
import { Step1BasicInfo }         from "./steps/Step1BasicInfo";
import { Step2FragranceDetails }  from "./steps/Step2FragranceDetails";
import { Step3VariantsPricing }   from "./steps/Step3VariantsPricing";
import { Step4Media }             from "./steps/Step4Media";
import { Step5InventoryShipping } from "./steps/Step5InventoryShipping";
import { Step6ReviewSubmit }      from "./steps/Step6ReviewSubmit";

import { Button } from "@/shared/components/ui/button";
import { cn }     from "@/shared/lib/utils";

const TOTAL_STEPS = STEPS.length; // 6

interface ProductListingFormProps {
  mode:            "create" | "edit";
  defaultValues?:  Partial<FullProductFormValues>;
  productId?:      string;
  onSaveDraft:     (data: FullProductFormValues) => Promise<void>;
  onSubmit:        (data: FullProductFormValues) => Promise<void>;
  onSaveChanges?:  (data: FullProductFormValues) => Promise<void>;
  isSubmitting?:   boolean;
}

const STEP_COMPONENTS = [
  Step1BasicInfo,
  Step2FragranceDetails,
  Step3VariantsPricing,
  Step4Media,
  Step5InventoryShipping,
  null, // Step 6 is rendered inline with extra props
];

export function ProductListingForm({
  mode,
  defaultValues,
  productId,
  onSaveDraft,
  onSubmit,
  onSaveChanges,
  isSubmitting,
}: ProductListingFormProps) {
  const { data: session }      = useSession();
  const toast                  = useToast();
  const [mounted, setMounted]  = useState(false);
  const [currentStep, setStep] = useState(0);
  const [completedSteps, setCompleted] = useState<Set<number>>(
    mode === "edit" ? new Set([0, 1, 2, 3, 4, 5]) : new Set<number>(),
  );
  const contentRef = useRef<HTMLDivElement>(null);

  const form = useForm<FullProductFormValues>({
    resolver:      zodResolver(fullProductSchema),
    defaultValues: { ...FORM_DEFAULTS, ...defaultValues } as FullProductFormValues,
    mode:          "onChange",
  });

  // ── Draft auto-save ────────────────────────────────────────────────────────
  const draftKey = productId
    ? `insens-product-draft-${productId}`
    : `insens-product-draft-new-${session?.user?.id ?? "anon"}`;

  const watched = form.watch();

  const { status: saveStatus, restoreDraft, clearDraft } = useAutoSave({
    key:     draftKey,
    data:    watched,
    enabled: mode === "create",
  });

  // Mark as mounted (client-only) — prevents SSR context mismatch
  useEffect(() => { setMounted(true); }, []);

  // Restore draft on first mount (create mode only)
  useEffect(() => {
    if (mode !== "create") return;
    const saved = restoreDraft();
    if (!saved) return;
    const minutesSince = (Date.now() - saved.savedAt) / 60_000;
    if (minutesSince < 60 * 24) { // within 24 h
      form.reset({ ...FORM_DEFAULTS, ...saved.data });
      toast.success("Draft restored", "Your last unsaved progress has been loaded.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Navigation helpers ─────────────────────────────────────────────────────

  const scrollTop = () => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  const goToStep = useCallback((step: number) => {
    setStep(step);
    scrollTop();
  }, []);

  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    const fields = STEP_REQUIRED_FIELDS[step] ?? [];
    if (fields.length === 0) return true;
    const ok = await form.trigger(fields as any);
    return ok;
  }, [form]);

  const handleContinue = async () => {
    const ok = await validateStep(currentStep);
    if (!ok) {
      toast.error("Please fix the errors before continuing.");
      return;
    }
    setCompleted((prev) => new Set([...prev, currentStep]));
    goToStep(Math.min(currentStep + 1, TOTAL_STEPS - 1));
  };

  const handleBack = () => goToStep(Math.max(currentStep - 1, 0));

  const handleSaveDraft = async () => {
    try {
      await onSaveDraft(form.getValues());
      clearDraft();
      toast.success("Draft saved", "You can continue editing later.");
    } catch {
      toast.error("Failed to save draft.");
    }
  };

  const handleSubmit = async () => {
    // Validate all steps before submitting
    const allFields = Object.values(STEP_REQUIRED_FIELDS).flat();
    const ok = await form.trigger(allFields as any);
    if (!ok) {
      toast.error("Some required fields are missing. Check all steps.");
      return;
    }
    await onSubmit(form.getValues());
    clearDraft();
  };

  const handleSaveChanges = async () => {
    if (!onSaveChanges) return;
    try {
      await onSaveChanges(form.getValues());
      toast.success("Changes saved.");
    } catch {
      toast.error("Failed to save changes.");
    }
  };

  const isLastStep = currentStep === TOTAL_STEPS - 1;

  const StepComponent = STEP_COMPONENTS[currentStep];

  // ── Client-only guard ──────────────────────────────────────────────────────
  // Prevents SSR from rendering the form + step components, which would cause
  // a FormProvider context mismatch on hydration (useFormContext() returning null).
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-oud-700" />
          <p className="text-sm">Loading form…</p>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <div className="flex min-h-screen flex-col lg:flex-row bg-background">

        {/* ── Left sidebar (step nav) ───────────────────────────────────────── */}
        <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col gap-6 border-r border-border bg-oud-950 px-4 py-8 sticky top-0 h-screen overflow-y-auto">
          {/* Brand */}
          <div className="px-3">
            <p className="font-display text-lg text-cream-50 font-semibold">
              {mode === "edit" ? "Edit Product" : "New Listing"}
            </p>
            <p className="mt-0.5 text-xs text-cream-100/50">
              {completedSteps.size} of {TOTAL_STEPS} steps complete
            </p>
          </div>

          {/* Progress bar */}
          <div className="px-3">
            <div className="h-1 w-full overflow-hidden rounded-full bg-oud-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-500"
                style={{ width: `${Math.round((completedSteps.size / TOTAL_STEPS) * 100)}%` }}
              />
            </div>
          </div>

          {/* Nav */}
          <StepNav
            currentStep={currentStep}
            completedSteps={completedSteps}
            isEditMode={mode === "edit"}
            onStepClick={goToStep}
          />

          {/* Auto-save status (create mode) */}
          {mode === "create" && (
            <div className="mt-auto px-3">
              <AutoSaveBadge status={saveStatus} />
            </div>
          )}
        </aside>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col min-h-screen">

          {/* Mobile progress bar */}
          <div className="lg:hidden sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
            <ProgressBar current={currentStep} total={TOTAL_STEPS} />
            <p className="mt-1.5 text-xs font-medium text-muted-foreground">
              {STEPS[currentStep].icon} {STEPS[currentStep].label}
            </p>
          </div>

          {/* Step heading */}
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{STEPS[currentStep].icon}</span>
                <h1 className="font-display text-xl font-semibold text-foreground">
                  {STEPS[currentStep].label}
                </h1>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {STEPS[currentStep].description}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              {mode === "create" && <AutoSaveBadge status={saveStatus} />}
              {mode === "edit" && onSaveChanges && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleSaveChanges}
                  disabled={isSubmitting}
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>

          {/* Step content */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto px-6 py-6"
          >
            <div className="mx-auto max-w-2xl space-y-6">
              {isLastStep ? (
                <Step6ReviewSubmit
                  onGoToStep={goToStep}
                  onSaveDraft={handleSaveDraft}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              ) : StepComponent ? (
                <StepComponent />
              ) : null}
            </div>
          </div>

          {/* ── Bottom action bar ──────────────────────────────────────────── */}
          {!isLastStep && (
            <div className={cn(
              "sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur-sm px-6 py-4",
              "flex items-center justify-between gap-4",
            )}>
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              <div className="flex items-center gap-3">
                {mode === "create" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSaveDraft}
                    className="hidden sm:flex gap-2"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Draft
                  </Button>
                )}
                {mode === "edit" && onSaveChanges && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSaveChanges}
                    className="sm:hidden gap-2"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={handleContinue}
                  className="gap-2 bg-oud-800 hover:bg-oud-700 text-cream-50 min-w-[120px]"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </FormProvider>
  );
}
