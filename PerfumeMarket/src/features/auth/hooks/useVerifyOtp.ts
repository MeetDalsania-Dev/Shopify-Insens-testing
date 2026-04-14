import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { resendOtp, verifyOtp } from "../api/auth.api";

const OTP_LENGTH = 5;
const RESEND_SECONDS = 60;

export const useVerifyOtp = () => {
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [isResending, setIsResending] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  const submit = async () => {
    const fullCode = code.join("");
    if (fullCode.length < OTP_LENGTH) {
      setApiError("Please enter the complete verification code.");
      return;
    }
    setIsLoading(true);
    setApiError(null);
    try {
      const result = await verifyOtp(email, fullCode);
      if (!result.ok) {
        setApiError(result.error ?? "Invalid code");
        return;
      }
      // useVerifyOtp.ts — on success
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setApiError(err?.message ?? "Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setApiError(null);
    try {
      await resendOtp(email ?? "");
      setCode(Array(OTP_LENGTH).fill(""));
      setResendTimer(RESEND_SECONDS);
      // Restart timer
      timerRef.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setApiError(err?.message ?? "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : "your email";

  return {
    code,
    setCode,
    isLoading,
    apiError,
    resendTimer,
    isResending,
    maskedEmail,
    submit,
    handleResend,
  };
};
