"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useSWRConfig } from "swr";
import { useToast } from "@/shared/hooks/useToast";
import productsApi from "@/features/products/api/products.api";
import type { ApiError } from "@/shared/types/api.types";

export function useDeleteProduct() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const { mutate }        = useSWRConfig();
  const toast             = useToast();

  async function deleteProduct(id: string) {
    setIsDeleting(true);
    try {
      await productsApi.deleteProduct(id);
      const shopId = session?.shopId;
      if (shopId) await mutate((key: string) => key.includes(`/shops/${shopId}/products`));
      toast.success("Product removed");
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error("Delete failed", apiErr?.message ?? "Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return { deleteProduct, isDeleting };
}
