import { API_ROUTES, HANDLE_ERROR } from './config'

import axiosInstance from '@/config/axios'

export const GET_ALL_JOB_CATEGORIES_ROOT = async (parentId?: string) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.JOB_CATEGORIES.GET_ALL_ROOT(parentId))

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}
