import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => (token as any)?.role === 'INSENS_ADMIN',
  },
});

export const config = {
  matcher: ['/dashboard/:path*', '/shops/:path*', '/users/:path*', '/profile/:path*'],
};
