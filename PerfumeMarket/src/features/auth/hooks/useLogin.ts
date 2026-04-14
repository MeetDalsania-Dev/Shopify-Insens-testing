import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginUser } from "../api/auth.api";
import { useAuthStore } from "../state/auth.store";

import { parseError } from "@/src/shared/lib/parseError";
export const loginSchema = z.object({
  identifier: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const submit = async (data: LoginForm) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const { jwt, user } = await loginUser(data);
      await setAuth(user, jwt);
      router.replace("/(onboarding)/select-role");
    } catch (err) {
      setApiError(parseError(err).message); // ← always normalized
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  return {
    form,
    isLoading,
    apiError,
    showPassword,
    setApiError,
    togglePassword,
    submit: form.handleSubmit(submit),
  };
};
