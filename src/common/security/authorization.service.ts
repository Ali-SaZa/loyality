import { Injectable, ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';

export interface UserContext {
  userId: string;
  phoneNumber: string;
  role: string;
  storeId?: string;
}

export interface ResourceAccess {
  resourceType: 'scratch-card' | 'store' | 'user' | 'transaction' | 'admin';
  resourceId: string;
  storeId?: string;
  userId?: string;
}

@Injectable()
export class AuthorizationService {
  
  /**
   * Check if user can access a specific resource
   */
  async checkResourceAccess(user: UserContext, resource: ResourceAccess): Promise<void> {
    switch (resource.resourceType) {
      case 'scratch-card':
        await this.checkScratchCardAccess(user, resource);
        break;
      case 'store':
        await this.checkStoreAccess(user, resource);
        break;
      case 'user':
        await this.checkUserAccess(user, resource);
        break;
      case 'transaction':
        await this.checkTransactionAccess(user, resource);
        break;
      case 'admin':
        await this.checkAdminAccess(user, resource);
        break;
      default:
        throw new ForbiddenException('Unknown resource type');
    }
  }

  /**
   * Check scratch card access permissions
   */
  private async checkScratchCardAccess(user: UserContext, resource: ResourceAccess): Promise<void> {
    // Admin can access everything
    if (user.role === 'admin') {
      return;
    }

    // Store owners and customers can access scratch cards
    // The actual validation of ownership/store membership will happen in the service layer
    // after the scratch card is fetched from the database
    if (user.role === 'store' || user.role === 'customer') {
      return;
    }

    throw new ForbiddenException('Access denied. You do not have permission to access this scratch card.');
  }

  /**
   * Check store access permissions
   */
  private async checkStoreAccess(user: UserContext, resource: ResourceAccess): Promise<void> {
    // Admin can access everything
    if (user.role === 'admin') {
      return;
    }

    // Store owners can access their own store
    if (user.role === 'store' && resource.resourceId === user.storeId) {
      return;
    }

    // Customers can view store information (read-only)
    if (user.role === 'customer') {
      return;
    }

    // Store owners can view other stores (read-only)
    if (user.role === 'store') {
      return;
    }

    throw new ForbiddenException('Access denied. You do not have permission to access this store.');
  }

  /**
   * Check user access permissions
   */
  private async checkUserAccess(user: UserContext, resource: ResourceAccess): Promise<void> {
    // Admin can access everything
    if (user.role === 'admin') {
      return;
    }

    // Users can only access their own data
    if (user.role === 'customer' && resource.resourceId === user.userId) {
      return;
    }

    // Store owners can view customer data (this will be validated in the service layer)
    // since we need to check if the customer has transactions with their store
    if (user.role === 'store') {
      return;
    }

    throw new ForbiddenException('Access denied. You do not have permission to access this user data.');
  }

  /**
   * Check transaction access permissions
   */
  private async checkTransactionAccess(user: UserContext, resource: ResourceAccess): Promise<void> {
    // Admin can access everything
    if (user.role === 'admin') {
      return;
    }

    // Users can only access their own transactions
    if (user.role === 'customer' && resource.userId === user.userId) {
      return;
    }

    // Store owners can view transactions (this will be validated in the service layer)
    // since we need to check if the transaction belongs to their store
    if (user.role === 'store') {
      return;
    }

    throw new ForbiddenException('Access denied. You do not have permission to access this transaction.');
  }

  /**
   * Check admin access permissions
   */
  private async checkAdminAccess(user: UserContext, resource: ResourceAccess): Promise<void> {
    // Only admin can access admin resources
    if (user.role === 'admin') {
      return;
    }

    throw new ForbiddenException('Access denied. You do not have permission to access this admin resource.');
  }

  /**
   * Check if user has admin role
   */
  isAdmin(user: UserContext): boolean {
    return user.role === 'admin';
  }

  /**
   * Check if user has store role
   */
  isStoreOwner(user: UserContext): boolean {
    return user.role === 'store';
  }

  /**
   * Check if user has customer role
   */
  isCustomer(user: UserContext): boolean {
    return user.role === 'customer';
  }

  /**
   * Check if user owns a specific store
   */
  ownsStore(user: UserContext, storeId: string): boolean {
    return user.role === 'store' && user.storeId === storeId;
  }

  /**
   * Check if user owns a specific resource
   */
  ownsResource(user: UserContext, resourceUserId: string): boolean {
    return user.role === 'customer' && user.userId === resourceUserId;
  }

  /**
   * Get user's accessible store IDs
   */
  getAccessibleStoreIds(user: UserContext): string[] {
    if (user.role === 'admin') {
      return []; // Admin can access all stores
    }
    
    if (user.role === 'store' && user.storeId) {
      return [user.storeId];
    }
    
    return [];
  }

  /**
   * Get user's accessible user IDs
   */
  getAccessibleUserIds(user: UserContext): string[] {
    if (user.role === 'admin') {
      return []; // Admin can access all users
    }
    
    if (user.role === 'customer') {
      return [user.userId];
    }
    
    if (user.role === 'store') {
      return []; // Store owners can only see users who have transactions with their store
    }
    
    return [];
  }
}
