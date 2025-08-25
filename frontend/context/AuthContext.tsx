'use client'
import { jwtDecode } from 'jwt-decode'
import { createContext, ReactNode, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

import axiosInstance from '@/config/axios'
import useLoading from '@/hooks/useLoading' // تعریف نوع اطلاعات کاربر



interface User {
  accessToken: string
  refreshToken: string
  userId: string
  AccessTokenExpireTime: number
  refreshTokenExpireTime: number

  [key: string]: any
}

interface SaveUserData {
  accessToken: string
  refreshToken: string
}

// تعریف نوع AuthContext
interface AuthContextType {
  user: User | null
  logout: () => Promise<void>
  saveUser: (data: SaveUserData) => Promise<void>
  updateUserFromOutside: (data: any) => void
}

// ایجاد context و تعریف نوع اولیه
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setLoading } = useLoading()
  const [user, setUser] = useState<User | null>(null)

  const fetchUser = async () => {
    try {
      setLoading(true)
      const storedUser = localStorage.getItem('user')

      if (storedUser) {
        const storedUserDoc = await JSON.parse(storedUser)

        let res = { data: {} }

        const storageData = { ...storedUserDoc }

        setUser(storageData)
        localStorage.setItem('user', JSON.stringify(storageData))
      }
    } catch (error) {
      console.error('خطا در دریافت اطلاعات کاربر', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Don't fetch user data on auth page to prevent unnecessary API calls
    if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
      fetchUser()
    }
  }, [setLoading])

  const saveUser = async (data: SaveUserData) => {
    try {
      const { accessToken, refreshToken } = data

      axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`

      const decodedAccessToken: { exp: number; u_id: string } = await jwtDecode(accessToken)
      const decodedRefreshToken: { exp: number; u_id: string } = await jwtDecode(refreshToken)

      // For Loyalty Program, we'll use the user data from the auth response
      // instead of making an additional API call
      const storageData = {
        accessToken,
        refreshToken,
        userId: decodedAccessToken.u_id,
        AccessTokenExpireTime: decodedAccessToken.exp * 1000,
        refreshTokenExpireTime: decodedRefreshToken.exp * 1000,
      }

      localStorage.setItem('user', JSON.stringify(storageData))

      // محاسبه زمان انقضای کوکی (تبدیل به ثانیه)
      const expireInSeconds = Math.floor((decodedRefreshToken.exp * 1000 - Date.now()) / 1000)

      Cookies.set('accessToken', JSON.stringify(accessToken), { expires: expireInSeconds / 86400 })
      setUser(storageData)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      // Simple logout without API call for Loyalty Program
    } catch (error) {
      throw error
    } finally {
      setUser(null)
      Cookies.remove('accessToken')
      // Clear the authToken cookie for middleware
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      localStorage.clear()
      window.location.href = '/'
      toast.success('خروج موفقیت آمیز بود')
    }
  }

  const updateUserFromOutside = (data: any) => {
    const { password, confirmPassword, ...rest } = data
    const updatedData = { ...user, ...rest }

    localStorage.setItem('user', JSON.stringify(updatedData))
    setUser(updatedData)
  }

  return <AuthContext.Provider value={{ user, logout, saveUser, updateUserFromOutside }}>{children}</AuthContext.Provider>
}
