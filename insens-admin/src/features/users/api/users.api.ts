import http from '@/shared/lib/http';
import { User } from '../types/users.types';
import { PaginatedResponse, PaginationParams } from '@/shared/types/api.types';

export const usersApi = {
  getUsers: (params?: PaginationParams): Promise<PaginatedResponse<User>> =>
    http.get('/api/v1/admin/users', { params }),

  getUser: (id: string): Promise<User> => http.get(`/api/v1/admin/users/${id}`),

  deactivateUser: (id: string): Promise<User> =>
    http.patch(`/api/v1/admin/users/${id}/deactivate`),
};
