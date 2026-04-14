import axios from 'axios';
import { getSession } from 'next-auth/react';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(async (config) => {
  const session = await getSession();
  if ((session as any)?.accessToken) {
    config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    return response.data.data ?? response.data;
  },
  (error) => {
    const apiError = error.response?.data?.error;
    return Promise.reject({
      code: apiError?.code ?? 'UNKNOWN_ERROR',
      message: apiError?.message ?? 'Something went wrong',
      details: apiError?.details ?? {},
      status: error.response?.status ?? 500,
    });
  }
);

export default http;
