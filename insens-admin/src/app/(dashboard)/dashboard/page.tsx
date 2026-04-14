import { StatsGrid } from '@/features/dashboard/components/StatsGrid';
import { PageHeader } from '@/shared/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { TrendingUp, Shield, Clock } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Platform overview — monitor all activity across Insens."
      />

      <StatsGrid />

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-primary">
              <Shield className="h-4 w-4" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You have full administrative control over shops, users, and platform settings.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Review pending shop applications from the Shops section to approve or decline.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Platform Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor buyer registrations and shop performance across the luxury fragrance marketplace.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
