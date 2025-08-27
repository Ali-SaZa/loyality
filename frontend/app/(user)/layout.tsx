'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

import UserSidebar from '@/components/layouts/user/Sidebar'
import UserNavbar from '@/components/layouts/user/Navbar'
import useAuth from '@/hooks/useAuth'

interface UserLayoutProps {
  children: React.ReactNode
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect if user is not authenticated
  React.useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [user, router])

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  // Single layout for all authenticated users - menus will be role-based
  return (
    <div className="flex h-screen bg-background-50">
      <UserSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserNavbar />
        <main className="flex-1 overflow-y-auto bg-background-50">
          {children}
        </main>
      </div>
    </div>
  )
}

export default UserLayout
