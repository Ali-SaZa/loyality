import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserContext } from './authorization.service';
import { RoleAuthMetadata, ROLE_AUTH_KEY } from './role-auth.decorator';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roleAuth = this.reflector.get<RoleAuthMetadata>(ROLE_AUTH_KEY, context.getHandler());
    
    if (!roleAuth) {
      // No role auth required, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserContext;

    if (!user) {
      throw new ForbiddenException('متن کاربر یافت نشد'); // translated to Persian
    }

    if (!roleAuth.allowedRoles.includes(user.role)) {
      throw new ForbiddenException(`دسترسی ممنوع. نقش مورد نیاز: ${roleAuth.allowedRoles.join(' یا ')}`); // translated to Persian
    }

    return true;
  }
}
