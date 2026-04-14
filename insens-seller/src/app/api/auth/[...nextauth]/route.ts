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

          // Only SHOP_OWNER role is allowed in this dashboard
          if (user.role !== "SHOP_OWNER") {
            throw new Error("FORBIDDEN");
          }

          return {
            id:           user.id,
            email:        user.email,
            role:         user.role,
            shopId:       user.shopId ?? null,
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
    async jwt({ token, user }) {
      // On first sign-in user object is populated
      if (user) {
        token.id           = user.id;
        token.role         = (user as unknown as Record<string, unknown>).role as string;
        token.shopId       = (user as unknown as Record<string, unknown>).shopId as string | null;
        token.firstName    = (user as unknown as Record<string, unknown>).firstName as string;
        token.lastName     = (user as unknown as Record<string, unknown>).lastName  as string;
        token.accessToken  = (user as unknown as Record<string, unknown>).accessToken  as string;
        token.refreshToken = (user as unknown as Record<string, unknown>).refreshToken as string;
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
