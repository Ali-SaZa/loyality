import qs from 'qs'

import { API_ROUTES, HANDLE_ERROR } from './config'

import axiosInstance from '@/config/axios'

export const GET_ALL_MAJORS = async (params?: ApiWithParams) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.MAJOR.GET_ALL_MAJORS, {
      params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
    })

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}
