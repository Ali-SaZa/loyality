import axiosInstance, { handleApiError } from '@/config/axios'

// Types for promotions
export interface Promotion {
  id: string
  storeId: string
  title: string
  description?: string
  price: number
  points: number
  status: 'active' | 'inactive' | 'deleted' | 'expired'
  createdAt: string
  updatedAt: string
  promoCodeCount?: number
}

export interface PromotionWithCodeCount extends Promotion {
  promoCodeCount: number
}

export interface CreatePromotionRequest {
  storeId: string
  title: string
  description?: string
  price: number
  points: number
}

export interface UpdatePromotionRequest {
  title?: string
  description?: string
  price?: number
  points?: number
  status?: 'active' | 'inactive' | 'deleted' | 'expired'
}

export interface ChangePromotionStatusRequest {
  status: 'active' | 'inactive' | 'deleted' | 'expired'
}

export interface PromotionListResponse {
  data: PromotionWithCodeCount[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PromotionStats {
  total: number
  active: number
  inactive: number
  expired: number
  deleted: number
}

// Promotions service functions
export const promotionsService = {
  // Get all promotions with pagination and filtering
  async getAllPromotions(params?: {
    page?: number
    limit?: number
    search?: string
    searchFields?: string[]
    sort?: string
    filters?: Record<string, any>
    storeId?: string
  }): Promise<PromotionListResponse> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.searchFields) queryParams.append('searchFields', params.searchFields.join(','))
      if (params?.sort) queryParams.append('sort', params.sort)
      if (params?.storeId) queryParams.append('storeId', params.storeId)
      if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          queryParams.append(`filters[${key}]`, value.toString())
        })
      }

      const response = await axiosInstance.get<PromotionListResponse>(`/promotions?${queryParams.toString()}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get promotion by ID
  async getPromotionById(id: string): Promise<Promotion> {
    try {
      const response = await axiosInstance.get<Promotion>(`/promotions/${id}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get promotion by ID with code count
  async getPromotionByIdWithCodeCount(id: string): Promise<PromotionWithCodeCount> {
    try {
      const response = await axiosInstance.get<PromotionWithCodeCount>(`/promotions/${id}/with-codes`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Create new promotion
  async createPromotion(data: CreatePromotionRequest): Promise<Promotion> {
    try {
      const response = await axiosInstance.post<Promotion>('/promotions', data)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Update promotion
  async updatePromotion(id: string, data: UpdatePromotionRequest): Promise<Promotion> {
    try {
      const response = await axiosInstance.patch<Promotion>(`/promotions/${id}`, data)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Change promotion status
  async changePromotionStatus(id: string, data: ChangePromotionStatusRequest): Promise<Promotion> {
    try {
      const response = await axiosInstance.patch<Promotion>(`/promotions/${id}/status`, data)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Delete promotion
  async deletePromotion(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/promotions/${id}`)
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get promotion statistics
  async getPromotionStats(storeId?: string): Promise<PromotionStats> {
    try {
      const queryParams = new URLSearchParams()
      if (storeId) queryParams.append('storeId', storeId)
      
      const response = await axiosInstance.get<PromotionStats>(`/promotions/stats?${queryParams.toString()}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get promotions by store ID
  async getPromotionsByStore(storeId: string, params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<PromotionListResponse> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.status) queryParams.append('status', params.status)

      const response = await axiosInstance.get<PromotionListResponse>(`/promotions/store/${storeId}?${queryParams.toString()}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  }
}

// Export individual functions for convenience
export const getAllPromotions = promotionsService.getAllPromotions
export const getPromotionById = promotionsService.getPromotionById
export const getPromotionByIdWithCodeCount = promotionsService.getPromotionByIdWithCodeCount
export const createPromotion = promotionsService.createPromotion
export const updatePromotion = promotionsService.updatePromotion
export const changePromotionStatus = promotionsService.changePromotionStatus
export const deletePromotion = promotionsService.deletePromotion
export const getPromotionStats = promotionsService.getPromotionStats
export const getPromotionsByStore = promotionsService.getPromotionsByStore
