import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
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
      throw new UnauthorizedException('Access token is required');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      
      // Validate payload structure
      if (!payload.phoneNumber || !payload.userId || !payload.role) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.usersService.findByPhoneNumber(payload.phoneNumber);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Verify user is still active (you can add more checks here)
      if (user.role !== payload.role) {
        throw new UnauthorizedException('User role mismatch');
      }

      // Attach user to request for use in controllers
      request.user = {
        ...user.toObject(),
        userId: payload.userId, // Ensure userId is available
      };
      
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      // Log the error for debugging (remove in production or use proper logger)
      console.error('JWT validation error:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    
    if (type !== 'Bearer') {
      return undefined;
    }
    
    // Basic token format validation
    if (!token || typeof token !== 'string' || token.length < 10) {
      return undefined;
    }
    
    return token;
  }
}
