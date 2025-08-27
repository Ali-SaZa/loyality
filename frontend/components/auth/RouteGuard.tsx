'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import useAuth from '@/hooks/useAuth'

interface RouteGuardProps {
  children: ReactNode
  requiredRole?: 'admin' | 'store' | 'customer'
  allowedRoles?: ('admin' | 'store' | 'customer')[]
  fallback?: ReactNode
}

export default function RouteGuard({ 
  children, 
  requiredRole, 
  allowedRoles, 
  fallback 
}: RouteGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return

    // If no user, redirect to auth
    if (!user) {
      const authUrl = `/auth?redirect=${encodeURIComponent(redirectTo)}`
      router.replace(authUrl)
      return
    }

    // If no specific role is required, just ensure user is authenticated
    if (!requiredRole && !allowedRoles) {
      return // Allow access to general user routes
    }

    // Check role-based access
    if (requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      const dashboardUrl = `/${user.role === 'admin' ? 'admin' : user.role === 'store' ? 'store' : 'customer'}`
      router.replace(dashboardUrl)
      return
    }

    // Check if user has any of the allowed roles
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user role
      const dashboardUrl = `/${user.role === 'admin' ? 'admin' : user.role === 'store' ? 'store' : 'customer'}`
      router.replace(dashboardUrl)
      return
    }
  }, [user, isLoading, requiredRole, allowedRoles, router, redirectTo])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light">در حال بررسی دسترسی...</p>
        </div>
      </div>
    )
  }

  // Show fallback if user doesn't have access
  if (!user || 
      (requiredRole && user.role !== requiredRole) ||
      (allowedRoles && !allowedRoles.includes(user.role))) {
    return fallback || null
  }

  // User is authenticated and has proper access
  return <>{children}</>
}
