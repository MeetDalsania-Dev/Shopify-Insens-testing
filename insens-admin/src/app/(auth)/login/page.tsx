import { LoginForm } from '@/features/auth/components/LoginForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Gem } from 'lucide-react';

export default function LoginPage() {
  return (
    <Card className="shadow-2xl border-border/50">
      <CardHeader className="space-y-4 pb-6">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
            <Gem className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Insens Admin</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to manage the platform
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
