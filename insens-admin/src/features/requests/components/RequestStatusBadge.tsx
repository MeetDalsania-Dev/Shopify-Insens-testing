import { Badge } from '@/shared/components/ui/badge';
import { RequestStatus } from '../types/requests.types';

const config: Record<
  RequestStatus,
  { label: string; variant: 'success' | 'warning' | 'danger' | 'secondary' }
> = {
  PENDING:   { label: 'Pending',   variant: 'warning'   },
  APPROVED:  { label: 'Approved',  variant: 'success'   },
  DECLINED:  { label: 'Declined',  variant: 'danger'    },
  SUSPENDED: { label: 'Suspended', variant: 'secondary' },
};

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const { label, variant } = config[status] ?? { label: status, variant: 'secondary' as const };
  return <Badge variant={variant}>{label}</Badge>;
}
