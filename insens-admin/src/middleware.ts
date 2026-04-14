import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token?.role,
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/shops/:path*',
    '/users/:path*',
    '/profile/:path*',
    '/requests/:path*',
    '/vendors/:path*',
  ],
};
