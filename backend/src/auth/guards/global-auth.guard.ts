import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from '../../schemas/store.schema';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
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
      throw new UnauthorizedException('توکن دسترسی الزامی است'); // translated to Persian
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      
      // Validate payload structure
      if (!payload.phoneNumber || !payload.userId || !payload.role) {
        throw new UnauthorizedException('محتوای توکن نامعتبر است'); // translated to Persian
      }

      const user = await this.usersService.findByPhoneNumber(payload.phoneNumber);
      
      if (!user) {
        throw new UnauthorizedException('کاربر یافت نشد'); // translated to Persian
      }

      // Verify user is still active (you can add more checks here)
      if (user.role !== payload.role) {
        throw new UnauthorizedException('نقش کاربر مطابقت ندارد'); // translated to Persian
      }

      // For store owners, get their store information using the user._id from database
      let storeId: string | undefined;
      if (payload.role === 'store') {
        const store = await this.storeModel.findOne({ userId: user._id }).exec();
        if (store) {
          storeId = store._id.toString();
        }
      }

      // Attach user to request for use in controllers
      request.user = {
        ...user.toObject(),
        _id: user._id, // Ensure _id is available
        userId: user._id.toString(), // Use the correct userId from database
        storeId, // Include storeId for store owners
      };
      
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      // Log the error for debugging (remove in production or use proper logger)
      console.error('JWT validation error:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('توکن منقضی شده است'); // translated to Persian
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('توکن نامعتبر است'); // translated to Persian
      }
      
      throw new UnauthorizedException('احراز هویت ناموفق بود'); // translated to Persian
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
