import useSWR from 'swr';
import { swrFetcher } from '@/shared/lib/swr-fetcher';

export function useUsers(params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params ?? {}).filter(([, v]) => v !== undefined)
    ) as unknown as Record<string, string>
  ).toString();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/v1/admin/users${query ? `?${query}` : ''}`,
    swrFetcher
  );
  return { users: data, isLoading, error, mutate };
}
