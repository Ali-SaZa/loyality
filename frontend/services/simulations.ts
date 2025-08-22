import qs from 'qs'

import { API_ROUTES, HANDLE_ERROR } from './config'

import axiosInstance from '@/config/axios'

export const GET_ALL_SIMULATIONS = async (params?: ApiWithParams) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.SIMULATIONS.GET_ALL, {
      params: {
        ...params,
      },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
    })

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const GET_SIMULATION_BY_ID = async (simulationId: string) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.SIMULATIONS.GET_BY_ID(simulationId))

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const GET_ALL_REVIEW_QUESTIONS = async () => {
  try {
    const response = await axiosInstance.get(API_ROUTES.SIMULATIONS.GET_ALL_REVIEW_QUESTIONS)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const GET_SIMULATION_QUIZ = async (simulationId: string) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.SIMULATIONS.GET_SIMULATION_QUIZ(simulationId))

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}
