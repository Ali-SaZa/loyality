import { API_ROUTES, HANDLE_ERROR } from './config'

import axiosInstance from '@/config/axios'

export const GET_ALL_SKILLS = async () => {
  try {
    const response = await axiosInstance.get(API_ROUTES.SKILLS.GET_ALL_SKILLS)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}
