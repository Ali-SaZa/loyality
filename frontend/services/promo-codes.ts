import axiosInstance, { handleApiError } from '@/config/axios'

// Types for promo codes
export interface PromoCode {
  id: string
  code: string
  promotionId: string
  status: 'unused' | 'used' | 'deleted'
  userId?: string
  registeredAt?: string
  usedAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
  // Populated fields
  promotion?: {
    id: string
    title: string
    price: number
    points: number
    status: string
  }
  user?: {
    id: string
    phoneNumber: string
    firstName?: string
    lastName?: string
  }
}

export interface CreatePromoCodeRequest {
  code: string
  promotionId: string
  expiresAt?: string
  notes?: string
}

export interface BulkCreatePromoCodesRequest {
  promotionId: string
  count?: number
  prefix?: string
  expiresAt?: string
  notes?: string
}

export interface UpdatePromoCodeRequest {
  notes?: string
  expiresAt?: string
}

export interface ChangePromoCodeStatusRequest {
  status: 'unused' | 'used' | 'deleted'
  userId?: string
}

export interface ValidatePromoCodeRequest {
  code: string
  storeId: string
}

export interface PromoCodeValidationResponse {
  isValid: boolean
  promoCode?: PromoCode
  promotion?: {
    id: string
    title: string
    description?: string
    price: number
    points: number
    status: string
  }
  message?: string
  errorCode?: 'CODE_NOT_FOUND' | 'CODE_ALREADY_USED' | 'CODE_NOT_REGISTERED' | 'CODE_DELETED' | 'PROMOTION_NOT_FOUND' | 'PROMOTION_INACTIVE' | 'PROMOTION_EXPIRED' | 'PROMOTION_DELETED' | 'INVALID_STORE' | 'FORBIDDEN_STORE'
}

export interface RegisterPromoCodeRequest {
  code: string
  phoneNumber: string
}

export interface GetUserPromoCodesRequest {
  phoneNumber: string
  storeId?: string
}

export interface PromoCodeListResponse {
  data: PromoCode[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PromoCodeStats {
  total: number
  unused: number
  used: number
  registered: number
  deleted: number
}

// Promo codes service functions
export const promoCodesService = {
  // Get all promo codes with pagination and filtering
  async getAllPromoCodes(params?: {
    page?: number
    limit?: number
    search?: string
    searchFields?: string[]
    sort?: string
    filters?: Record<string, any>
    promotionId?: string
  }): Promise<PromoCodeListResponse> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.searchFields) queryParams.append('searchFields', params.searchFields.join(','))
      if (params?.sort) queryParams.append('sort', params.sort)
      if (params?.promotionId) queryParams.append('promotionId', params.promotionId)
      if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          queryParams.append(`filters[${key}]`, value.toString())
        })
      }

      const response = await axiosInstance.get<PromoCodeListResponse>(`/promo-codes?${queryParams.toString()}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get promo code by ID
  async getPromoCodeById(id: string): Promise<PromoCode> {
    try {
      const response = await axiosInstance.get<PromoCode>(`/promo-codes/${id}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Create new promo code
  async createPromoCode(data: CreatePromoCodeRequest): Promise<PromoCode> {
    try {
      const response = await axiosInstance.post<PromoCode>('/promo-codes', data)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Bulk create promo codes
  async bulkCreatePromoCodes(data: BulkCreatePromoCodesRequest): Promise<PromoCode[]> {
    try {
      const response = await axiosInstance.post<PromoCode[]>('/promo-codes/bulk', data)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Update promo code
  async updatePromoCode(id: string, data: UpdatePromoCodeRequest): Promise<PromoCode> {
    try {
      const response = await axiosInstance.patch<PromoCode>(`/promo-codes/${id}`, data)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Change promo code status
  async changePromoCodeStatus(id: string, data: ChangePromoCodeStatusRequest): Promise<PromoCode> {
    try {
      const response = await axiosInstance.patch<PromoCode>(`/promo-codes/${id}/status`, data)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Delete promo code
  async deletePromoCode(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/promo-codes/${id}`)
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Validate promo code
  async validatePromoCode(data: ValidatePromoCodeRequest): Promise<PromoCodeValidationResponse> {
    try {
      const response = await axiosInstance.post<PromoCodeValidationResponse>('/promo-codes/validate', data)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Register promo code to user
  async registerPromoCode(data: RegisterPromoCodeRequest): Promise<PromoCode> {
    try {
      const response = await axiosInstance.post<PromoCode>('/promo-codes/register', data)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get user promo codes
  async getUserPromoCodes(data: GetUserPromoCodesRequest): Promise<PromoCode[]> {
    try {
      const queryParams = new URLSearchParams()
      if (data.storeId) queryParams.append('storeId', data.storeId)

      const response = await axiosInstance.get<PromoCode[]>(`/promo-codes/user/${data.phoneNumber}?${queryParams.toString()}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get promo code statistics
  async getPromoCodeStats(promotionId?: string): Promise<PromoCodeStats> {
    try {
      const queryParams = new URLSearchParams()
      if (promotionId) queryParams.append('promotionId', promotionId)
      
      const response = await axiosInstance.get<PromoCodeStats>(`/promo-codes/stats?${queryParams.toString()}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get promo codes by promotion ID
  async getPromoCodesByPromotion(promotionId: string, params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<PromoCodeListResponse> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.status) queryParams.append('status', params.status)

      const response = await axiosInstance.get<PromoCodeListResponse>(`/promo-codes/promotion/${promotionId}?${queryParams.toString()}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  }
}

// Export individual functions for convenience
export const getAllPromoCodes = promoCodesService.getAllPromoCodes
export const getPromoCodeById = promoCodesService.getPromoCodeById
export const createPromoCode = promoCodesService.createPromoCode
export const bulkCreatePromoCodes = promoCodesService.bulkCreatePromoCodes
export const updatePromoCode = promoCodesService.updatePromoCode
export const changePromoCodeStatus = promoCodesService.changePromoCodeStatus
export const deletePromoCode = promoCodesService.deletePromoCode
export const validatePromoCode = promoCodesService.validatePromoCode
export const registerPromoCode = promoCodesService.registerPromoCode
export const getUserPromoCodes = promoCodesService.getUserPromoCodes
export const getPromoCodeStats = promoCodesService.getPromoCodeStats
export const getPromoCodesByPromotion = promoCodesService.getPromoCodesByPromotion
