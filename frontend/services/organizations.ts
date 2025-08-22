import qs from 'qs'

import { API_ROUTES, HANDLE_ERROR } from './config'

import axiosInstance from '@/config/axios'
import { ApiWithParams } from '@/types'

export const GET_ALL_ORGANIZATIONS = async (params?: ApiWithParams) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.ORGANIZATIONS.GET_ALL, {
      params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
    })

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const GET_ORGANIZATION_BY_ID = async (organizationId: string) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.ORGANIZATIONS.GET_BY_ID(organizationId))

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}
