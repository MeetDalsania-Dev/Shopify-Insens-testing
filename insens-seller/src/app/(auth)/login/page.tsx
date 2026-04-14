import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = { title: "Sign In — Insens Seller" };

export default function LoginPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold text-oud-900">Welcome back</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to manage your shop and products.
        </p>
      </div>
      <LoginForm />
    </>
  );
}
