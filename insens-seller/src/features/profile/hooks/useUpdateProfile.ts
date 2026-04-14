"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { useToast } from "@/shared/hooks/useToast";
import profileApi from "@/features/profile/api/profile.api";
import type { UpdateProfilePayload } from "@/features/profile/types/profile.types";
import type { ApiError } from "@/shared/types/api.types";

export function useUpdateProfile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { mutate } = useSWRConfig();
  const toast      = useToast();

  async function updateProfile(payload: UpdateProfilePayload) {
    setIsUpdating(true);
    try {
      const updated = await profileApi.updateMe(payload);
      await mutate("/api/v1/users/me", updated, { revalidate: false });
      toast.success("Profile updated successfully");
      return updated;
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error("Update failed", apiErr?.message ?? "Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return { updateProfile, isUpdating };
}
