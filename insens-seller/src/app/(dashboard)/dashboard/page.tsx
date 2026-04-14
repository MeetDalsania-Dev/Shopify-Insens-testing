import type { Metadata } from "next";
import { ShopStatusBanner } from "@/features/dashboard/components/ShopStatusBanner";
import { StatsGrid } from "@/features/dashboard/components/StatsGrid";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { PageHeader } from "@/shared/components/PageHeader";

export const metadata: Metadata = { title: "Dashboard — Insens Seller" };

export default function DashboardPage() {
  return (
    <div>
      <ShopStatusBanner />
      <PageHeader
        title="Dashboard"
        description="An overview of your shop performance."
      />
      <StatsGrid />
      <QuickActions />
    </div>
  );
}
