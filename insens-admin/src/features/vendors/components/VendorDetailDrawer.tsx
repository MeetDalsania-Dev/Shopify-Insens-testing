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
import { useVendorActions } from '../hooks/useVendorActions';
import { Vendor } from '../types/vendors.types';
import { formatDate } from '@/shared/lib/utils';
import {
  MapPin,
  Calendar,
  Hash,
  Mail,
  User,
  Store,
  XCircle,
  Loader2,
  Building2,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface VendorDetailDrawerProps {
  vendor: Vendor | null;
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
      <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        {label}
      </div>
      <div className="text-sm text-right font-medium text-foreground truncate max-w-[220px]">
        {value ?? <span className="text-muted-foreground/50 font-normal">—</span>}
      </div>
    </div>
  );
}

export function VendorDetailDrawer({
  vendor,
  open,
  onClose,
  onSuccess,
}: VendorDetailDrawerProps) {
  const { suspend, loading } = useVendorActions(() => {
    onSuccess();
    onClose();
  });

  if (!vendor) return null;

  const ownerName =
    vendor.owner.firstName || vendor.owner.lastName
      ? [vendor.owner.firstName, vendor.owner.lastName].filter(Boolean).join(' ')
      : null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl flex flex-col">
        {/* Header */}
        <SheetHeader className="pr-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 shrink-0">
              <Store className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <SheetTitle className="truncate">{vendor.name}</SheetTitle>
              <SheetDescription className="font-mono text-xs">{vendor.slug}</SheetDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Badge variant="success">Active Vendor</Badge>
            <span className="text-xs text-muted-foreground">
              Approved · {formatDate(vendor.updatedAt)}
            </span>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {vendor.description && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                About
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{vendor.description}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Shop Details
            </p>
            <div className="rounded-lg border border-border divide-y divide-border">
              <div className="px-4">
                <InfoRow icon={Store} label="Shop Name" value={vendor.name} />
              </div>
              <div className="px-4">
                <InfoRow icon={Building2} label="City" value={vendor.city} />
              </div>
              <div className="px-4">
                <InfoRow icon={MapPin} label="Address" value={vendor.address} />
              </div>
              <div className="px-4">
                <InfoRow icon={Calendar} label="Approved" value={formatDate(vendor.updatedAt)} />
              </div>
              <div className="px-4">
                <InfoRow
                  icon={Hash}
                  label="Shop ID"
                  value={
                    <span className="font-mono text-xs text-muted-foreground">{vendor.id}</span>
                  }
                />
              </div>
            </div>
          </div>

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
                  <p className="text-xs text-muted-foreground">{vendor.owner.email}</p>
                </div>
              </div>
              <Separator />
              <div className="px-4 divide-y divide-border">
                <InfoRow icon={Mail} label="Email" value={vendor.owner.email} />
                <InfoRow icon={Calendar} label="Joined" value={formatDate(vendor.owner.createdAt)} />
                <InfoRow
                  icon={Hash}
                  label="Owner ID"
                  value={
                    <span className="font-mono text-xs text-muted-foreground">
                      {vendor.owner.id}
                    </span>
                  }
                />
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/shops/${vendor.id}/products`}>
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                View Products
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-border px-6 py-4 space-y-3 bg-background">
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2.5">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <p className="text-xs font-medium">Active vendor — shop is live on the platform</p>
          </div>
          <ConfirmDialog
            title="Suspend Vendor"
            description={`Suspend "${vendor.name}"? The shop and all its products will be hidden from buyers immediately.`}
            confirmLabel="Suspend"
            onConfirm={() => suspend(vendor.id)}
            trigger={
              <Button variant="destructive" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Suspend Vendor
                  </>
                )}
              </Button>
            }
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
