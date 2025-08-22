import { API_ROUTES, HANDLE_ERROR } from './config'

import axiosInstance from '@/config/axios'

export const SEND_OTP = async (data: { mobile: string }) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.AUTH.SEND_OTP, data)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const CHECK_OTP = async (data: { mobile: string; verifyCode: string }) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.AUTH.CHECK_OTP(data.mobile), { verifyCode: data.verifyCode })

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const SEND_LOGIN_OTP = async (data: { mobile: string }) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.AUTH.SEND_LOGIN_OTP, data)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const CHECK_LOGIN_OTP = async (data: { mobile: string; otpCode: string }) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.AUTH.CHECK_LOGIN_OTP, data)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const LOGIN = async (data: { username: string; password: string }) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.AUTH.LOGIN, data)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const LOGOUT = async () => {
  try {
    const response = await axiosInstance.post(API_ROUTES.AUTH.LOGOUT)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const CHANGE_USER_PASSWORD = async (data: { oldPassword: string; newPassword: string }) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.AUTH.CHANGE_PASSWORD, data)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const SEND_VERIFY_CODE_TO_MOBILE_AGAIN = async (mobile: string) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.AUTH.SEND_VERIFY_CODE(mobile))

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}
