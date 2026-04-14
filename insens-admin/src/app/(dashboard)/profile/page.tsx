'use client';

import { useEffect, useState } from 'react';
import { authApi } from '@/features/auth/api/auth.api';
import { AuthUser } from '@/features/auth/types/auth.types';
import { PageHeader } from '@/shared/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { signOut } from 'next-auth/react';
import { LogOut, Mail, Shield, User } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .getMe()
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="My Profile" description="Your administrator account information" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            </div>
          ) : user ? (
            <>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : 'Administrator'}
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {user.role}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    User ID
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{user.id}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Role
                  </div>
                  <Badge variant="default" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Could not load profile information.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sign out</p>
              <p className="text-xs text-muted-foreground">End your current session</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
