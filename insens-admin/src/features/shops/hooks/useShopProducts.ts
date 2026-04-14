import useSWR from 'swr';
import { swrFetcher } from '@/shared/lib/swr-fetcher';

export function useShopProducts(shopId: string, params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const { data, error, isLoading } = useSWR(
    shopId ? `/api/v1/shops/${shopId}/products${query ? `?${query}` : ''}` : null,
    swrFetcher
  );
  return { products: data, isLoading, error };
}
