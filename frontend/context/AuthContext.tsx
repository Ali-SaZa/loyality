'use client'
import { jwtDecode } from 'jwt-decode'
import { createContext, ReactNode, useEffect, useState, useCallback, useRef } from 'react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

import axiosInstance from '@/config/axios'
import useLoading from '@/hooks/useLoading'
import { UserRole } from '@/types/enums'

// Updated User interface with proper typing
interface User {
  _id: string
  phoneNumber: string
  firstname?: string
  lastname?: string
  totalPoints: number
  role: UserRole
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
    firstname?: string
    lastname?: string
    totalPoints: number
    role: UserRole
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
  const fetchUserRef = useRef<() => Promise<void> | undefined>(undefined)

  // Check if token is expired
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const decoded = jwtDecode<{ exp: number }>(token)
      return decoded.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }, [])

  // Logout function - defined early to avoid dependency issues
  const logout = useCallback(async () => {
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

      // Token is still valid, update axios headers
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${user.accessToken}`
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      await logout()
      return false
    }
  }, [user?.refreshToken, user?.accessToken, isTokenExpired, logout])

  // Fetch user data from storage
  const fetchUser = useCallback(async () => {
    try {
      console.log('🔍 fetchUser: Starting to fetch user data')
      setIsLoading(true)
      const storedUser = localStorage.getItem('user')

      if (storedUser) {
        const userData: User = JSON.parse(storedUser)
        console.log('🔍 fetchUser: Found stored user:', { role: userData.role, hasToken: !!userData.accessToken })
        
        // Check if access token is expired
        if (isTokenExpired(userData.accessToken)) {
          console.log('🔍 fetchUser: Access token expired, attempting refresh')
          // Try to refresh token
          const refreshed = await refreshToken()
          if (!refreshed) {
            console.log('🔍 fetchUser: Token refresh failed, clearing user data')
            localStorage.removeItem('user')
            setUser(null)
            return
          }
          console.log('🔍 fetchUser: Token refresh successful')
        } else {
          console.log('🔍 fetchUser: Access token is valid')
        }

        // Set axios default headers
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${userData.accessToken}`
        
        setUser(userData)
        console.log('🔍 fetchUser: User data set successfully')
      } else {
        console.log('🔍 fetchUser: No stored user found')
      }
    } catch (error) {
      console.error('🔍 fetchUser: Error fetching user data:', error)
      localStorage.removeItem('user')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [isTokenExpired, refreshToken])

  // Store fetchUser in ref to avoid dependency issues
  fetchUserRef.current = fetchUser

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
  }, [user?.accessToken, isTokenExpired, refreshToken])

  useEffect(() => {
    // Don't fetch user data on auth page to prevent unnecessary API calls
    if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
      fetchUserRef.current?.()
    } else {
      setIsLoading(false)
    }
  }, []) // Empty dependency array since we're using ref

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
