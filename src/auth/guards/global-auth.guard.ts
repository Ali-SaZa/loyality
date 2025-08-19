import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    
    if (isPublic) {
      return true;
    }

    // For all other routes, require JWT authentication
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.usersService.findByPhoneNumber(payload.phoneNumber);
      
      if (!user) {
        return false;
      }

      // Attach user to request for use in controllers
      request.user = user;
      return true;
    } catch {
      return false;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
