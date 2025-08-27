'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'

import useAuth from '@/hooks/useAuth'
import ObsLogo from '@/components/ui/ObsLogo'

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (user) {
      router.replace('/user')
    }
  }, [user, router])

  // Show loading while checking auth
  if (user !== null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <ObsLogo />
            <div className="flex items-center gap-4">
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
