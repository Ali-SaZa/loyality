'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { User } from '@heroui/user'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'

// User data interface - using the one from AuthContext
interface UserData {
  accessToken: string
  refreshToken: string
  userId: string
  AccessTokenExpireTime: number
  refreshTokenExpireTime: number
  // Additional fields from the auth response
  _id?: string
  phoneNumber?: string
  name?: string
  totalPoints?: number
  role?: string
  tags?: string[]
  lastActivity?: string
  [key: string]: any
}

function DashboardContent() {
  const { user, logout } = useAuth()
  const router = useRouter()

  // Redirect to auth if no user
  useEffect(() => {
    if (!user) {
      router.replace('/auth')
    }
  }, [user, router])

  const handleLogout = () => {
    logout()
  }

  // Don't render if user is not available
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">داشبورد برنامه وفاداری</h1>
          <Button
            color="danger"
            variant="bordered"
            onPress={handleLogout}
          >
            خروج
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">اطلاعات کاربر</h2>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-4">
              <User
                name={user.name || user.phoneNumber || 'کاربر'}
                description={user.phoneNumber || 'شماره موبایل'}
                avatarProps={{
                  src: `https://ui-avatars.com/api/?name=${user.name || user.phoneNumber || 'کاربر'}&background=random`,
                  size: "lg"
                }}
              />
              <div className="ml-auto text-right">
                <p className="text-sm text-gray-500">نقش</p>
                <p className="font-medium capitalize">{user.role || 'customer'}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Points Card */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">امتیازات وفاداری</h2>
          </CardHeader>
          <CardBody>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {(user.totalPoints || 0).toLocaleString()}
              </div>
              <p className="text-gray-600">امتیاز کل</p>
            </div>
          </CardBody>
        </Card>

        {/* Debug Info (Remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold text-yellow-600">Debug Info</h2>
            </CardHeader>
            <CardBody>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </CardBody>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">عملیات سریع</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                color="primary"
                variant="bordered"
                className="h-20"
                onPress={() => alert('این قابلیت به زودی اضافه خواهد شد')}
              >
                <div className="text-center">
                  <div className="text-lg font-medium">اسکن کارت</div>
                  <div className="text-sm text-gray-500">اسکن QR کد</div>
                </div>
              </Button>
              
              <Button
                color="secondary"
                variant="bordered"
                className="h-20"
                onPress={() => alert('این قابلیت به زودی اضافه خواهد شد')}
              >
                <div className="text-center">
                  <div className="text-lg font-medium">تاریخچه</div>
                  <div className="text-sm text-gray-500">مشاهده تراکنش‌ها</div>
                </div>
              </Button>
              
              <Button
                color="success"
                variant="bordered"
                className="h-20"
                onPress={() => alert('این قابلیت به زودی اضافه خواهد شد')}
              >
                <div className="text-center">
                  <div className="text-lg font-medium">پروفایل</div>
                  <div className="text-sm text-gray-500">ویرایش اطلاعات</div>
                </div>
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

// Main dashboard page using context for authentication
export default function DashboardPage() {
  return <DashboardContent />
}
