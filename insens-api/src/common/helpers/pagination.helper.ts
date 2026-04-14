import type { PaginatedResult } from '../interfaces/paginated-result.interface';

export interface PaginationParams {
  page?:  number;
  limit?: number;
}

export function buildPaginationMeta<T>(
  items:  T[],
  total:  number,
  page:   number,
  limit:  number,
): PaginatedResult<T> {
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function normalizePagination(params: PaginationParams): { page: number; limit: number } {
  const page  = Math.max(1, params.page  ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  return { page, limit };
}
