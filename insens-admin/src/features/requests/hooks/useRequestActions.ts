import { useState } from 'react';
import { requestsApi } from '../api/requests.api';
import { toast } from '@/shared/components/ui/use-toast';

export function useRequestActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const approve = async (id: string) => {
    try {
      setLoading(true);
      await requestsApi.approveRequest(id);
      toast({ title: 'Request approved', description: 'The vendor shop is now live on the platform.' });
      onSuccess?.();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err?.message ?? 'Failed to approve request' });
    } finally {
      setLoading(false);
    }
  };

  const decline = async (id: string) => {
    try {
      setLoading(true);
      await requestsApi.declineRequest(id);
      toast({ title: 'Request declined', description: 'The vendor application has been declined.' });
      onSuccess?.();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err?.message ?? 'Failed to decline request' });
    } finally {
      setLoading(false);
    }
  };

  return { approve, decline, loading };
}
