"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import swrFetcher from "@/shared/lib/swr-fetcher";
import type { Shop } from "@/features/shop/types/shop.types";

export function useMyShop() {
  const { data: session } = useSession();
  const shopId = session?.shopId;

  const { data, error, isLoading, mutate } = useSWR<Shop>(
    shopId ? `/api/v1/shops/${shopId}` : null,
    swrFetcher,
  );

  return { shop: data, isLoading, error, mutate };
}
