'use client'
import { jwtDecode } from 'jwt-decode'
import { createContext, ReactNode, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

import { GET_USER } from '@/services/user'
import { LOGIN, LOGOUT } from '@/services/auth'
import axiosInstance from '@/config/axios'
import useLoading from '@/hooks/useLoading' // تعریف نوع اطلاعات کاربر

// تعریف نوع اطلاعات کاربر
interface LoginData {
  username: string
  password: string
}

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
  login: (userData: LoginData) => Promise<void>
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

        if (!storedUserDoc.firstName) {
          res = await GET_USER()
        }

        const storageData = { ...res?.data, ...storedUserDoc }

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
    fetchUser()
  }, [setLoading])

  const saveUser = async (data: SaveUserData) => {
    try {
      const { accessToken, refreshToken } = data

      axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`

      const decodedAccessToken: { exp: number; u_id: string } = await jwtDecode(accessToken)
      const decodedRefreshToken: { exp: number; u_id: string } = await jwtDecode(refreshToken)

      const res = await GET_USER()

      const storageData = {
        ...res?.data,
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

  const login = async (userData: LoginData) => {
    try {
      const { username, password } = userData
      const res = await LOGIN({ username, password })

      if (res?.status === 200) {
        await saveUser(res?.data)
      }
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await LOGOUT()
    } catch (error) {
      throw error
    } finally {
      setUser(null)
      Cookies.remove('accessToken')
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

  return <AuthContext.Provider value={{ user, login, logout, saveUser, updateUserFromOutside }}>{children}</AuthContext.Provider>
}
