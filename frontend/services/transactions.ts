import axiosInstance, { handleApiError } from '@/config/axios'

export interface Transaction {
  id: string
  customerId: string
  storeId: string
  promoCodeId: string
  promotionId: string
  createdAt: Date
  updatedAt: Date
  customer?: {
    id: string
    phoneNumber: string
    firstName?: string
    lastName?: string
  }
  store?: {
    id: string
    name: string
    phoneNumber: string
  }
  promoCode?: {
    id: string
    code: string
    status: string
  }
  promotion?: {
    id: string
    title: string
    price: number
    points: number
  }
}

export interface CustomerTransaction {
  id: string
  phoneNumber: string
  firstName?: string
  lastName?: string
  status: string
  totalTransactions: number
  totalSpent: number
  totalPointsEarned: number
  firstTransactionDate: Date
  lastTransactionDate: Date
  lastActivity: Date
}

export interface CreateTransactionRequest {
  customerId: string
  storeId: string
  promoCodeId: string
  promotionId: string
}

export interface TransactionListResponse {
  data: Transaction[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  appliedFilters: {
    search?: string
    searchFields?: string[]
    sort?: any[]
    filters?: any
  }
}

// Transactions service functions
export const transactionsService = {
  // Create a new transaction
  async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    try {
      const response = await axiosInstance.post<Transaction>('/transactions', data)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get all transactions with pagination and filtering
  async getAllTransactions(params?: {
    page?: number
    limit?: number
    search?: string
    searchFields?: string[]
    sort?: string
    filters?: Record<string, any>
  }): Promise<TransactionListResponse> {
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

      const response = await axiosInstance.get<TransactionListResponse>(`/transactions?${queryParams.toString()}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get transaction by ID
  async getTransactionById(id: string): Promise<Transaction> {
    try {
      const response = await axiosInstance.get<Transaction>(`/transactions/${id}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get customers for a specific store
  async getStoreCustomers(storeId: string): Promise<CustomerTransaction[]> {
    try {
      const response = await axiosInstance.get<CustomerTransaction[]>(`/transactions/store/${storeId}/customers`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get customers for the current user's store (no storeId required)
  async getMyStoreCustomers(): Promise<CustomerTransaction[]> {
    try {
      const response = await axiosInstance.get<CustomerTransaction[]>('/transactions/my-store/customers')
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get transactions for a specific customer
  async getCustomerTransactions(customerId: string): Promise<Transaction[]> {
    try {
      const response = await axiosInstance.get<Transaction[]>(`/transactions/customer/${customerId}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Delete transaction (Admin only)
  async deleteTransaction(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/transactions/${id}`)
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  }
}
