import useSWR from 'swr';
import { swrFetcher } from '@/shared/lib/swr-fetcher';

export function useShops(params?: { page?: number; limit?: number; status?: string }) {
  const filteredParams = Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== '')
  );
  const query = new URLSearchParams(filteredParams as Record<string, string>).toString();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/v1/admin/shops${query ? `?${query}` : ''}`,
    swrFetcher
  );
  return { shops: data, isLoading, error, mutate };
}
