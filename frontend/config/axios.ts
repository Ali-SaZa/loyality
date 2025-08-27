import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { API_CONFIG } from './api'

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to auth
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        window.location.href = '/auth'
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    // Axios error with response
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    
    // HTTP status error
    if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          return 'درخواست نامعتبر است'
        case 401:
          return 'احراز هویت ناموفق بود'
        case 403:
          return 'دسترسی غیرمجاز'
        case 404:
          return 'منبع مورد نظر یافت نشد'
        case 429:
          return 'تعداد درخواست‌ها بیش از حد مجاز است'
        case 500:
          return 'خطای داخلی سرور'
        default:
          return 'خطای نامشخص رخ داده است'
      }
    }
    
    // Network error
    if (error.code === 'ECONNABORTED') {
      return 'درخواست به دلیل تاخیر لغو شد'
    }
    
    if (error.code === 'ERR_NETWORK') {
      return 'خطا در ارتباط با سرور'
    }
  }
  
  // Generic error
  return 'خطای نامشخص رخ داده است'
}



// Helper function to logout
export const logout = () => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  // Use router.push for better navigation
  if (typeof window !== 'undefined') {
    window.location.href = '/auth'
  }
}

export default axiosInstance
