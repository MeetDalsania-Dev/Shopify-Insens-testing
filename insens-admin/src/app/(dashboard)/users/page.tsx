'use client';

import { useState } from 'react';
import { useUsers } from '@/features/users/hooks/useUsers';
import { UsersTable } from '@/features/users/components/UsersTable';
import { PageHeader } from '@/shared/components/PageHeader';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { users, isLoading } = useUsers({ page, limit: 20 });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="View and manage all registered buyers and shop owners on the platform."
      />
      <UsersTable
        users={users?.items ?? []}
        isLoading={isLoading}
        page={page}
        totalPages={users?.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
