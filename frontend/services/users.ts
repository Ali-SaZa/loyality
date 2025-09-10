import axiosInstance, { handleApiError } from "@/config/axios";

// Types for users
export interface User {
  id: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status?: "active" | "blocked" | "deleted";
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  appliedFilters: {
    search?: string;
    searchFields?: string[];
    sort?: any;
    filters?: any;
  };
}

export interface UserStats {
  total: number;
  active: number;
  blocked: number;
  deleted: number;
}

// Backend list response shape
interface UsersListApiResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  appliedFilters: {
    search?: string;
    searchFields?: string[];
    sort?: any;
    filters?: any;
  };
}

// Users service functions
export const usersService = {
  // Get all users with pagination and filtering
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    searchFields?: string[];
    sort?: string;
    filters?: Record<string, any>;
  }): Promise<UserListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.searchFields)
        queryParams.append("searchFields", params.searchFields.join(","));
      if (params?.sort) queryParams.append("sort", params.sort);
      if (params?.filters) {
        // Convert filters to the format expected by backend
        const filterArray = Object.entries(params.filters).map(
          ([key, value]) => ({
            field: key,
            operator: "eq",
            value: value,
          }),
        );
        queryParams.append("filters", JSON.stringify(filterArray));
      }

      const response = await axiosInstance.get<UserListResponse>(
        `/users?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Update user status (Admin only)
  async updateUserStatus(
    id: string,
    status: "active" | "blocked" | "deleted",
  ): Promise<User> {
    try {
      const response = await axiosInstance.patch<User>(`/users/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await axiosInstance.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Create new user
  async createUser(data: CreateUserRequest): Promise<User> {
    try {
      const response = await axiosInstance.post<User>("/users", data);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Update user
  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    try {
      const response = await axiosInstance.patch<User>(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Delete user (logical deletion - set status to deleted)
  async deleteUser(id: string): Promise<void> {
    try {
      await usersService.updateUserStatus(id, "deleted");
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      const response = await axiosInstance.get<User>("/users/me");
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await axiosInstance.get<UserStats>("/users/stats");
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Get user filter options
  async getUserFilterOptions(): Promise<{
    statuses: string[];
    roles: string[];
  }> {
    try {
      const response = await axiosInstance.get("/users/filter-options");
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },
};

// Export individual functions for convenience
export const getAllUsers = usersService.getAllUsers;
export const getUserById = usersService.getUserById;
export const createUser = usersService.createUser;
export const updateUser = usersService.updateUser;
export const deleteUser = usersService.deleteUser;
export const getCurrentUser = usersService.getCurrentUser;
export const getUserStats = usersService.getUserStats;
export const getUserFilterOptions = usersService.getUserFilterOptions;
