"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import swrFetcher from "@/shared/lib/swr-fetcher";
import type { Product } from "@/features/products/types/products.types";
import type { PaginationParams } from "@/shared/types/api.types";

export function useMyProducts(params?: PaginationParams) {
  const { data: session } = useSession();
  const shopId = session?.shopId;
  const page   = params?.page  ?? 1;
  const limit  = params?.limit ?? 20;

  const key = shopId
    ? `/api/v1/shops/${shopId}/products?page=${page}&limit=${limit}`
    : null;

  const { data, error, isLoading, mutate } = useSWR<Product[]>(key, swrFetcher);

  return {
    products: data ?? [],
    isLoading,
    error,
    mutate,
    swrKey: key,
  };
}
