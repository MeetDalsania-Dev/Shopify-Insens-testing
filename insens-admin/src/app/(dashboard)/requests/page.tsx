'use client';

import { useState } from 'react';
import { useRequests } from '@/features/requests/hooks/useRequests';
import { RequestsTable } from '@/features/requests/components/RequestsTable';
import { PageHeader } from '@/shared/components/PageHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Clock, CheckCircle, XCircle, Inbox } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const STATUS_TABS = [
  { value: '',         label: 'All',      icon: Inbox,        color: 'text-muted-foreground' },
  { value: 'PENDING',  label: 'Pending',  icon: Clock,        color: 'text-amber-600' },
  { value: 'APPROVED', label: 'Approved', icon: CheckCircle,  color: 'text-emerald-600' },
  { value: 'DECLINED', label: 'Declined', icon: XCircle,      color: 'text-red-600' },
] as const;

export default function RequestsPage() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { requests, isLoading, mutate } = useRequests({
    page,
    limit: 20,
    status: status || undefined,
  });

  const handleTabChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Requests"
        description="Review shop applications from vendors — approve or decline their requests."
      />

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = status === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                active
                  ? 'bg-primary/10 border-primary/30 text-primary shadow-sm'
                  : 'bg-background border-border text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className={cn('h-4 w-4', active ? 'text-primary' : tab.color)} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <RequestsTable
        requests={requests?.items ?? []}
        isLoading={isLoading}
        page={page}
        totalPages={requests?.totalPages}
        onPageChange={setPage}
        onMutate={mutate}
      />
    </div>
  );
}
