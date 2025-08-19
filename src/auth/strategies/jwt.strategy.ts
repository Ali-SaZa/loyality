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
      throw new Error('JWT_SECRET environment variable is required');
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
      throw new UnauthorizedException('Invalid token payload');
    }

    // Validate payload types
    if (typeof payload.phoneNumber !== 'string' || 
        typeof payload.userId !== 'string' || 
        typeof payload.role !== 'string') {
      throw new UnauthorizedException('Invalid token payload types');
    }

    // Validate phone number format (Iranian format)
    const phoneRegex = /^09[0-9]{9}$/;
    if (!phoneRegex.test(payload.phoneNumber)) {
      throw new UnauthorizedException('Invalid phone number format in token');
    }

    // Validate role
    if (payload.role !== 'customer' && payload.role !== 'admin' && payload.role !== 'store') {
      throw new UnauthorizedException('Invalid user role in token');
    }

    const user = await this.usersService.findByPhoneNumber(payload.phoneNumber);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Additional security checks
    if (user.role !== payload.role) {
      throw new UnauthorizedException('User role mismatch');
    }

    return {
      phoneNumber: user.phoneNumber,
      userId: payload.userId,
      role: user.role,
      _id: user._id,
    };
  }
}
