import http from '@/shared/lib/http';
import { AdminStats } from '../types/dashboard.types';

export const dashboardApi = {
  getStats: (): Promise<AdminStats> => http.get('/api/v1/admin/stats'),
};
