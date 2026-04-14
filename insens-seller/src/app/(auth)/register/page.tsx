import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = { title: "Create Account — Insens Seller" };

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold text-oud-900">Create your account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Join Insens and start selling your fragrances.
        </p>
      </div>
      <RegisterForm />
    </>
  );
}
