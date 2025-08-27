'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'

export default function DashboardRedirect() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // All authenticated users go to the same dashboard
      // The layout will show role-based menus automatically
      router.replace('/user')
    }
  }, [user, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-text-light">در حال هدایت به داشبورد...</p>
      </div>
    </div>
  )
}
