"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Store } from "lucide-react";
import { OnboardingForm } from "@/features/onboarding/components/OnboardingForm";
import { FullPageSpinner } from "@/shared/components/LoadingSpinner";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If shopId already exists (shop was created) → go to dashboard
  useEffect(() => {
    if (status === "authenticated" && session?.shopId) {
      router.replace("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading") return <FullPageSpinner />;

  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-oud-100/20 via-cream-50 to-cream-50" />

      <div className="relative mx-auto max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-oud-800">
            <Store className="h-8 w-8 text-cream-50" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-oud-900">Set Up Your Shop</h1>
          <div className="mx-auto mt-3 h-px w-12 bg-gold-500" />
          <p className="mt-3 text-sm text-muted-foreground">
            Tell us about your fragrance shop. You can always update these details later.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-xl border border-cream-200 bg-white p-8 shadow-sm">
          <OnboardingForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Insens. All rights reserved.
        </p>
      </div>
    </div>
  );
}
