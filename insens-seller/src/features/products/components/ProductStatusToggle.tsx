"use client";

import { useUpdateProduct } from "@/features/products/hooks/useUpdateProduct";
import { useAuthStore } from "@/shared/state/auth.store";
import { Switch } from "@/shared/components/ui/switch";

interface ProductStatusToggleProps {
  productId: string;
  isActive:  boolean;
}

export function ProductStatusToggle({ productId, isActive }: ProductStatusToggleProps) {
  const { updateProduct, isUpdating } = useUpdateProduct();
  const shopStatus = useAuthStore((s) => s.shopStatus);
  const isSuspended = shopStatus === "SUSPENDED";

  async function handleToggle(checked: boolean) {
    await updateProduct(productId, { isActive: checked });
  }

  return (
    <Switch
      checked={isActive}
      onCheckedChange={handleToggle}
      disabled={isUpdating || isSuspended}
      aria-label={isActive ? "Deactivate product" : "Activate product"}
    />
  );
}
