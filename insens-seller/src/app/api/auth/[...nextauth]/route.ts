import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
            { email: credentials.email, password: credentials.password },
            { headers: { "Content-Type": "application/json" } },
          );

          // Unwrap NestJS envelope: { success, data: { accessToken, refreshToken, user } }
          const payload = data?.data ?? data;
          const user    = payload?.user;

          if (!user) return null;

          // API returns roles as string[] — only vendor_owner is allowed in this dashboard
          const roles: string[] = Array.isArray(user.roles) ? user.roles : [];
          if (!roles.includes("vendor_owner")) {
            throw new Error("FORBIDDEN");
          }

          // vendorId from JWT payload is the shopId in the seller context
          const shopId: string | null = payload.vendorId ?? user.vendorId ?? null;

          return {
            id:           user.id,
            email:        user.email,
            role:         "vendor_owner",
            shopId,
            firstName:    user.firstName ?? "",
            lastName:     user.lastName  ?? "",
            accessToken:  payload.accessToken,
            refreshToken: payload.refreshToken,
          };
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            const msg = error.response?.data?.error?.message ?? "Invalid credentials";
            throw new Error(msg);
          }
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On first sign-in user object is populated
      if (user) {
        const u = user as unknown as Record<string, unknown>;
        token.id           = u.id           as string;
        token.role         = u.role         as string;
        token.shopId       = u.shopId       as string | null;
        token.firstName    = u.firstName    as string;
        token.lastName     = u.lastName     as string;
        token.accessToken  = u.accessToken  as string;
        token.refreshToken = u.refreshToken as string;
      }

      // Handle session update — refresh shopId after onboarding
      if (trigger === "update" && session) {
        if (session.shopId !== undefined) token.shopId = session.shopId;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id        = token.id        as string;
      session.user.role      = token.role      as string;
      session.user.firstName = token.firstName as string;
      session.user.lastName  = token.lastName  as string;
      session.shopId         = token.shopId    as string | null;
      session.accessToken    = token.accessToken  as string;
      session.refreshToken   = token.refreshToken as string;
      return session;
    },
  },

  pages: {
    signIn:  "/login",
    error:   "/login",
  },

  session: { strategy: "jwt" },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
