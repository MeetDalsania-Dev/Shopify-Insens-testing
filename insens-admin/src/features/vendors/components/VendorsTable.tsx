'use client';

import { useState } from 'react';
import { DataTable, ColumnDef } from '@/shared/components/DataTable';
import { Vendor } from '../types/vendors.types';
import { VendorDetailDrawer } from './VendorDetailDrawer';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { formatDate } from '@/shared/lib/utils';
import { ChevronRight, MapPin } from 'lucide-react';

interface VendorsTableProps {
  vendors: Vendor[];
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onMutate: () => void;
}

export function VendorsTable({
  vendors,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onMutate,
}: VendorsTableProps) {
  const [selected, setSelected] = useState<Vendor | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = (vendor: Vendor) => {
    setSelected(vendor);
    setDrawerOpen(true);
  };

  const columns: ColumnDef<Vendor>[] = [
    {
      key: 'shop',
      header: 'Vendor Shop',
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
      cell: () => <Badge variant="success">Active</Badge>,
    },
    {
      key: 'approvedAt',
      header: 'Approved',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.updatedAt)}</span>
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
          Manage
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
        data={vendors}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        emptyTitle="No vendors found"
        emptyDescription="No approved vendors on the platform yet."
      />

      <VendorDetailDrawer
        vendor={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={onMutate}
      />
    </>
  );
}
