import { useState } from 'react';
import { shopsApi } from '../api/shops.api';
import { toast } from '@/shared/components/ui/use-toast';

export function useShopActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const approve = async (id: string) => {
    try {
      setLoading(true);
      await shopsApi.approveShop(id);
      toast({ title: 'Shop approved', description: 'The shop is now live on the platform.' });
      onSuccess?.();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err?.message ?? 'Failed to approve shop' });
    } finally {
      setLoading(false);
    }
  };

  const suspend = async (id: string) => {
    try {
      setLoading(true);
      await shopsApi.suspendShop(id);
      toast({ title: 'Shop suspended', description: 'The shop has been suspended.' });
      onSuccess?.();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err?.message ?? 'Failed to suspend shop' });
    } finally {
      setLoading(false);
    }
  };

  return { approve, suspend, loading };
}
