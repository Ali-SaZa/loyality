import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('متغیر محیطی JWT_SECRET الزامی است'); // translated to Persian
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      issuer: 'loyalty-api',
      audience: 'loyalty-users',
      algorithms: ['HS256'],
    });
  }

  async validate(payload: any) {
    // Validate payload structure
    if (!payload.phoneNumber || !payload.userId || !payload.role) {
      throw new UnauthorizedException('محتوای توکن نامعتبر است'); // translated to Persian
    }

    // Validate payload types
    if (typeof payload.phoneNumber !== 'string' || 
        typeof payload.userId !== 'string' || 
        typeof payload.role !== 'string') {
      throw new UnauthorizedException('نوع محتوای توکن نامعتبر است'); // translated to Persian
    }

    // Validate phone number format (Iranian format)
    const phoneRegex = /^09[0-9]{9}$/;
    if (!phoneRegex.test(payload.phoneNumber)) {
      throw new UnauthorizedException('فرمت شماره موبایل در توکن نامعتبر است'); // translated to Persian
    }

    // Validate role
    if (payload.role !== 'customer' && payload.role !== 'admin' && payload.role !== 'store') {
      throw new UnauthorizedException('نقش کاربر در توکن نامعتبر است'); // translated to Persian
    }

    const user = await this.usersService.findByPhoneNumber(payload.phoneNumber);
    if (!user) {
      throw new UnauthorizedException('کاربر یافت نشد'); // translated to Persian
    }

    // Additional security checks
    if (user.role !== payload.role) {
      throw new UnauthorizedException('نقش کاربر مطابقت ندارد'); // translated to Persian
    }

    return {
      phoneNumber: user.phoneNumber,
      userId: payload.userId,
      role: user.role,
      _id: user._id,
    };
  }
}
