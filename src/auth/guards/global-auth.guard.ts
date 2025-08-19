import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtAuthGuard: JwtAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    
    if (isPublic) {
      return true;
    }

    // For all other routes, require JWT authentication
    const result = await this.jwtAuthGuard.canActivate(context);
    return result as boolean;
  }
}
