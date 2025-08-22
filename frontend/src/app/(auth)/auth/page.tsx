'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/auth-card';
import { useAuthStore } from '@/store/auth-store';
import { isTokenExpired } from '@/lib/auth';

export default function AuthPage() {
  const router = useRouter();
  const { token, user, hydrateFromStorage } = useAuthStore();

  useEffect(() => {
    // Hydrate store from localStorage
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    // Check if user is already authenticated
    if (token && user) {
      // Check if token is expired
      if (!isTokenExpired(token)) {
        router.push('/');
      } else {
        // Token expired, clear it
        useAuthStore.getState().logout();
      }
    }
  }, [token, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            برنامه وفاداری
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-2 sm:px-0">
            برای ورود به حساب کاربری خود شماره موبایل خود را وارد کنید
          </p>
        </div>
        
        <AuthCard />
        
        <div className="text-center mt-6 sm:mt-8 px-2 sm:px-0">
          <p className="text-xs sm:text-sm text-gray-500">
            با ورود به برنامه، شما شرایط و قوانین استفاده را می‌پذیرید
          </p>
        </div>
      </div>
    </div>
  );
}
