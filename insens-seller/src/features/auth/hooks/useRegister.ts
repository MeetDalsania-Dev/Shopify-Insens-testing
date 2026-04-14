"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/hooks/useToast";
import authApi from "@/features/auth/api/auth.api";
import type { RegisterFormValues } from "@/features/auth/validation/register.schema";
import type { ApiError } from "@/shared/types/api.types";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast  = useToast();

  async function register(values: RegisterFormValues) {
    setIsLoading(true);
    try {
      // 1. Create the account via REST API
      await authApi.register({
        email:     values.email,
        password:  values.password,
        firstName: values.firstName,
        lastName:  values.lastName,
        role:      "vendor_owner",
      });
      
      // 2. Automatically sign in after registration
      const result = await signIn("credentials", {
        email:    values.email,
        password: values.password,
        redirect: false,
      });
      console.log("login seller",result);

      if (result?.error) {
        toast.error("Account created", "Please sign in with your new credentials.");
        router.push("/login");
        return;
      }

      toast.success("Account created!", "Let's set up your shop.");
      // shopId will be null → onboarding guard handles the redirect
      router.push("/onboarding");
      router.refresh();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(
        "Registration failed",
        apiErr?.message ?? "Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return { register, isLoading };
}
