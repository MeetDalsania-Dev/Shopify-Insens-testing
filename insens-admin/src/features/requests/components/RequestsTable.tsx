'use client';

import { useState } from 'react';
import { DataTable, ColumnDef } from '@/shared/components/DataTable';
import { VendorRequest } from '../types/requests.types';
import { RequestStatusBadge } from './RequestStatusBadge';
import { VendorRequestDrawer } from './VendorRequestDrawer';
import { Button } from '@/shared/components/ui/button';
import { formatDate } from '@/shared/lib/utils';
import { ChevronRight, MapPin } from 'lucide-react';

interface RequestsTableProps {
  requests: VendorRequest[];
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onMutate: () => void;
}

export function RequestsTable({
  requests,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onMutate,
}: RequestsTableProps) {
  const [selected, setSelected] = useState<VendorRequest | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = (req: VendorRequest) => {
    setSelected(req);
    setDrawerOpen(true);
  };

  const columns: ColumnDef<VendorRequest>[] = [
    {
      key: 'shop',
      header: 'Shop',
      cell: (row) => (
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate max-w-[200px]">{row.name}</p>
          <p className="text-xs text-muted-foreground font-mono">{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      cell: (row) => (
        <div>
          <p className="text-sm truncate max-w-[180px]">{row.owner.email}</p>
          {(row.owner.firstName || row.owner.lastName) && (
            <p className="text-xs text-muted-foreground">
              {[row.owner.firstName, row.owner.lastName].filter(Boolean).join(' ')}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'city',
      header: 'Location',
      cell: (row) =>
        row.city ? (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {row.city}
          </div>
        ) : (
          <span className="text-muted-foreground/40 text-xs">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <RequestStatusBadge status={row.status} />,
    },
    {
      key: 'submitted',
      header: 'Submitted',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1"
          onClick={() => openDrawer(row)}
        >
          Details
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      ),
      className: 'w-28',
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={requests}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        emptyTitle="No requests found"
        emptyDescription="No vendor applications match this filter."
      />

      <VendorRequestDrawer
        request={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={onMutate}
      />
    </>
  );
}
