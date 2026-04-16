import http from '@/shared/lib/http';
import { VendorRequest } from '../types/requests.types';
import { PaginatedResponse, PaginationParams } from '@/shared/types/api.types';

export const requestsApi = {
  /** List vendors — filtered by approvalStatus for the requests page. */
  getRequests: (
    params?: PaginationParams & { approvalStatus?: string }
  ): Promise<PaginatedResponse<VendorRequest>> =>
    http.get('/api/v1/admin/vendors', { params }),

  approveRequest: (id: string): Promise<VendorRequest> =>
    http.patch(`/api/v1/admin/vendors/${id}/approve`),

  rejectRequest: (id: string): Promise<VendorRequest> =>
    http.patch(`/api/v1/admin/vendors/${id}/reject`),

  setWaitingRequest: (id: string): Promise<VendorRequest> =>
    http.patch(`/api/v1/admin/vendors/${id}/waiting`),

  suspendRequest: (id: string): Promise<VendorRequest> =>
    http.patch(`/api/v1/admin/vendors/${id}/suspend`),
};
