import { Badge } from '@/shared/components/ui/badge';
import { DisplayStatus } from '../types/requests.types';

const config: Record<
  DisplayStatus,
  { label: string; variant: 'success' | 'warning' | 'danger' | 'secondary' | 'waiting' }
> = {
  pending:   { label: 'Pending Review', variant: 'warning'   },
  approved:  { label: 'Approved',       variant: 'success'   },
  rejected:  { label: 'Rejected',       variant: 'danger'    },
  waiting:   { label: 'Waiting',        variant: 'waiting'   },
  suspended: { label: 'Suspended',      variant: 'secondary' },
};

export function RequestStatusBadge({ status }: { status: DisplayStatus }) {
  const { label, variant } = config[status] ?? { label: status, variant: 'secondary' as const };
  return <Badge variant={variant}>{label}</Badge>;
}
