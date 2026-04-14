import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sendOtp } from "../api/auth.api";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export type ForgotPasswordForm = z.infer<typeof forgotSchema>;

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const submit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await sendOtp(data.email);
      setIsSuccess(true);
      // hooks/useForgotPassword.ts — update success navigation
      router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      setApiError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    apiError,
    isSuccess,
    submit: form.handleSubmit(submit),
  };
};
