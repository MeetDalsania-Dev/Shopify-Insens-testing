import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Block non-vendor_owner from dashboard routes
    if (token && token.role !== "vendor_owner") {
      return NextResponse.redirect(new URL("/login?error=forbidden", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/shop/:path*",
    "/products/:path*",
    "/profile/:path*",
    "/onboarding",
  ],
};
