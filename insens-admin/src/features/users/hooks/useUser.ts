import useSWR from 'swr';
import { swrFetcher } from '@/shared/lib/swr-fetcher';
import { User } from '../types/users.types';

export function useUser(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/v1/admin/users/${id}` : null,
    swrFetcher
  );
  return { user: data, isLoading, error, mutate };
}
