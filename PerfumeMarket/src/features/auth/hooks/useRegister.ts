import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerUser } from "../api/auth.api";
import { useAuthStore } from "../state/auth.store";

export const registerSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export type RegisterForm = z.infer<typeof registerSchema>;

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const submit = async (data: RegisterForm) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const { jwt, user } = await registerUser(data);
      await setAuth(user, jwt);
      router.replace("/(onboarding)/select-role");
    } catch (err: any) {
      setApiError(err?.message ?? "Registration failed. Please try again.");
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
    togglePassword,
    submit: form.handleSubmit(submit),
  };
};
