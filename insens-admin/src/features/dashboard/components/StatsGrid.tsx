'use client';

import { Users, Store, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { StatsCard } from './StatsCard';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-9 w-20 mb-2" />
        <Skeleton className="h-3 w-40" />
      </CardContent>
    </Card>
  );
}

export function StatsGrid() {
  const { stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <StatsCardSkeleton key={i} />)}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Buyers',
      value: stats?.totalBuyers ?? 0,
      icon: Users,
      accent: 'blue' as const,
      description: 'Registered buyer accounts',
    },
    {
      title: 'Total Shops',
      value: stats?.totalShops ?? 0,
      icon: Store,
      accent: 'gold' as const,
      description: 'All shops on the platform',
    },
    {
      title: 'Pending Shops',
      value: stats?.totalPendingShops ?? 0,
      icon: Clock,
      accent: 'yellow' as const,
      description: 'Awaiting admin approval',
    },
    {
      title: 'Approved Shops',
      value: stats?.totalApprovedShops ?? 0,
      icon: CheckCircle,
      accent: 'green' as const,
      description: 'Active and visible to buyers',
    },
    {
      title: 'Suspended Shops',
      value: stats?.totalSuspendedShops ?? 0,
      icon: XCircle,
      accent: 'red' as const,
      description: 'Currently suspended',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts ?? 0,
      icon: Package,
      accent: 'gold' as const,
      description: 'Active products across all shops',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {cards.map((card) => (
        <StatsCard key={card.title} {...card} />
      ))}
    </div>
  );
}
