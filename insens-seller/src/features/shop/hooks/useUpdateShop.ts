"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/shared/hooks/useToast";
import shopApi from "@/features/shop/api/shop.api";
import type { UpdateShopPayload } from "@/features/shop/types/shop.types";
import type { ApiError } from "@/shared/types/api.types";
import { useSWRConfig } from "swr";

export function useUpdateShop() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: session }  = useSession();
  const { mutate }         = useSWRConfig();
  const toast              = useToast();

  async function updateShop(payload: UpdateShopPayload) {
    const shopId = session?.shopId;
    if (!shopId) return;

    setIsUpdating(true);
    try {
      const updated = await shopApi.updateMyShop(shopId, payload);
      // Refresh SWR cache for shop
      await mutate(`/api/v1/shops/${shopId}`, updated, { revalidate: false });
      toast.success("Shop updated successfully");
      return updated;
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error("Update failed", apiErr?.message ?? "Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return { updateShop, isUpdating };
}
