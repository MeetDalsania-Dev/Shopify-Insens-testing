'use client';

import { User } from '../types/users.types';
import { UserStatusBadge } from './UserStatusBadge';
import { useUserActions } from '../hooks/useUserActions';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { formatDate } from '@/shared/lib/utils';
import { Calendar, Hash, Mail, Shield, UserX, Loader2 } from 'lucide-react';

interface UserDetailCardProps {
  user: User;
  onSuccess: () => void;
}

export function UserDetailCard({ user, onSuccess }: UserDetailCardProps) {
  const { deactivate, loading } = useUserActions(onSuccess);
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main card */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-base">User Information</CardTitle>
            <UserStatusBadge isActive={user.isActive} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-border">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.email} />}
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {user.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg text-foreground">{fullName || user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {user.role.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                Role
              </div>
              <span className="text-sm">{user.role.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Joined
              </div>
              <span className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4" />
                User ID
              </div>
              <span className="text-xs font-mono text-muted-foreground">{user.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {user.isActive && (
            <ConfirmDialog
              title="Deactivate User"
              description="This will deactivate the user account. They will not be able to log in until reactivated. Are you sure?"
              confirmLabel="Deactivate"
              onConfirm={() => deactivate(user.id)}
              trigger={
                <Button variant="destructive" size="sm" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <UserX className="h-4 w-4 mr-2" />
                      Deactivate Account
                    </>
                  )}
                </Button>
              }
            />
          )}

          {!user.isActive && (
            <div className="rounded-lg bg-muted px-4 py-3">
              <p className="text-sm text-muted-foreground">
                This account is currently deactivated. Reactivation is not available from this panel.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
