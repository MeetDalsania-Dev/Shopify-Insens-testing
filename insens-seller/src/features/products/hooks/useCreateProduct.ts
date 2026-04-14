"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSWRConfig } from "swr";
import { useToast } from "@/shared/hooks/useToast";
import productsApi from "@/features/products/api/products.api";
import type { CreateProductPayload } from "@/features/products/types/products.types";
import type { ApiError } from "@/shared/types/api.types";

export function useCreateProduct() {
  const [isCreating, setIsCreating] = useState(false);
  const { data: session } = useSession();
  const { mutate }        = useSWRConfig();
  const router            = useRouter();
  const toast             = useToast();

  async function createProduct(payload: CreateProductPayload) {
    setIsCreating(true);
    try {
      await productsApi.createProduct(payload);
      // Invalidate products list cache
      const shopId = session?.shopId;
      if (shopId) await mutate((key: string) => key.includes(`/shops/${shopId}/products`));
      toast.success("Product added successfully");
      router.push("/products");
      router.refresh();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error("Failed to add product", apiErr?.message ?? "Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  return { createProduct, isCreating };
}
