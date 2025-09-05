import axiosInstance, { handleApiError } from '@/config/axios'

// Types for stores - based on backend schema
export interface StoreAddress {
  province: string
  city: string
  fullAddress: string
}

export interface SocialLinks {
  website?: string
  instagram?: string
  telegram?: string
}

export interface WorkingHours {
  open: string
  close: string
}

export interface Store {
  id: string
  name: string
  phoneNumber: string
  userId: string
  address: StoreAddress
  promotions: string[] // Array of promotion IDs
  planExpiryDate?: Date
  status: 'active' | 'pending' | 'deleted' | 'suspended'
  logoUrl?: string
  description?: string
  socialLinks?: SocialLinks
  workingHours?: WorkingHours
  createdAt: Date
  updatedAt: Date
}

export interface CreateStoreRequest {
  name: string
  phoneNumber: string
  userId: string
  address: StoreAddress
  promotions?: string[]
  planExpiryDate?: string
  status?: 'active' | 'pending' | 'deleted' | 'suspended'
  logoUrl?: string
  description?: string
  socialLinks?: SocialLinks
  workingHours?: WorkingHours
}

export interface UpdateStoreRequest {
  name?: string
  phoneNumber?: string
  userId?: string
  address?: StoreAddress
  promotions?: string[]
  planExpiryDate?: string
  status?: 'active' | 'pending' | 'deleted' | 'suspended'
  logoUrl?: string
  description?: string
  socialLinks?: SocialLinks
  workingHours?: WorkingHours
}

// New interfaces for store with user
export interface CreateStoreUserRequest {
  firstName: string
  lastName: string
  password: string
  confirmPassword: string
}

export interface CreateStoreWithUserRequest {
  user: CreateStoreUserRequest
  store: Omit<CreateStoreRequest, 'userId'>
}

export interface StoreWithUserResponse {
  user: {
    id: string
    phoneNumber: string
    firstName: string
    lastName: string
    role: string
    createdAt: string
    updatedAt: string
  }
  store: Store
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
    sort?: any
    filters?: any
  }
}

export interface StoreStats {
  total: number
  active: number
  pending: number
  deleted: number
  suspended: number
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
      
      // Handle sort parameter - convert string format to array format expected by backend
      if (params?.sort) {
        const [field, direction] = params.sort.split(':')
        const sortArray = [{ field, direction }]
        queryParams.append('sort', JSON.stringify(sortArray))
      }
      
      // Convert filters to the format expected by backend
      if (params?.filters) {
        const filterArray = Object.entries(params.filters).map(([key, value]) => ({
          field: key,
          operator: 'eq',
          value: value
        }))
        queryParams.append('filters', JSON.stringify(filterArray))
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

  // Delete store (logical deletion - set status to deleted)
  async deleteStore(id: string): Promise<void> {
    try {
      await storesService.updateStore(id, { status: 'deleted' })
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Update store status
  async updateStoreStatus(id: string, status: 'active' | 'pending' | 'deleted' | 'suspended'): Promise<Store> {
    try {
      const response = await axiosInstance.patch<Store>(`/stores/${id}/status`, { status })
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get current user's store (for store users)
  async getCurrentStore(): Promise<Store> {
    try {
      const response = await axiosInstance.get<Store>('/stores/me')
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get store filter options
  async getStoreFilterOptions(): Promise<{
    statuses: string[]
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
export const updateStoreStatus = storesService.updateStoreStatus
export const getStoreStats = storesService.getStoreStats
export const getCurrentStore = storesService.getCurrentStore
export const getStoreFilterOptions = storesService.getStoreFilterOptions
