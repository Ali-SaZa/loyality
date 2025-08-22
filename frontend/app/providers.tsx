'use client'

import React from 'react'
import { NextUIProvider } from '@nextui-org/system'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'

import { AuthProvider } from '@/context/AuthContext'
import { LoadingProvider } from '@/context/LoadingContext'
import { GlobalProvider } from '@/context/GlobalContext'
import { AlertModalProvider } from '@/context/AlertModalContext'

export interface ProvidersProps {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter()

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <LoadingProvider>
          <AuthProvider>
            <GlobalProvider>
              <AlertModalProvider>{children}</AlertModalProvider>
            </GlobalProvider>
          </AuthProvider>
        </LoadingProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}
