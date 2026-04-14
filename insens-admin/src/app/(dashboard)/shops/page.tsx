'use client';

import { useState } from 'react';
import { useShops } from '@/features/shops/hooks/useShops';
import { ShopsTable } from '@/features/shops/components/ShopsTable';
import { PageHeader } from '@/shared/components/PageHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export default function ShopsPage() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { shops, isLoading, mutate } = useShops({ page, limit: 20, status: status || undefined });

  const handleStatusChange = (val: string) => {
    setStatus(val === 'ALL' ? '' : val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shops"
        description="Manage all shops on the platform — approve, suspend, and review."
        actions={
          <Select value={status || 'ALL'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Shops" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Shops</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <ShopsTable
        shops={shops?.items ?? []}
        isLoading={isLoading}
        page={page}
        totalPages={shops?.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
