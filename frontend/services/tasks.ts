import { API_ROUTES, HANDLE_ERROR } from './config'

import axiosInstance from '@/config/axios'

export const GET_ALL_TASKS_BY_SIMULATION_ID_FOR_VISITORS = async (simulationId: string) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.TASKS.GET_ALL_TASKS_BY_SIMULATION_ID_FOR_VISITORS(simulationId))

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}

export const GET_ALL_TASKS_BY_SIMULATION_ID_FOR_LEARNERS = async (simulationId: string) => {
  try {
    const response = await axiosInstance.get(API_ROUTES.TASKS.GET_ALL_TASKS_BY_SIMULATION_ID_FOR_LEARNERS(simulationId))

    return response
  } catch (error) {
    HANDLE_ERROR(error)
    throw error
  }
}
