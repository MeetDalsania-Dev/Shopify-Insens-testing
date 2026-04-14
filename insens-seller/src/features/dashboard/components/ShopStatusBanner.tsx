"use client";

import { AlertTriangle, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { useAuthStore } from "@/shared/state/auth.store";

export function ShopStatusBanner() {
  const shopStatus = useAuthStore((s) => s.shopStatus);

  if (!shopStatus || shopStatus === "APPROVED") return null;

  if (shopStatus === "PENDING") {
    return (
      <Alert variant="warning" className="mb-6">
        <Clock className="h-4 w-4" />
        <AlertTitle>Awaiting Approval</AlertTitle>
        <AlertDescription>
          Your shop is currently under review by the Insens team. Product management will be
          unlocked once your shop is approved. This usually takes 1–2 business days.
        </AlertDescription>
      </Alert>
    );
  }

  if (shopStatus === "SUSPENDED") {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Shop Suspended</AlertTitle>
        <AlertDescription>
          Your shop has been suspended. You can view your data but cannot make changes. Please
          contact Insens support for assistance.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
