import useSWR from 'swr';
import { swrFetcher } from '@/shared/lib/swr-fetcher';
import { Shop } from '../types/shops.types';

export function useShop(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/v1/admin/shops/${id}` : null,
    swrFetcher
  );
  return { shop: data, isLoading, error, mutate };
}
