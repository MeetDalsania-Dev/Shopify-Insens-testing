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
      const shop = await onboardingApi.createShop({
        legalName:   values.legalName,
        displayName: values.displayName,
        slug:        values.slug,
        description: values.description || undefined,
        email:       values.email       || undefined,
        phone:       values.phone       || undefined,
      });

      // Refresh NextAuth session with the new shopId (vendorId from API)
      await update({ shopId: shop.id });

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
