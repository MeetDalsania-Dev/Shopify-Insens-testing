import { useState } from 'react';
import { vendorsApi } from '../api/vendors.api';
import { toast } from '@/shared/components/ui/use-toast';

export function useVendorActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const suspend = async (id: string) => {
    try {
      setLoading(true);
      await vendorsApi.suspendVendor(id);
      toast({ title: 'Vendor suspended', description: 'The vendor has been suspended from the platform.' });
      onSuccess?.();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err?.message ?? 'Failed to suspend vendor' });
    } finally {
      setLoading(false);
    }
  };

  return { suspend, loading };
}
