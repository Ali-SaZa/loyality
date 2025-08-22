import qs from 'qs'

import { API_ROUTES, HANDLE_ERROR } from './config'

import axiosInstance from '@/config/axios'
import { ApiWithParams } from '@/types'

export const REGISTER_USER_IN_SIMULATION = async (data: { jobSimulationId: string }) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.SIMULATION_USER.REGISTER, data)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const INSERT_TASK_BY_USER_ID = async (jobSimulationId: string, data: { taskId: string; userFileId: string }) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.SIMULATION_USER.INSERT_TASK(jobSimulationId), data)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const GET_USER_SIMULATIONS = async (params?: ApiWithParams) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.SIMULATION_USER.GET_USER_SIMULATIONS, {
      params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
    })

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const GET_USER_SIMULATION_BY_ID = async (jobSimulationId: string) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.SIMULATION_USER.GET_USER_SIMULATION_BY_ID(jobSimulationId))

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const SAVE_USER_COMMENT = async (jobSimulationId: string, data: { comment: string }) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.SIMULATION_USER.SAVE_USER_COMMENT(jobSimulationId), data)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const SEND_CHAT_MESSAGE_WITH_EVALUATOR = async (jobSimulationId: string, data: { message: string }) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.SIMULATION_USER.CHAT_WITH_EVALUATOR(jobSimulationId), data)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const SAVE_USER_REVIEW_FOR_SIMULATION = async (data: {
  jobSimulationUserId: string
  rate: number
  reviews: { reviewQuestionId: string; level: number }[]
}) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.SIMULATION_USER.SAVE_USER_REVIEW_FOR_SIMULATION, data)

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const GET_SIMULATION_COMMENTS = async (jobSimulationId: string) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.SIMULATION_USER.GET_SIMULATION_COMMENTS(jobSimulationId))

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const COMPLETE_QUIZ = async (jobSimulationId: string) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.SIMULATION_USER.COMPLETE_QUIZ(jobSimulationId))

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const GET_EVALUATION_DETAIL_FOR_PAYMENT = async (jobSimulationId: string) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.SIMULATION_USER.GET_EVALUATION_COST(jobSimulationId))

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const START_EVALUATION_BANK_PAYMENT = async (jobSimulationId: string) => {
  try {
    const response = await axiosInstance.post(API_ROUTES.SIMULATION_USER.START_EVALUATION_BANK_PAYMENT(jobSimulationId))

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}
