import axiosInstance, { handleApiError } from '@/config/axios'
import { API_CONFIG } from '@/config/api'

// Types for authentication
export interface RequestOtpRequest {
  phoneNumber: string
}

export interface RequestOtpResponse {
  message: string
  phoneNumber: string
}

export interface VerifyOtpRequest {
  phoneNumber: string
  code: string
}

export interface User {
  _id: string
  phoneNumber: string
  firstname?: string
  lastname?: string
  totalPoints: number
  role: 'customer' | 'store' | 'admin'  // Updated to include all three user levels
}

export interface VerifyOtpResponse {
  accessToken: string
  user: User
  isNewUser: boolean
}

export interface UserProfileResponse {
  message: string
  user: {
    phoneNumber: string
    userId: string
    role: string
  }
}

// Authentication service functions
export const authService = {
  // Request OTP code
  async requestOtp(data: RequestOtpRequest): Promise<RequestOtpResponse> {
    try {
      const response = await axiosInstance.post<RequestOtpResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REQUEST_OTP,
        data
      )
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Verify OTP and authenticate user
  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    try {
      const response = await axiosInstance.post<VerifyOtpResponse>(
        API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP,
        data
      )
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get current user profile
  async getProfile(): Promise<UserProfileResponse> {
    try {
      const response = await axiosInstance.get<UserProfileResponse>(
        API_CONFIG.ENDPOINTS.AUTH.PROFILE
      )
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Validate token (optional - can be used to check if token is still valid)
  async validateToken(): Promise<boolean> {
    try {
      await this.getProfile()
      return true
    } catch (error) {
      return false
    }
  }
}

// Export individual functions for convenience
export const requestOtp = authService.requestOtp
export const verifyOtp = authService.verifyOtp
export const getProfile = authService.getProfile
export const validateToken = authService.validateToken

export default authService
