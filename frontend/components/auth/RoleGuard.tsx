'use client'
import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'

interface RoleGuardProps {
  children: ReactNode
  requiredRole?: 'admin' | 'store' | 'customer'
  fallback?: ReactNode
}

export default function RoleGuard({ 
  children, 
  requiredRole, 
  fallback 
}: RoleGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return

    // If no user, redirect to auth
    if (!user) {
      const currentPath = window.location.pathname
      const authUrl = `/auth?redirect=${encodeURIComponent(currentPath)}`
      router.replace(authUrl)
      return
    }

    // If specific role is required, check it
    if (requiredRole && user.role !== requiredRole) {
      // Redirect to user's appropriate dashboard
      const dashboardUrl = `/${user.role}`
      router.replace(dashboardUrl)
      return
    }
  }, [user, isLoading, requiredRole, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  // Show fallback if user doesn't have access
  if (!user || (requiredRole && user.role !== requiredRole)) {
    return fallback || null
  }

  // User is authenticated and has proper access
  return <>{children}</>
}
