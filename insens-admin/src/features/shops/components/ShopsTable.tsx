'use client';

import { useRouter } from 'next/navigation';
import { DataTable, ColumnDef } from '@/shared/components/DataTable';
import { Shop } from '../types/shops.types';
import { ShopStatusBadge } from './ShopStatusBadge';
import { Button } from '@/shared/components/ui/button';
import { formatDate } from '@/shared/lib/utils';
import { Eye, MapPin } from 'lucide-react';

interface ShopsTableProps {
  shops: Shop[];
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function ShopsTable({ shops, isLoading, page, totalPages, onPageChange }: ShopsTableProps) {
  const router = useRouter();

  const columns: ColumnDef<Shop>[] = [
    {
      key: 'name',
      header: 'Shop',
      cell: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground font-mono">{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      cell: (row) => (
        <div>
          <p className="text-sm">{row.owner.email}</p>
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
            <MapPin className="h-3 w-3" />
            {row.city}
          </div>
        ) : (
          <span className="text-muted-foreground/50 text-xs">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <ShopStatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      header: 'Created',
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
          onClick={() => router.push(`/shops/${row.id}`)}
          className="h-8"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      ),
      className: 'w-24',
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={shops}
      isLoading={isLoading}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      emptyTitle="No shops found"
      emptyDescription="No shops match your current filter."
    />
  );
}
