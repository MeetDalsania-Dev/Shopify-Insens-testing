import http from '@/shared/lib/http';
import { Vendor } from '../types/vendors.types';
import { PaginatedResponse, PaginationParams } from '@/shared/types/api.types';

export const vendorsApi = {
  getVendors: (params?: PaginationParams): Promise<PaginatedResponse<Vendor>> =>
    http.get('/api/v1/admin/shops', { params: { ...params, status: 'APPROVED' } }),

  suspendVendor: (id: string): Promise<Vendor> =>
    http.patch(`/api/v1/admin/shops/${id}/suspend`),
};
