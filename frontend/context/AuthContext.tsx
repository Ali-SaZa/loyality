'use client'
import { jwtDecode } from 'jwt-decode'
import { createContext, ReactNode, useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

import axiosInstance from '@/config/axios'
import useLoading from '@/hooks/useLoading'

// Updated User interface with proper typing
interface User {
  _id: string
  phoneNumber: string
  name?: string
  totalPoints: number
  role: 'customer' | 'store' | 'admin'
  accessToken: string
  refreshToken: string
  userId: string
  AccessTokenExpireTime: number
  refreshTokenExpireTime: number
}

interface SaveUserData {
  accessToken: string
  refreshToken: string
  user: {
    _id: string
    phoneNumber: string
    name?: string
    totalPoints: number
    role: 'customer' | 'store' | 'admin'
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
  saveUser: (data: SaveUserData) => Promise<void>
  updateUserFromOutside: (data: Partial<User>) => void
  refreshToken: () => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setLoading } = useLoading()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if token is expired
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const decoded = jwtDecode<{ exp: number }>(token)
      return decoded.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }, [])

  // Refresh token logic
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      if (!user?.refreshToken) return false
      
      // Check if refresh token is expired
      if (isTokenExpired(user.refreshToken)) {
        await logout()
        return false
      }

      // For now, we'll use the existing access token as refresh token
      // In a real implementation, you'd make an API call to refresh
      const decodedRefresh = jwtDecode<{ exp: number; u_id: string }>(user.refreshToken)
      
      if (decodedRefresh.exp * 1000 < Date.now()) {
        await logout()
        return false
      }

      // Token is still valid, update axios headers
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${user.accessToken}`
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      await logout()
      return false
    }
  }, [user, isTokenExpired])

  // Fetch user data from storage
  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true)
      const storedUser = localStorage.getItem('user')

      if (storedUser) {
        const userData: User = JSON.parse(storedUser)
        
        // Check if access token is expired
        if (isTokenExpired(userData.accessToken)) {
          // Try to refresh token
          const refreshed = await refreshToken()
          if (!refreshed) {
            localStorage.removeItem('user')
            setUser(null)
            return
          }
        }

        // Set axios default headers
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${userData.accessToken}`
        
        setUser(userData)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      localStorage.removeItem('user')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [isTokenExpired, refreshToken])

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!user) return

    const checkTokenExpiry = () => {
      if (isTokenExpired(user.accessToken)) {
        refreshToken()
      }
    }

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000)
    return () => clearInterval(interval)
  }, [user, isTokenExpired, refreshToken])

  useEffect(() => {
    // Don't fetch user data on auth page to prevent unnecessary API calls
    if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
      fetchUser()
    } else {
      setIsLoading(false)
    }
  }, [fetchUser])

  const saveUser = async (data: SaveUserData) => {
    try {
      const { accessToken, refreshToken, user: userData } = data

      const decodedAccessToken: { exp: number; u_id: string } = jwtDecode(accessToken)
      const decodedRefreshToken: { exp: number; u_id: string } = jwtDecode(refreshToken)

      const storageData: User = {
        ...userData,
        accessToken,
        refreshToken,
        userId: decodedAccessToken.u_id,
        AccessTokenExpireTime: decodedAccessToken.exp * 1000,
        refreshTokenExpireTime: decodedRefreshToken.exp * 1000,
      }

      // Set axios default headers
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(storageData))

      // Set cookies for middleware
      const expireInSeconds = Math.floor((decodedRefreshToken.exp * 1000 - Date.now()) / 1000)
      Cookies.set('accessToken', accessToken, { expires: expireInSeconds / 86400 })
      Cookies.set('app_token', accessToken, { expires: expireInSeconds / 86400 })

      setUser(storageData)
    } catch (error) {
      console.error('Error saving user data:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Clear user state
      setUser(null)
      
      // Clear localStorage
      localStorage.removeItem('user')
      
      // Clear cookies
      Cookies.remove('accessToken')
      Cookies.remove('app_token')
      
      // Clear axios headers
      delete axiosInstance.defaults.headers['Authorization']
      
      // Clear authToken cookie for middleware
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      
      // Redirect to home
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
      
      toast.success('خروج موفقیت آمیز بود')
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if there's an error
      setUser(null)
      localStorage.removeItem('user')
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
  }

  const updateUserFromOutside = (data: Partial<User>) => {
    if (!user) return
    
    const updatedData = { ...user, ...data }
    localStorage.setItem('user', JSON.stringify(updatedData))
    setUser(updatedData)
  }

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    saveUser,
    updateUserFromOutside,
    refreshToken,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
