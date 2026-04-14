import type { Metadata } from "next";

export const metadata: Metadata = { title: "Insens Seller — Sign In" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4 py-12">
      {/* Subtle luxury background pattern */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-oud-100/30 via-cream-50 to-cream-50" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Brand mark */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-semibold tracking-wide text-oud-900">
            Insens
          </h1>
          <div className="mx-auto mt-2 h-px w-12 bg-gold-500" />
          <p className="mt-2 text-sm uppercase tracking-widest text-oud-500">Seller Portal</p>
        </div>

        {/* Auth card */}
        <div className="rounded-xl border border-cream-200 bg-white p-8 shadow-sm">
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Insens. All rights reserved.
        </p>
      </div>
    </div>
  );
}
