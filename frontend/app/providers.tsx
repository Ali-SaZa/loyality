'use client'

import React from 'react'
import { HeroUIProvider } from '@heroui/system'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'

import { AuthProvider } from '@/context/AuthContext'
import { LoadingProvider } from '@/context/LoadingContext'
import { GlobalProvider } from '@/context/GlobalContext'
import { AlertModalProvider } from '@/context/AlertModalContext'
import { SmsBalanceProvider } from '@/context/SmsBalanceContext'

export interface ProvidersProps {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <LoadingProvider>
          <AuthProvider>
            <SmsBalanceProvider>
              <GlobalProvider>
                <AlertModalProvider>{children}</AlertModalProvider>
              </GlobalProvider>
            </SmsBalanceProvider>
          </AuthProvider>
        </LoadingProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  )
}
