import { SetMetadata } from '@nestjs/common';
import { ResourceAuthMetadata } from './resource-auth.guard';

export const RESOURCE_AUTH_KEY = 'resourceAuth';

/**
 * Decorator to protect a resource endpoint
 * @param resourceType - Type of resource being accessed
 * @param options - Authorization options
 */
export const ResourceAuth = (
  resourceType: ResourceAuthMetadata['resourceType'],
  options: Omit<ResourceAuthMetadata, 'resourceType'> = {}
) => SetMetadata(RESOURCE_AUTH_KEY, { resourceType, ...options });

/**
 * Decorator for scratch card endpoints
 */
export const ScratchCardAuth = (options?: Omit<ResourceAuthMetadata, 'resourceType'>) =>
  ResourceAuth('scratch-card', options);

/**
 * Decorator for store endpoints
 */
export const StoreAuth = (options?: Omit<ResourceAuthMetadata, 'resourceType'>) =>
  ResourceAuth('store', options);

/**
 * Decorator for user endpoints
 */
export const UserAuth = (options?: Omit<ResourceAuthMetadata, 'resourceType'>) =>
  ResourceAuth('user', options);

/**
 * Decorator for transaction endpoints
 */
export const TransactionAuth = (options?: Omit<ResourceAuthMetadata, 'resourceType'>) =>
  ResourceAuth('transaction', options);

/**
 * Decorator for admin endpoints
 */
export const AdminAuth = () => ResourceAuth('admin');

/**
 * Decorator for self-access only (user can only access their own data)
 */
export const SelfOnly = () => ({ allowSelf: true });

/**
 * Decorator for store owner access
 */
export const StoreOwnerOnly = () => ({ allowStoreOwner: true });
