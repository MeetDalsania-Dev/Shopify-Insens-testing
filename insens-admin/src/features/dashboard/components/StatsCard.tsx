import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: { value: number; label: string };
  accent?: 'gold' | 'green' | 'yellow' | 'red' | 'blue';
}

const accentColors: Record<string, string> = {
  gold: 'text-gold-500 bg-gold-50',
  green: 'text-emerald-600 bg-emerald-50',
  yellow: 'text-amber-600 bg-amber-50',
  red: 'text-red-600 bg-red-50',
  blue: 'text-blue-600 bg-blue-50',
};

export function StatsCard({ title, value, icon: Icon, description, accent = 'gold' }: StatsCardProps) {
  const iconClass = accentColors[accent] ?? accentColors.gold;
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn('flex items-center justify-center w-9 h-9 rounded-lg', iconClass)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
