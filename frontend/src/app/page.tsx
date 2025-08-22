'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { FontDemo } from '@/components/font-demo';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { isTokenExpired } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();
  const { token, user, role, logout, hydrateFromStorage } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate store from localStorage
    hydrateFromStorage();
    setIsLoading(false);
  }, [hydrateFromStorage]);

  useEffect(() => {
    // Check if user is authenticated and token is valid
    if (token && user) {
      if (isTokenExpired(token)) {
        // Token expired, clear it and redirect to auth
        logout();
        router.push('/auth');
      }
    } else {
      // No token or user, redirect to auth
      router.push('/auth');
    }
  }, [token, user, logout, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground-secondary">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!token || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with User Info - Mobile First */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                خوش آمدید، {user.name || 'کاربر'}!
              </h1>
              <p className="text-sm sm:text-base text-foreground-secondary">
                نقش: {role === 'customer' ? 'مشتری' : role === 'store' ? 'فروشگاه' : 'مدیر'}
              </p>
            </div>
            <Button 
              color="danger" 
              variant="bordered"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => {
                logout();
                router.push('/auth');
              }}
            >
              خروج
            </Button>
          </div>

          {/* User Dashboard - Mobile First Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3 sm:pb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-primary">
                  اطلاعات حساب
                </h2>
              </CardHeader>
              <CardBody className="p-4 sm:p-6">
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-foreground-secondary">
                    شماره موبایل: {user.phone}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground-secondary">
                    شناسه: {user.id}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3 sm:pb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-secondary">
                  امتیازات
                </h2>
              </CardHeader>
              <CardBody className="p-4 sm:p-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-secondary">0</p>
                  <p className="text-xs sm:text-sm text-foreground-secondary">امتیاز کل</p>
                </div>
              </CardBody>
            </Card>

            <Card className="border-0 shadow-lg sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3 sm:pb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-success">
                  فعالیت‌ها
                </h2>
              </CardHeader>
              <CardBody className="p-4 sm:p-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-success">0</p>
                  <p className="text-xs sm:text-sm text-foreground-secondary">تراکنش</p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions - Mobile First */}
          <Card className="border-0 shadow-lg mb-8 sm:mb-12">
            <CardHeader className="pb-3 sm:pb-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                اقدامات سریع
              </h2>
            </CardHeader>
            <CardBody className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Button 
                  color="primary"
                  size="lg"
                  className="h-14 sm:h-16 text-sm sm:text-base"
                >
                  مشاهده امتیازات
                </Button>
                <Button 
                  color="secondary"
                  size="lg"
                  className="h-14 sm:h-16 text-sm sm:text-base"
                >
                  تاریخچه تراکنش‌ها
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Font Demo Section - Hidden on mobile for better UX */}
          <div className="hidden sm:block mt-16">
            <FontDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
