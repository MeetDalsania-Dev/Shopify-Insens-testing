import useSWR from 'swr';
import { swrFetcher } from '@/shared/lib/swr-fetcher';

export function useVendors(params?: { page?: number; limit?: number }) {
  const filtered = Object.fromEntries(
    Object.entries({ ...params, status: 'APPROVED' }).filter(([, v]) => v !== undefined)
  ) as Record<string, string>;
  const query = new URLSearchParams(filtered).toString();

  const { data, error, isLoading, mutate } = useSWR(
    `/api/v1/admin/shops?${query}`,
    swrFetcher
  );
  return { vendors: data, isLoading, error, mutate };
}
