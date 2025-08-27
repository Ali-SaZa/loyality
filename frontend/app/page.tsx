'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'

import useAuth from '@/hooks/useAuth'
import ObsLogo from '@/components/ui/ObsLogo'
import UserDropdown from '@/components/ui/UserDropdown'

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Helper function to get role-specific info
  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          title: 'پنل مدیریت',
          color: 'danger',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-600'
        }
      case 'store':
        return {
          title: 'پنل فروشگاه',
          color: 'success',
          bgColor: 'bg-success-50',
          borderColor: 'border-success-200',
          textColor: 'text-success-600'
        }
      case 'customer':
      default:
        return {
          title: 'پنل مشتری',
          color: 'primary',
          bgColor: 'bg-primary-50',
          borderColor: 'border-primary-200',
          textColor: 'text-primary-600'
        }
    }
  }

  // Show loading while checking auth (user is null during initial load)
  if (user === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  const roleInfo = user ? getRoleInfo(user.role || 'customer') : null

  // Landing page for all users (authenticated and non-authenticated)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <ObsLogo />
            <div className="flex items-center gap-4">
              {user ? (
                // User dropdown for authenticated users
                <UserDropdown useNavbarItem={false} />
              ) : (
                // Login/Register buttons for non-authenticated users
                <>
                  <Button
                    variant="light"
                    color="primary"
                    onPress={() => router.push('/auth')}
                  >
                    ورود
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => router.push('/auth')}
                  >
                    ثبت نام
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            برنامه وفاداری
            <span className="text-primary block">هوشمند</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            سیستم مدیریت وفاداری مشتریان با قابلیت‌های پیشرفته برای فروشگاه‌ها و کسب و کارها
          </p>
          
          {user ? (
            // Welcome message and quick actions for authenticated users
            <div className="space-y-4">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${roleInfo?.bgColor} ${roleInfo?.borderColor} ${roleInfo?.textColor}`}>
                {roleInfo?.title}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  color="primary"
                  onPress={() => {
                    if (user.role === 'admin') {
                      router.push('/admin')
                    } else if (user.role === 'store') {
                      router.push('/store')
                    } else {
                      router.push('/customer')
                    }
                  }}
                  className="text-lg px-8 py-4"
                >
                  ورود به داشبورد
                </Button>
                <Button
                  size="lg"
                  variant="bordered"
                  color="primary"
                  onPress={() => router.push('/auth/profile')}
                  className="text-lg px-8 py-4"
                >
                  ویرایش پروفایل
                </Button>
              </div>
            </div>
          ) : (
            // Call-to-action buttons for non-authenticated users
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                color="primary"
                onPress={() => router.push('/auth')}
                className="text-lg px-8 py-4"
              >
                شروع کنید
              </Button>
              <Button
                size="lg"
                variant="bordered"
                color="primary"
                onPress={() => router.push('/auth')}
                className="text-lg px-8 py-4"
              >
                اطلاعات بیشتر
              </Button>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-1 text-center">
            <CardBody className="p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">مدیریت وفاداری</h3>
              <p className="text-gray-600">
                سیستم امتیازدهی و پاداش برای حفظ مشتریان
              </p>
            </CardBody>
          </Card>

          <Card className="border-1 text-center">
            <CardBody className="p-6">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🏪</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">مدیریت فروشگاه</h3>
              <p className="text-gray-600">
                ابزارهای کامل برای مدیریت کسب و کار
              </p>
            </CardBody>
          </Card>

          <Card className="border-1 text-center">
            <CardBody className="p-6">
              <div className="w-16 h-16 bg-warning rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">گزارشات تحلیلی</h3>
              <p className="text-gray-600">
                تحلیل‌های دقیق عملکرد و رفتار مشتریان
              </p>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  )
}
