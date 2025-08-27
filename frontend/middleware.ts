import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define route patterns for better organization
const ROUTES = {
  PUBLIC: ['/auth', '/', '/about-us', '/contact-us', '/questions'],
  ADMIN: ['/admin'],
  STORE: ['/store'],
  CUSTOMER: ['/customer'],
  USER_PROTECTED: ['/admin', '/store', '/customer']
} as const

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if it's a public route
  const isPublicRoute = ROUTES.PUBLIC.some(route => 
    pathname === route || pathname.startsWith(route)
  )
  
  // Check if it's a protected route
  const isProtectedRoute = ROUTES.USER_PROTECTED.some(route => 
    pathname.startsWith(route)
  )
  
  // Allow public routes to pass through
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // For protected routes, check authentication
  if (isProtectedRoute) {
    const token = request.cookies.get('app_token')?.value || 
                  request.cookies.get('accessToken')?.value
    
    // If no token, redirect to auth
    if (!token) {
      const authUrl = new URL('/auth', request.url)
      authUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(authUrl)
    }
    
    // Token exists, let it pass through to client-side for role validation
    // Client-side will handle role-based access control
    return NextResponse.next()
  }
  
  // For all other routes, allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled by backend)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
