import { updateUserRole } from "@/src/features/auth/api/auth.api";
import { useAuthStore } from "@/src/features/auth/state/auth.store";
import { useRouter } from "expo-router";
import { useState } from "react";
import { UserRole } from "../types/onboarding.types";

export const useSelectRole = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const { user, setRole, setUser } = useAuthStore();

  const selectRole = (role: UserRole) => setSelectedRole(role);

  const continueWithRole = async () => {
    if (!selectedRole || !user) return;
    setIsLoading(true);
    setApiError(null);
    try {
      // PATCH /api/users/:documentId  { roleType: 'visitor' | 'seller' }
      const updatedUser = await updateUserRole(user.id, {
        roleType: selectedRole,
      });
      setUser(updatedUser); // sync full updated user into store
      setRole(selectedRole); // also update local role immediately

      if (selectedRole === "seller") {
        router.replace("/(seller)");
      } else {
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      setApiError(err?.message ?? "Failed to save role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedRole,
    isLoading,
    apiError,
    selectRole,
    continueWithRole,
  };
};
