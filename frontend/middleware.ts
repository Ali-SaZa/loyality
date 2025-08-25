import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if user is authenticated by looking for auth token
  const authToken = request.cookies.get('authToken')?.value || 
                   request.headers.get('authorization')?.replace('Bearer ', '')
  
  // Public routes that don't require authentication
  const publicRoutes = ['/auth']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Debug logging
  console.log(`🔍 Middleware - Path: ${pathname}, Auth Token: ${!!authToken}, Is Public: ${isPublicRoute}`)
  
  // If user is not authenticated and trying to access protected route
  if (!authToken && !isPublicRoute) {
    console.log(`🚫 Middleware - Redirecting unauthenticated user from ${pathname} to /auth`)
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  // If user is authenticated and trying to access auth page, redirect to dashboard
  if (authToken && isPublicRoute && pathname === '/auth') {
    console.log(`✅ Middleware - Redirecting authenticated user from /auth to /`)
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Allow authenticated users to access all routes
  if (authToken) {
    console.log(`✅ Middleware - Allowing authenticated user to access ${pathname}`)
    return NextResponse.next()
  }
  
  // Allow access to public routes
  if (isPublicRoute) {
    console.log(`✅ Middleware - Allowing access to public route ${pathname}`)
    return NextResponse.next()
  }
  
  // This should never happen, but just in case
  console.log(`❌ Middleware - Unexpected case for ${pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
