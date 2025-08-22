'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, role, token, logout } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated
    if (!token || !user) {
      router.push('/login');
      return;
    }
  }, [token, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'store':
        return 'فروشگاه';
      case 'admin':
        return 'مدیر';
      case 'customer':
        return 'مشتری';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                داشبورد برنامه وفاداری
              </h1>
              <p className="text-gray-600 mt-1">
                خوش آمدید به سیستم مدیریت وفاداری
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="bordered"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              خروج
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="flex items-center space-x-2 space-x-reverse">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>اطلاعات کاربری</span>
            </h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">نام:</label>
                <p className="text-gray-900">{user.name || 'نامشخص'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">شماره موبایل:</label>
                <p className="text-gray-900 font-mono">{user.phone}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">نقش:</label>
                <p className="text-gray-900">{getRoleText(role || '')}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">شناسه کاربر:</label>
                <p className="text-gray-900 font-mono text-sm">{user.id}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardBody className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">گزارش‌ها</h3>
                <p className="text-sm text-gray-500">مشاهده آمار و گزارش‌ها</p>
              </div>
            </CardBody>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardBody className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">عملیات جدید</h3>
                <p className="text-sm text-gray-500">ایجاد عملیات جدید</p>
              </div>
            </CardBody>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardBody className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">تنظیمات</h3>
                <p className="text-sm text-gray-500">مدیریت تنظیمات حساب</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 برنامه وفاداری. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </div>
  );
}
