import { Badge } from '@/shared/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'secondary' }> = {
  APPROVED: { label: 'Approved', variant: 'success' },
  PENDING: { label: 'Pending', variant: 'warning' },
  SUSPENDED: { label: 'Suspended', variant: 'danger' },
  ACTIVE: { label: 'Active', variant: 'success' },
  INACTIVE: { label: 'Inactive', variant: 'danger' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, variant: 'secondary' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
