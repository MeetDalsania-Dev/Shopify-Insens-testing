import http from '@/shared/lib/http';
import { Shop, ShopProduct } from '../types/shops.types';
import { PaginatedResponse, PaginationParams } from '@/shared/types/api.types';

export const shopsApi = {
  getShops: (params?: PaginationParams & { status?: string }): Promise<PaginatedResponse<Shop>> =>
    http.get('/api/v1/admin/shops', { params }),

  getShop: (id: string): Promise<Shop> => http.get(`/api/v1/admin/shops/${id}`),

  getShopProducts: (
    shopId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ShopProduct>> =>
    http.get(`/api/v1/shops/${shopId}/products`, { params }),

  approveShop: (id: string): Promise<Shop> => http.patch(`/api/v1/admin/shops/${id}/approve`),

  suspendShop: (id: string): Promise<Shop> => http.patch(`/api/v1/admin/shops/${id}/suspend`),
};
