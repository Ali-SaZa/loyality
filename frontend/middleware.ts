import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define protected routes (routes that require authentication)
  const protectedRoutes = ['/dashboard', '/app'];
  
  // Define public routes (routes that don't require authentication)
  const publicRoutes = ['/auth'];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => path === route);
  
  // Check if the current path is the root route
  const isRootRoute = path === '/';

  // Get auth token from cookies
  const token = request.cookies.get('app_token')?.value;
  const isAuthenticated = !!token;

  // Handle protected routes
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      // Redirect to auth if no token found
      const authUrl = new URL('/auth', request.url);
      return NextResponse.redirect(authUrl);
    }
  }

  // Handle root route
  if (isRootRoute) {
    if (!isAuthenticated) {
      // Redirect unauthenticated users to auth
      const authUrl = new URL('/auth', request.url);
      return NextResponse.redirect(authUrl);
    }
    // Authenticated users can access root route
  }

  // Handle public routes (like /auth)
  if (isPublicRoute) {
    if (isAuthenticated) {
      // Redirect authenticated users to root
      const rootUrl = new URL('/', request.url);
      return NextResponse.redirect(rootUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
