"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            fontFamily: "var(--font-inter)",
            border:     "1px solid hsl(var(--border))",
          },
        }}
      />
    </SessionProvider>
  );
}
