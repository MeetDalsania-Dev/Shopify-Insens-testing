'use client';

import { useState } from 'react';
import { useRequests }     from '@/features/requests/hooks/useRequests';
import { RequestsTable }   from '@/features/requests/components/RequestsTable';
import { PageHeader }      from '@/shared/components/PageHeader';
import { Clock, CheckCircle, XCircle, Inbox, PauseCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

// approvalStatus values that map to each tab
const STATUS_TABS = [
  { value: '',              label: 'All',           icon: Inbox,        color: 'text-muted-foreground' },
  { value: 'pending_review', label: 'Pending',      icon: Clock,        color: 'text-amber-600'        },
  { value: 'waiting',       label: 'Waiting',        icon: PauseCircle,  color: 'text-blue-500'         },
  { value: 'approved',      label: 'Approved',       icon: CheckCircle,  color: 'text-emerald-600'      },
  { value: 'rejected',      label: 'Rejected',       icon: XCircle,      color: 'text-red-600'          },
] as const;

export default function RequestsPage() {
  const [approvalStatus, setApprovalStatus] = useState('');
  const [page, setPage] = useState(1);

  const { requests, isLoading, mutate } = useRequests({
    page,
    limit: 20,
    approvalStatus: approvalStatus || undefined,
  });

  const handleTabChange = (val: string) => {
    setApprovalStatus(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Requests"
        description="Review shop applications — approve, reject, or place them on hold."
      />

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const Icon   = tab.icon;
          const active = approvalStatus === tab.value;
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
              {/* Show count from pagination data */}
              {active && requests?.total !== undefined && (
                <span className="ml-1 rounded-full bg-primary/15 px-1.5 py-0.5 text-xs font-medium text-primary">
                  {requests.total}
                </span>
              )}
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
