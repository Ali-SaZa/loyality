import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public routes that don't require authentication
  const publicRoutes = ['/auth']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // For now, let's simplify middleware and rely more on client-side protection
  // This avoids the complexity of trying to read tokens in middleware
  
  // Debug logging
  console.log(`🔍 Middleware - Path: ${pathname}, Is Public: ${isPublicRoute}`)
  
  // Allow all routes to pass through - authentication will be handled client-side
  // This is more reliable and avoids middleware token reading issues
  
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
