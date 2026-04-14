"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/hooks/useToast";
import type { LoginFormValues } from "@/features/auth/validation/login.schema";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast  = useToast();

  async function login(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email:    values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "FORBIDDEN") {
          toast.error("Access denied", "This dashboard is for shop owners only.");
        } else {
          toast.error("Invalid credentials", "Please check your email and password.");
        }
        return { error: result.error };
      }

      toast.success("Welcome back!", "Redirecting to your dashboard…");
      router.push("/dashboard");
      router.refresh();
      return { success: true };
    } catch {
      toast.error("Something went wrong", "Please try again.");
      return { error: "UNKNOWN" };
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isLoading };
}
