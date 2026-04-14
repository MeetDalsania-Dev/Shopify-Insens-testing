"use client";

import { Package, CheckCircle, BarChart3 } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useSellerStats } from "@/features/dashboard/hooks/useSellerStats";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: string;
}

function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${accent ?? "bg-cream-100"}`}>
          <Icon className="h-4 w-4 text-oud-700" />
        </span>
      </div>
      <p className="font-display text-3xl font-semibold text-oud-900">{value}</p>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="mt-2 h-9 w-16" />
    </div>
  );
}

export function StatsGrid() {
  const { stats, isLoading } = useSellerStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        icon={Package}
        label="Total Products"
        value={stats.totalProducts}
        accent="bg-cream-100"
      />
      <StatCard
        icon={CheckCircle}
        label="Active Products"
        value={stats.activeProducts}
        accent="bg-emerald-50"
      />
      <StatCard
        icon={BarChart3}
        label="Total Stock"
        value={stats.totalStock.toLocaleString()}
        accent="bg-gold-50"
      />
    </div>
  );
}
