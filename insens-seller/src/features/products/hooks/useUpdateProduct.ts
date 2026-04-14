"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useSWRConfig } from "swr";
import { useToast } from "@/shared/hooks/useToast";
import productsApi from "@/features/products/api/products.api";
import type { UpdateProductPayload } from "@/features/products/types/products.types";
import type { ApiError } from "@/shared/types/api.types";

export function useUpdateProduct() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: session } = useSession();
  const { mutate }        = useSWRConfig();
  const toast             = useToast();

  async function updateProduct(id: string, payload: UpdateProductPayload) {
    setIsUpdating(true);
    try {
      const updated = await productsApi.updateProduct(id, payload);
      // Refresh both product detail and product list
      await mutate(`/api/v1/products/${id}`, updated, { revalidate: false });
      const shopId = session?.shopId;
      if (shopId) await mutate((key: string) => key.includes(`/shops/${shopId}/products`));
      toast.success("Product updated");
      return updated;
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error("Update failed", apiErr?.message ?? "Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return { updateProduct, isUpdating };
}
