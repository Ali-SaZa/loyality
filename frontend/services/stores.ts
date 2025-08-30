import axiosInstance, { handleApiError } from '@/config/axios'

// Types for stores
export interface Store {
  id: string
  name: string
  ownerName: string
  phoneNumber: string
  userId: string
  address: {
    city: string
    street?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  loyaltySettings: {
    tiers: Array<{
      minAmount: number
      rewardType: 'discount' | 'cashback' | 'lottery'
      value: number
      description?: string
    }>
    lotteryFrequency: 'weekly' | 'monthly' | 'none'
    defaultCashbackRate: number
  }
  plan: {
    type: 'free' | 'premium'
    startDate: string
    endDate: string
  }
  role: string
  createdAt: string
  updatedAt: string
}

export interface CreateStoreRequest {
  name: string
  ownerName: string
  phoneNumber: string
  userId: string
  address: {
    city: string
    street?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  loyaltySettings: {
    tiers: Array<{
      minAmount: number
      rewardType: 'discount' | 'cashback' | 'lottery'
      value: number
      description?: string
    }>
    lotteryFrequency: 'weekly' | 'monthly' | 'none'
    defaultCashbackRate: number
  }
  plan: {
    type: 'free' | 'premium'
    startDate: string
    endDate: string
  }
}

export interface UpdateStoreRequest {
  name?: string
  ownerName?: string
  phoneNumber?: string
  address?: {
    city: string
    street?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  loyaltySettings?: {
    tiers: Array<{
      minAmount: number
      rewardType: 'discount' | 'cashback' | 'lottery'
      value: number
      description?: string
    }>
    lotteryFrequency: 'weekly' | 'monthly' | 'none'
    defaultCashbackRate: number
  }
  plan?: {
    type: 'free' | 'premium'
    startDate: string
    endDate: string
  }
}

export interface StoreListResponse {
  data: Store[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  appliedFilters: {
    search?: string
    searchFields?: string[]
    sort?: string
    filters?: Record<string, any>
  }
}

export interface StoreStats {
  total: number
  active: number
  pending: number
  inactive: number
}

// Stores service functions
export const storesService = {
  // Get all stores with pagination and filtering
  async getAllStores(params?: {
    page?: number
    limit?: number
    search?: string
    searchFields?: string[]
    sort?: string
    filters?: Record<string, any>
  }): Promise<StoreListResponse> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.searchFields) queryParams.append('searchFields', params.searchFields.join(','))
      if (params?.sort) queryParams.append('sort', params.sort)
      if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          queryParams.append(`filters[${key}]`, value.toString())
        })
      }

      const response = await axiosInstance.get<StoreListResponse>(`/stores?${queryParams.toString()}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get store by ID
  async getStoreById(id: string): Promise<Store> {
    try {
      const response = await axiosInstance.get<Store>(`/stores/${id}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Create new store
  async createStore(data: CreateStoreRequest): Promise<Store> {
    try {
      const response = await axiosInstance.post<Store>('/stores', data)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Update store
  async updateStore(id: string, data: UpdateStoreRequest): Promise<Store> {
    try {
      const response = await axiosInstance.patch<Store>(`/stores/${id}`, data)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Delete store
  async deleteStore(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/stores/${id}`)
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get store statistics
  async getStoreStats(): Promise<StoreStats> {
    try {
      const response = await axiosInstance.get<StoreStats>('/stores/stats')
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get store filter options
  async getStoreFilterOptions(): Promise<{
    plans: string[]
    roles: string[]
  }> {
    try {
      const response = await axiosInstance.get('/stores/filter-options')
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  }
}

// Export individual functions for convenience
export const getAllStores = storesService.getAllStores
export const getStoreById = storesService.getStoreById
export const createStore = storesService.createStore
export const updateStore = storesService.updateStore
export const deleteStore = storesService.deleteStore
export const getStoreStats = storesService.getStoreStats
export const getStoreFilterOptions = storesService.getStoreFilterOptions
