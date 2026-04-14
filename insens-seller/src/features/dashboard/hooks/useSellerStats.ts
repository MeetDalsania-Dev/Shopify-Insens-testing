"use client";

import { useMemo, useEffect } from "react";
import { useMyShop } from "@/features/shop/hooks/useMyShop";
import { useMyProducts } from "@/features/products/hooks/useMyProducts";
import { useAuthStore } from "@/shared/state/auth.store";
import type { SellerStats } from "@/features/dashboard/types/dashboard.types";

export function useSellerStats(): { stats: SellerStats; isLoading: boolean } {
  const { shop, isLoading: shopLoading }       = useMyShop();
  const { products, isLoading: productsLoading } = useMyProducts({ page: 1, limit: 200 });
  const setShopStatus = useAuthStore((s) => s.setShopStatus);

  // Sync shop status into Zustand for global access
  useEffect(() => {
    if (shop?.status) setShopStatus(shop.status);
  }, [shop?.status, setShopStatus]);

  const stats = useMemo<SellerStats>(() => {
    const list = products ?? [];
    return {
      shopStatus:     shop?.status ?? null,
      totalProducts:  list.length,
      activeProducts: list.filter((p) => p.isActive).length,
      totalStock:     list.reduce((acc, p) => acc + (p.stock ?? 0), 0),
    };
  }, [shop, products]);

  return {
    stats,
    isLoading: shopLoading || productsLoading,
  };
}
