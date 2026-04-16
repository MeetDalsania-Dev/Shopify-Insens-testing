import useSWR from 'swr';
import { swrFetcher } from '@/shared/lib/swr-fetcher';

export function useRequests(params?: {
  page?:           number;
  limit?:          number;
  approvalStatus?: string;
}) {
  const filtered = Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== '')
  ) as Record<string, string>;
  const query = new URLSearchParams(filtered).toString();

  const { data, error, isLoading, mutate } = useSWR(
    `/api/v1/admin/vendors${query ? `?${query}` : ''}`,
    swrFetcher
  );

  return { requests: data, isLoading, error, mutate };
}
