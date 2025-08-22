import { API_ROUTES, HANDLE_ERROR } from './config'

import axiosInstance from '@/config/axios'

export const CREATE_JOB_SIMULATION_REQUEST = async (data: any) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.JOB_SIMULATION_REQUEST.CREATE, data)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}
