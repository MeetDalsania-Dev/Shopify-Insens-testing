'use client';

import { Button } from '@/shared/components/ui/button';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { useShopActions } from '../hooks/useShopActions';
import { ShopStatus } from '../types/shops.types';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ShopActionButtonsProps {
  shopId: string;
  status: ShopStatus;
  onSuccess: () => void;
}

export function ShopActionButtons({ shopId, status, onSuccess }: ShopActionButtonsProps) {
  const { approve, suspend, loading } = useShopActions(onSuccess);

  return (
    <div className="flex items-center gap-2">
      {(status === 'PENDING' || status === 'SUSPENDED') && (
        <ConfirmDialog
          title="Approve Shop"
          description="This will make the shop visible to all buyers on the platform. Are you sure?"
          confirmLabel="Approve"
          onConfirm={() => approve(shopId)}
          trigger={
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  Approve
                </>
              )}
            </Button>
          }
        />
      )}

      {status === 'APPROVED' && (
        <ConfirmDialog
          title="Suspend Shop"
          description="This will hide the shop and all its products from buyers. The shop owner will be notified. Are you sure?"
          confirmLabel="Suspend"
          onConfirm={() => suspend(shopId)}
          trigger={
            <Button variant="destructive" size="sm" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-1.5" />
                  Suspend
                </>
              )}
            </Button>
          }
        />
      )}
    </div>
  );
}
