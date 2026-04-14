import { useState } from 'react';
import { usersApi } from '../api/users.api';
import { toast } from '@/shared/components/ui/use-toast';

export function useUserActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const deactivate = async (id: string) => {
    try {
      setLoading(true);
      await usersApi.deactivateUser(id);
      toast({ title: 'User deactivated', description: 'The user account has been deactivated.' });
      onSuccess?.();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err?.message ?? 'Failed to deactivate user',
      });
    } finally {
      setLoading(false);
    }
  };

  return { deactivate, loading };
}
