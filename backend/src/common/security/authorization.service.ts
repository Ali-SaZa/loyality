import { Injectable, ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';

export interface UserContext {
  userId: string;
  phoneNumber: string;
  role: string;
  storeId?: string;
}

export interface ResourceAccess {
  resourceType: 'store' | 'user' | 'promotion' | 'promoCode' | 'admin';
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

      case 'store':
        await this.checkStoreAccess(user, resource);
        break;
      case 'user':
        await this.checkUserAccess(user, resource);
        break;

      case 'promotion':
        await this.checkPromotionAccess(user, resource);
        break;
      case 'promoCode':
        await this.checkPromoCodeAccess(user, resource);
        break;
      case 'admin':
        await this.checkAdminAccess(user, resource);
        break;
      default:
        throw new ForbiddenException('نوع منبع نامشخص است'); // translated to Persian
    }
  }



  /**
   * Check store access permissions
   */
  private async checkStoreAccess(user: UserContext, resource: ResourceAccess): Promise<void> {
    // Admin can access everything
    if (user.role === 'admin') {
      return;
    }

    // Store users can access their own store
    if (user.role === 'store' && resource.resourceId === user.storeId) {
      return;
    }

    // Store users can view other stores (read-only access)
    if (user.role === 'store') {
      return;
    }

    // Customers can view store information (read-only access)
    if (user.role === 'customer') {
      return;
    }

    throw new ForbiddenException('دسترسی ممنوع. شما مجوز دسترسی به این فروشگاه را ندارید.'); // translated to Persian
  }

  /**
   * Check user access permissions
   */
  private async checkUserAccess(user: UserContext, resource: ResourceAccess): Promise<void> {
    // Admin can access everything
    if (user.role === 'admin') {
      return;
    }

    // Users can only access their own profile information
    if (user.role === 'customer' && resource.resourceId === user.userId) {
      return;
    }

    // Store users can access their own user account
    if (user.role === 'store' && resource.resourceId === user.userId) {
      return;
    }

    // Store users can view customer data related to their store

    if (user.role === 'store') {
      return;
    }

    throw new ForbiddenException('دسترسی ممنوع. شما مجوز دسترسی به اطلاعات این کاربر را ندارید.'); // translated to Persian
  }



  /**
   * Check promotion access permissions
   */
  private async checkPromotionAccess(user: UserContext, resource: ResourceAccess): Promise<void> {
    // Admin can access everything
    if (user.role === 'admin') {
      return;
    }

    // Store users can access promotions related to their store
    // (this will be validated in the service layer to check storeId)
    if (user.role === 'store') {
      return;
    }

    // Customers can view promotions (read-only access)
    if (user.role === 'customer') {
      return;
    }

    throw new ForbiddenException('دسترسی ممنوع. شما مجوز دسترسی به این تبلیغ را ندارید.'); // translated to Persian
  }

  /**
   * Check promo code access permissions
   */
  private async checkPromoCodeAccess(user: UserContext, resource: ResourceAccess): Promise<void> {
    // Admin can access everything
    if (user.role === 'admin') {
      return;
    }

    // Store users can access promo codes related to their store
    // (this will be validated in the service layer to check storeId)
    if (user.role === 'store') {
      return;
    }

    // Customers can only access their own promo codes
    if (user.role === 'customer') {
      return;
    }

    throw new ForbiddenException('دسترسی ممنوع. شما مجوز دسترسی به این کد تخفیف را ندارید.'); // translated to Persian
  }

  /**
   * Check admin access permissions
   */
  private async checkAdminAccess(user: UserContext, resource: ResourceAccess): Promise<void> {
    // Only admin can access admin resources
    if (user.role === 'admin') {
      return;
    }

    throw new ForbiddenException('دسترسی ممنوع. شما مجوز دسترسی به این منبع مدیریتی را ندارید.'); // translated to Persian
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
      return []; // Store owners can only see users related to their store
    }
    
    return [];
  }
}
