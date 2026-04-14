import { Badge } from '@/shared/components/ui/badge';
import { ShopStatus } from '../types/shops.types';

const config: Record<ShopStatus, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  APPROVED:  { label: 'Approved',  variant: 'success' },
  PENDING:   { label: 'Pending',   variant: 'warning' },
  SUSPENDED: { label: 'Suspended', variant: 'danger'  },
};

export function ShopStatusBadge({ status }: { status: ShopStatus }) {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
