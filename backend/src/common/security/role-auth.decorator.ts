import { SetMetadata } from '@nestjs/common';

export interface RoleAuthMetadata {
  allowedRoles: string[];
}

export const ROLE_AUTH_KEY = 'roleAuth';

/**
 * Decorator to protect endpoints based on user roles
 * @param allowedRoles - Array of roles that can access this endpoint
 */
export const RoleAuth = (allowedRoles: string[]) => 
  SetMetadata(ROLE_AUTH_KEY, { allowedRoles });

/**
 * Decorator for endpoints that allow both store and admin access
 */
export const StoreOrAdminAuth = () => RoleAuth(['store', 'admin']);

/**
 * Decorator for endpoints that allow store, admin, and customer access
 */
export const StoreAdminOrCustomerAuth = () => RoleAuth(['store', 'admin', 'customer']);
