"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/shared/hooks/useToast";
import onboardingApi from "@/features/onboarding/api/onboarding.api";
import type { OnboardingFormValues } from "@/features/onboarding/validation/onboarding.schema";
import type { ApiError } from "@/shared/types/api.types";

export function useOnboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const router  = useRouter();
  const toast   = useToast();
  const { update } = useSession();

  async function createShop(values: OnboardingFormValues) {
    setIsLoading(true);
    try {
      await onboardingApi.createShop({
        name:        values.name,
        description: values.description,
        city:        values.city,
        address:     values.address,
        logoUrl:     values.logoUrl || undefined,
      });

      // Refresh NextAuth session so shopId gets populated
      await update();

      toast.success(
        "Shop created!",
        "Your shop is under review. We'll notify you once it's approved.",
      );

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error("Failed to create shop", apiErr?.message ?? "Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return { createShop, isLoading };
}
