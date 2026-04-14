/**
 * Global Axios instance for insens-seller.
 *
 * - Attaches Bearer JWT from NextAuth session on every request.
 * - Unwraps the { success, data } API envelope automatically.
 * - Rejects with a structured ApiError object on failure.
 * - Redirects to /login on 401 (client-side only).
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";
import type { ApiError } from "@/shared/types/api.types";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

/* ── Request interceptor: attach JWT ── */
http.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // Only attach session in a browser context (not SSR)
  if (typeof window !== "undefined") {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
  }
  return config;
});

/* ── Response interceptor: unwrap envelope + normalise errors ── */
http.interceptors.response.use(
  (response) => {
    // Unwrap { success: true, data: ... } envelope
    return response.data?.data ?? response.data;
  },
  async (error: AxiosError<{ error?: Partial<ApiError> }>) => {
    const status    = error.response?.status ?? 500;
    const apiErr    = error.response?.data?.error;

    // Sign out and redirect on 401
    if (status === 401 && typeof window !== "undefined") {
      await signOut({ callbackUrl: "/login" });
    }

    const structured: ApiError = {
      code:    apiErr?.code    ?? "UNKNOWN_ERROR",
      message: apiErr?.message ?? "Something went wrong. Please try again.",
      details: apiErr?.details ?? {},
      status,
    };

    return Promise.reject(structured);
  },
);

export default http;
