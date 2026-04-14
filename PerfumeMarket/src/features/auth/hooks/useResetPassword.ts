import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resetPassword } from "../api/auth.api";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(6, "Minimum 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  // const { code } = useLocalSearchParams<{ code: string }>();
  const { email } = useLocalSearchParams<{ email: string }>();
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const submit = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await resetPassword(
        decodeURIComponent(email),
        data.password,
        data.confirmPassword,
      );
      router.replace("/auth/reset-success");
    } catch (err: any) {
      setApiError(
        err?.message ?? "Failed to reset password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  return {
    form,
    isLoading,
    apiError,
    showPassword,
    showConfirmPassword,
    togglePassword,
    toggleConfirmPassword,
    submit: form.handleSubmit(submit),
  };
};
