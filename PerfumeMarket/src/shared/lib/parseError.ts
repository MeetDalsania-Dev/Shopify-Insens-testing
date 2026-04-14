import { AppError } from "../types/api.types";

export const parseError = (error: unknown): AppError => {
  // Already normalized by Axios interceptor
  if (error && typeof error === "object" && "message" in error) {
    const err = error as any;

    // Strapi field-level validation errors
    const strapiDetails = err?.details?.errors as
      | { path: string[]; message: string }[]
      | undefined;

    const fieldErrors: Record<string, string> = {};
    if (strapiDetails?.length) {
      strapiDetails.forEach(({ path, message }) => {
        const field = path?.[path.length - 1];
        if (field) fieldErrors[field] = message;
      });
    }

    return {
      message: err.message ?? "Something went wrong",
      status: err.status,
      code: err.code,
      fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
    };
  }

  // Network error / unknown
  return {
    message: "Network error. Please check your connection.",
    code: "NETWORK_ERROR",
  };
};
