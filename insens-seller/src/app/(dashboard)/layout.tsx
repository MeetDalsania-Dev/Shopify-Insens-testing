"use client";

import { useOnboardingGuard } from "@/shared/hooks/useOnboardingGuard";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { FullPageSpinner } from "@/shared/components/LoadingSpinner";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const { status } = useOnboardingGuard();

  if (status === "loading") return <FullPageSpinner />;

  return <DashboardLayout>{children}</DashboardLayout>;
}
