import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationService, UserContext, ResourceAccess } from './authorization.service';

export interface ResourceAuthMetadata {
  resourceType: 'store' | 'user' | 'promotion' | 'admin';
  paramName?: string; // URL parameter name for resource ID
  storeIdParam?: string; // URL parameter name for store ID
  userIdParam?: string; // URL parameter name for user ID
  allowSelf?: boolean; // Allow users to access their own resources
  allowStoreOwner?: boolean; // Allow store owners to access their store's resources
}

@Injectable()
export class ResourceAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const resourceAuth = this.reflector.get<ResourceAuthMetadata>('resourceAuth', context.getHandler());
    
    if (!resourceAuth) {
      // No resource auth required, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserContext;

    if (!user) {
      throw new ForbiddenException('متن کاربر یافت نشد'); // translated to Persian
    }

    // For admin resources, we don't need a resource ID
    if (resourceAuth.resourceType === 'admin') {
      const resource: ResourceAccess = {
        resourceType: resourceAuth.resourceType,
        resourceId: 'admin', // Use a placeholder for admin resources
        storeId: undefined,
        userId: undefined,
      };
      
      await this.authorizationService.checkResourceAccess(user, resource);
      return true;
    }

    // Extract resource information from request for other resource types
    const resourceId = request.params[resourceAuth.paramName || 'id'];
    const storeId = resourceAuth.storeIdParam ? request.params[resourceAuth.storeIdParam] : undefined;
    const userId = resourceAuth.userIdParam ? request.params[resourceAuth.userIdParam] : undefined;

    if (!resourceId) {
      throw new ForbiddenException('شناسه منبع در درخواست یافت نشد'); // translated to Persian
    }

    // Create resource access object
    const resource: ResourceAccess = {
      resourceType: resourceAuth.resourceType,
      resourceId,
      storeId,
      userId,
    };

    // Check if user can access this resource
    await this.authorizationService.checkResourceAccess(user, resource);

    return true;
  }
}
