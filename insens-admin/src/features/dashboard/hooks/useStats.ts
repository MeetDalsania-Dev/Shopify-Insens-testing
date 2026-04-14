import useSWR from 'swr';
import { swrFetcher } from '@/shared/lib/swr-fetcher';
import { AdminStats } from '../types/dashboard.types';

export function useStats() {
  const { data, error, isLoading } = useSWR('/api/v1/admin/stats', swrFetcher);
  return { stats: data, isLoading, error };
}
