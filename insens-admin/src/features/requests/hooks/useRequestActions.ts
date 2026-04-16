import { useState } from 'react';
import { useToast } from '@/shared/components/ui/use-toast';
import { requestsApi } from '../api/requests.api';

export function useRequestActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const run = async (
    action: () => Promise<unknown>,
    successMsg: { title: string; description: string },
    errorFallback: string,
  ) => {
    try {
      setLoading(true);
      await action();
      toast({ title: successMsg.title, description: successMsg.description });
      onSuccess?.();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Action failed',
        description: err?.message ?? errorFallback,
      });
    } finally {
      setLoading(false);
    }
  };

  const approve = (id: string) =>
    run(
      () => requestsApi.approveRequest(id),
      { title: 'Vendor approved', description: 'The shop is now live on the platform.' },
      'Failed to approve vendor',
    );

  const reject = (id: string) =>
    run(
      () => requestsApi.rejectRequest(id),
      { title: 'Vendor rejected', description: 'The application has been rejected.' },
      'Failed to reject vendor',
    );

  const setWaiting = (id: string) =>
    run(
      () => requestsApi.setWaitingRequest(id),
      { title: 'Set to waiting', description: 'Application is on hold pending more information.' },
      'Failed to update status',
    );

  const suspend = (id: string) =>
    run(
      () => requestsApi.suspendRequest(id),
      { title: 'Vendor suspended', description: 'The vendor has been suspended from the platform.' },
      'Failed to suspend vendor',
    );

  return { approve, reject, setWaiting, suspend, loading };
}
