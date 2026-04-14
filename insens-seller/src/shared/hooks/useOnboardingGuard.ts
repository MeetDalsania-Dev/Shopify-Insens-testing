"use client";

/**
 * Redirects SHOP_OWNER to /onboarding if they have no shop yet (shopId === null).
 * Called at the top of the (dashboard) layout so every dashboard page is guarded.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function useOnboardingGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session?.shopId === null) {
      router.replace("/onboarding");
    }
  }, [session, status, router]);

  return { session, status };
}
