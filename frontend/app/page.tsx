'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { User } from '@heroui/user'
import { useRouter } from 'next/navigation'
import { logout } from '@/config/axios'

interface UserData {
  _id: string
  phoneNumber: string
  name?: string
  totalPoints: number
  role: string
  tags?: string[]
  lastActivity?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/auth')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    logout()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

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
                name={user.name || 'کاربر'}
                description={user.phoneNumber}
                avatarProps={{
                  src: `https://ui-avatars.com/api/?name=${user.name || 'کاربر'}&background=random`,
                  size: "lg"
                }}
              />
              <div className="ml-auto text-right">
                <p className="text-sm text-gray-500">نقش</p>
                <p className="font-medium capitalize">{user.role}</p>
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
                {user.totalPoints.toLocaleString()}
              </div>
              <p className="text-gray-600">امتیاز کل</p>
            </div>
          </CardBody>
        </Card>

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
