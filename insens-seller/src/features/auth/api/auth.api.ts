import http from "@/shared/lib/http";
import type { RegisterPayload, AuthResponse } from "@/features/auth/types/auth.types";

const authApi = {
  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    http.post("/api/v1/auth/register", payload),

  logout: (): Promise<void> =>
    http.post("/api/v1/auth/logout"),

  getMe: () =>
    http.get("/api/v1/auth/me"),
};

export default authApi;
