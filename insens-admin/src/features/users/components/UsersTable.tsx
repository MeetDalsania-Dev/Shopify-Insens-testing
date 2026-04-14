'use client';

import { useRouter } from 'next/navigation';
import { DataTable, ColumnDef } from '@/shared/components/DataTable';
import { User } from '../types/users.types';
import { UserStatusBadge } from './UserStatusBadge';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { formatDate } from '@/shared/lib/utils';
import { Eye } from 'lucide-react';

interface UsersTableProps {
  users: User[];
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const roleVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  BUYER: 'secondary',
  SHOP_OWNER: 'outline',
  INSENS_ADMIN: 'default',
};

export function UsersTable({ users, isLoading, page, totalPages, onPageChange }: UsersTableProps) {
  const router = useRouter();

  const columns: ColumnDef<User>[] = [
    {
      key: 'email',
      header: 'User',
      cell: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.email}</p>
          {(row.firstName || row.lastName) && (
            <p className="text-xs text-muted-foreground">
              {[row.firstName, row.lastName].filter(Boolean).join(' ')}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      cell: (row) => (
        <Badge variant={roleVariant[row.role] ?? 'secondary'} className="text-xs">
          {row.role.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <UserStatusBadge isActive={row.isActive} />,
    },
    {
      key: 'createdAt',
      header: 'Joined',
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
          onClick={() => router.push(`/users/${row.id}`)}
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
      data={users}
      isLoading={isLoading}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      emptyTitle="No users found"
      emptyDescription="No users registered on the platform yet."
    />
  );
}
