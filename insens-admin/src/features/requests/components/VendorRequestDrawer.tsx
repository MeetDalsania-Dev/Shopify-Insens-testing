'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/shared/components/ui/sheet';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Badge } from '@/shared/components/ui/badge';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { RequestStatusBadge } from './RequestStatusBadge';
import { useRequestActions } from '../hooks/useRequestActions';
import { VendorRequest } from '../types/requests.types';
import { formatDate } from '@/shared/lib/utils';
import {
  MapPin,
  Calendar,
  Hash,
  Mail,
  User,
  Store,
  CheckCircle,
  XCircle,
  Loader2,
  Building2,
} from 'lucide-react';

interface VendorRequestDrawerProps {
  request: VendorRequest | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0 shrink-0">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        {label}
      </div>
      <div className="text-sm text-right font-medium text-foreground truncate max-w-[220px]">
        {value ?? <span className="text-muted-foreground/50 font-normal">—</span>}
      </div>
    </div>
  );
}

export function VendorRequestDrawer({
  request,
  open,
  onClose,
  onSuccess,
}: VendorRequestDrawerProps) {
  const { approve, decline, loading } = useRequestActions(() => {
    onSuccess();
    onClose();
  });

  if (!request) return null;

  const isPending = request.status === 'PENDING';
  const isApproved = request.status === 'APPROVED';
  const ownerName =
    request.owner.firstName || request.owner.lastName
      ? [request.owner.firstName, request.owner.lastName].filter(Boolean).join(' ')
      : null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl flex flex-col">
        {/* Header */}
        <SheetHeader className="pr-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <SheetTitle className="truncate">{request.name}</SheetTitle>
              <SheetDescription className="font-mono text-xs">{request.slug}</SheetDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <RequestStatusBadge status={request.status} />
            <span className="text-xs text-muted-foreground">
              Applied {formatDate(request.createdAt)}
            </span>
          </div>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Description */}
          {request.description && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                About
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {request.description}
              </p>
            </div>
          )}

          {/* Shop details */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Shop Details
            </p>
            <div className="rounded-lg border border-border divide-y divide-border">
              <div className="px-4">
                <InfoRow icon={Store} label="Shop Name" value={request.name} />
              </div>
              <div className="px-4">
                <InfoRow
                  icon={Building2}
                  label="City"
                  value={request.city}
                />
              </div>
              <div className="px-4">
                <InfoRow
                  icon={MapPin}
                  label="Address"
                  value={request.address}
                />
              </div>
              <div className="px-4">
                <InfoRow
                  icon={Calendar}
                  label="Submitted"
                  value={formatDate(request.createdAt)}
                />
              </div>
              <div className="px-4">
                <InfoRow
                  icon={Hash}
                  label="Shop ID"
                  value={
                    <span className="font-mono text-xs text-muted-foreground">
                      {request.id}
                    </span>
                  }
                />
              </div>
            </div>
          </div>

          {/* Owner details */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Owner Information
            </p>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-muted/30">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 shrink-0">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{ownerName ?? 'Shop Owner'}</p>
                  <p className="text-xs text-muted-foreground">{request.owner.email}</p>
                </div>
              </div>
              <Separator />
              <div className="px-4 divide-y divide-border">
                <InfoRow icon={Mail} label="Email" value={request.owner.email} />
                <InfoRow
                  icon={Calendar}
                  label="Joined"
                  value={formatDate(request.owner.createdAt)}
                />
                <InfoRow
                  icon={Hash}
                  label="Owner ID"
                  value={
                    <span className="font-mono text-xs text-muted-foreground">
                      {request.owner.id}
                    </span>
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action footer — only show for pending */}
        {isPending && (
          <div className="border-t border-border px-6 py-4 flex items-center gap-3 bg-background">
            <ConfirmDialog
              title="Approve Vendor Request"
              description={`Approve "${request.name}"? The shop will immediately become visible to buyers on the platform.`}
              confirmLabel="Approve"
              onConfirm={() => approve(request.id)}
              trigger={
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
              }
            />
            <ConfirmDialog
              title="Decline Vendor Request"
              description={`Decline "${request.name}"? This action will notify the vendor that their application was not accepted.`}
              confirmLabel="Decline"
              onConfirm={() => decline(request.id)}
              trigger={
                <Button variant="destructive" className="flex-1" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline
                    </>
                  )}
                </Button>
              }
            />
          </div>
        )}

        {isApproved && (
          <div className="border-t border-border px-6 py-4 bg-emerald-50/50">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle className="h-4 w-4" />
              <p className="text-sm font-medium">This vendor is approved and active on the platform.</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
