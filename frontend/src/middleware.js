import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const userRole = token?.role || 'admin';

    // Handle dashboard access based on user role
    if (pathname.startsWith('/dashboards/')) {
      const dashboardType = pathname.split('/')[2];
      
      // Admin can access all dashboards
      if (userRole === 'admin') {
        return;
      }
      
      // Agent (SubAdmin) can only access agent dashboard
      if (userRole === 'agent') {
        if (dashboardType === 'agent') {
          return; // Allow access to agent dashboard
        } else {
          // Redirect to agent dashboard
          return Response.redirect(new URL('/dashboards/agent', req.url));
        }
      }
      
      // User (Customer) can only access customer dashboard
      if (userRole === 'user') {
        if (dashboardType === 'customer') {
          return; // Allow access to customer dashboard
        } else {
          // Redirect to customer dashboard
          return Response.redirect(new URL('/dashboards/customer', req.url));
        }
      }
    }

    // For all other protected routes, just allow access if authenticated
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow authenticated users
    },
    pages: {
      signIn: '/auth/sign-in',
    },
  }
);

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/dashboards/:path*',
    '/property/:path*',
    '/agents/:path*',
    '/customers/:path*',
    '/orders/:path*',
    '/transactions/:path*',
    '/reviews/:path*',
    '/messages/:path*',
    '/inbox/:path*',
    '/post/:path*',
    '/pages/:path*',
    '/base-ui/:path*',
    '/advanced-ul/:path*',
    '/charts/:path*',
    '/forms/:path*',
    '/tables/:path*',
    '/icons/:path*',
    '/maps/:path*',
    '/widgets/:path*'
  ]
};