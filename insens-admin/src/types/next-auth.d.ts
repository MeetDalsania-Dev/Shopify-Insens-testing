import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    accessToken?: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
