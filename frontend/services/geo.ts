import qs from 'qs'

import { API_ROUTES, HANDLE_ERROR } from './config'

import axiosInstance from '@/config/axios'

export const GET_ALL_PROVINCES = async () => {
  try {
    const response = await axiosInstance.get(API_ROUTES.GEO.PROVINCES)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const GET_ALL_PROVINCE_CITIES = async (params?: ApiWithParams) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.GEO.GET_PROVINCE_CITIES, {
      params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
    })

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const GET_ALL_COUNTRIES = async () => {
  try {
    const response = await axiosInstance.get(API_ROUTES.GEO.COUNTRIES)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const GET_COUNTRY_BY_ID = async (countryId: string) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.GEO.GET_COUNTRY_BY_ID(countryId))

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}
