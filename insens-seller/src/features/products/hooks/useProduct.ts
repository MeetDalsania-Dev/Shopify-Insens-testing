"use client";

import useSWR from "swr";
import swrFetcher from "@/shared/lib/swr-fetcher";
import type { Product } from "@/features/products/types/products.types";

export function useProduct(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Product>(
    id ? `/api/v1/products/${id}` : null,
    swrFetcher,
  );

  return { product: data, isLoading, error, mutate };
}
