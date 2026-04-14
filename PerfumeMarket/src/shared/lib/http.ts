import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { AppError } from "../types/api.types";
const AUTH_ENDPOINTS = [
  "/auth/local",
  "/auth/local/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-otp",
];
const http = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:1337/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10s timeout
});

http.interceptors.request.use(async (config) => {
  const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) =>
    config.url?.includes(endpoint),
  );

  if (!isAuthEndpoint) {
    const jwt = await SecureStore.getItemAsync("insens_jwt");
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
  }

  return config;
});

// ── Response: normalize ALL errors into AppError ──
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.log(
      "❌ API ERROR FULL:",
      JSON.stringify(
        {
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message,
          config: {
            url: error?.config?.url,
            method: error?.config?.method,
            data: error?.config?.data,
            baseURL: error?.config?.baseURL,
          },
        },
        null,
        2,
      ),
    );

    // No internet / timeout / DNS failure
    if (!error.response) {
      const appError: AppError = {
        message:
          error.code === "ECONNABORTED"
            ? "Request timed out. Please try again."
            : "Network error. Please check your connection.",
        code: error.code ?? "NETWORK_ERROR",
      };
      return Promise.reject(appError);
    }

    const status = error.response.status;
    const strapiError = (error.response.data as any)?.error;
    const strapiDetails = strapiError?.details?.errors as
      | { path: string[]; message: string }[]
      | undefined;

    // Field-level errors
    const fieldErrors: Record<string, string> = {};
    if (strapiDetails?.length) {
      strapiDetails.forEach(({ path, message }) => {
        const field = path?.[path.length - 1];
        if (field) fieldErrors[field] = message;
      });
    }

    const MESSAGE_MAP: Record<number, string> = {
      400: strapiError?.message ?? "Invalid request.",
      401: "Session expired. Please log in again.",
      403: "You don't have permission to do this.",
      404: "Resource not found.",
      409: strapiError?.message ?? "This record already exists.",
      422: "Validation failed. Please check your inputs.",
      429: "Too many requests. Please slow down.",
      500: "Server error. Please try again later.",
    };

    const appError: AppError = {
      message:
        MESSAGE_MAP[status] ?? strapiError?.message ?? "Something went wrong.",
      status,
      code: strapiError?.name,
      fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
    };

    // Auto logout on 401
    if (status === 401) {
      SecureStore.deleteItemAsync("insens_jwt");
    }

    return Promise.reject(appError);
  },
);

export default http;
