'use client';

import { useState } from 'react';
import { useVendors } from '@/features/vendors/hooks/useVendors';
import { VendorsTable } from '@/features/vendors/components/VendorsTable';
import { PageHeader } from '@/shared/components/PageHeader';

export default function VendorsPage() {
  const [page, setPage] = useState(1);
  const { vendors, isLoading, mutate } = useVendors({ page, limit: 20 });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Management"
        description="All approved vendors actively selling on the Insens platform."
      />

      <VendorsTable
        vendors={vendors?.items ?? []}
        isLoading={isLoading}
        page={page}
        totalPages={vendors?.totalPages}
        onPageChange={setPage}
        onMutate={mutate}
      />
    </div>
  );
}
