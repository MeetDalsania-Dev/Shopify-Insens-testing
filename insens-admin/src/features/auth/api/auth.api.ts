import http from '@/shared/lib/http';
import { AuthUser } from '../types/auth.types';

export const authApi = {
  logout: () => http.post('/api/v1/auth/logout'),
  getMe: (): Promise<AuthUser> => http.get('/api/v1/auth/me'),
};
