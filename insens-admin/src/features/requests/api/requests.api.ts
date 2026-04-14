import http from '@/shared/lib/http';
import { VendorRequest } from '../types/requests.types';
import { PaginatedResponse, PaginationParams } from '@/shared/types/api.types';

export const requestsApi = {
  getRequests: (
    params?: PaginationParams & { status?: string }
  ): Promise<PaginatedResponse<VendorRequest>> =>
    http.get('/api/v1/admin/shops', { params }),

  approveRequest: (id: string): Promise<VendorRequest> =>
    http.patch(`/api/v1/admin/shops/${id}/approve`),

  declineRequest: (id: string): Promise<VendorRequest> =>
    http.patch(`/api/v1/admin/shops/${id}/decline`),
};
