import http from "@/shared/lib/http";
import type { UserProfile, UpdateProfilePayload } from "@/features/profile/types/profile.types";

const profileApi = {
  getMe: (): Promise<UserProfile> =>
    http.get("/api/v1/users/me"),

  updateMe: (payload: UpdateProfilePayload): Promise<UserProfile> =>
    http.patch("/api/v1/users/me", payload),
};

export default profileApi;
