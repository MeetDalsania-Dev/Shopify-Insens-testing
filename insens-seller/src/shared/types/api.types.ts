/* ── API envelope types matching the NestJS response interceptor ── */

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  code: string;
  message: string;
  details: Record<string, string[]>;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
