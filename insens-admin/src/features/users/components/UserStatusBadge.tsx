import { Badge } from '@/shared/components/ui/badge';

export function UserStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? 'success' : 'danger'}>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
}
