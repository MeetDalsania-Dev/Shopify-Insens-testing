'use client';

import { useParams } from 'next/navigation';
import { useUser } from '@/features/users/hooks/useUser';
import { UserDetailCard } from '@/features/users/components/UserDetailCard';
import { PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/shared/components/ui/button';
import { FullPageLoader } from '@/shared/components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading, mutate } = useUser(id);

  if (isLoading) return <FullPageLoader />;
  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">User not found.</p>
        <Button variant="ghost" onClick={() => router.push('/users')} className="mt-4">
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/users">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Users
          </Link>
        </Button>
      </div>

      <PageHeader
        title={
          user.firstName || user.lastName
            ? [user.firstName, user.lastName].filter(Boolean).join(' ')
            : user.email
        }
        description={`${user.role.replace('_', ' ')} — ${user.isActive ? 'Active' : 'Inactive'} account`}
      />

      <UserDetailCard user={user} onSuccess={mutate} />
    </div>
  );
}
