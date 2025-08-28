import axiosInstance, { handleApiError } from '@/config/axios'

// Types for users
export interface User {
  id: string
  phoneNumber: string
  firstname?: string
  lastname?: string
  totalPoints: number
  role: string
  status?: 'active' | 'blocked' | 'deleted'
  lastActivity: string
  createdAt: string
  updatedAt: string
  purchases: Purchase[]
  storeName?: string
  address?: string
  description?: string
}

export interface Purchase {
  storeId: string
  amount: number
  date: string
  scratchCode?: string
  entryMethod: 'sms' | 'qr'
  rewardApplied: {
    type: 'discount' | 'cashback' | 'lottery'
    value: number
  }
}



export interface CreateUserRequest {
  phoneNumber: string
  firstname?: string
  lastname?: string
  storeName?: string
  address?: string
  description?: string
}

export interface UpdateUserRequest {
  firstname?: string
  lastname?: string
  storeName?: string
  address?: string
  description?: string
}

export interface UsersResponse {
  users: User[]
  total: number
  page: number
  limit: number
}

// Users service functions
export const usersService = {
  // Get all users (Admin only)
  async getAllUsers(page: number = 1, limit: number = 10, search?: string): Promise<UsersResponse> {
    try {
      const params = new URLSearchParams()
      if (page) params.append('page', page.toString())
      if (limit) params.append('limit', limit.toString())
      if (search) params.append('search', search)

      const response = await axiosInstance.get<User[]>(`/users?${params.toString()}`)
      
      // Transform the backend response to match our interface
      const users = response.data.map(user => ({
        id: user.id,
        phoneNumber: user.phoneNumber,
        firstname: user.firstname,
        lastname: user.lastname,
        totalPoints: user.totalPoints || 0,
        role: user.role,
        status: user.status || 'active',
        lastActivity: user.lastActivity,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        purchases: user.purchases || [],
        storeName: user.storeName,
        address: user.address,
        description: user.description
      }))
      
      return {
        users,
        total: users.length,
        page: page,
        limit: limit
      }
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Update user status (Admin only)
  async updateUserStatus(id: string, status: 'active' | 'blocked' | 'deleted'): Promise<User> {
    try {
      const response = await axiosInstance.patch<User>(`/users/${id}/status`, { status })
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await axiosInstance.get<User>(`/users/${id}`)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Create new user
  async createUser(data: CreateUserRequest): Promise<User> {
    try {
      const response = await axiosInstance.post<User>('/users', data)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Update user
  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    try {
      const response = await axiosInstance.patch<User>(`/users/${id}`, data)
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Delete user (logical deletion - set status to deleted)
  async deleteUser(id: string): Promise<void> {
    try {
      await usersService.updateUserStatus(id, 'deleted')
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  },

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      const response = await axiosInstance.get<User>('/users/me')
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  }
}

// Export individual functions for convenience
export const getAllUsers = usersService.getAllUsers
export const getUserById = usersService.getUserById
export const createUser = usersService.createUser
export const updateUser = usersService.updateUser
export const deleteUser = usersService.deleteUser
export const getCurrentUser = usersService.getCurrentUser
