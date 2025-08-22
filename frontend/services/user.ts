import { API_ROUTES, HANDLE_ERROR } from './config'

import axiosInstance from '@/config/axios'

export const GET_USER = async () => {
  try {
    const response = await axiosInstance.get(API_ROUTES.USER.GET_USER)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const UPDATE_USER_PROFILE = async (data: any) => {
  try {
    const response = await axiosInstance.put(API_ROUTES.USER.UPDATE_PROFILE, data)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const UPDATE_USER_AVATAR = async (imageId: string) => {
  try {
    const response = await axiosInstance.patch(API_ROUTES.USER.UPDATE_AVATAR, { imageId })

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const SUBMIT_EVALUATION_QUESTIONS = async (data: any) => {
  try {
    const response = await axiosInstance.put(API_ROUTES.USER.JOB_SIMULATION_EVALUATION, data)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}
