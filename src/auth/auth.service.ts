import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '../otp/otp.service';
import { UsersService } from '../users/users.service';
import { RequestOtpDto, VerifyOtpDto, AuthResponseDto } from './dto/auth.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { 
  CustomBadRequestException,
  CustomUnauthorizedException 
} from '../common/errors';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private otpService: OtpService,
    private usersService: UsersService,
  ) {}

  async requestOtp(requestOtpDto: RequestOtpDto): Promise<{ message: string; phoneNumber: string }> {
    const { phoneNumber } = requestOtpDto;

    // Check if there's a recent OTP request (within 2 minutes)
    const recentOtp = await this.otpService.findRecentOtp(phoneNumber, 'login');
    if (recentOtp) {
      const timeDiff = Date.now() - recentOtp.createdAt.getTime();
      const remainingTime = Math.ceil((2 * 60 * 1000 - timeDiff) / 1000); // 2 minutes in seconds
      
      if (timeDiff < 2 * 60 * 1000) { // 2 minutes
        throw new CustomBadRequestException('OTP_ALREADY_SENT', `Please wait ${remainingTime} seconds before requesting another OTP code`);
      }
    }

    // Generate a 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create OTP record
    await this.otpService.create({
      phoneNumber,
      code: otpCode,
      context: 'login',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // In a real application, you would send SMS here
    // For now, we'll just log it (in development)
    console.log(`📱 OTP for ${phoneNumber}: ${otpCode}`);

    return {
      message: 'OTP sent successfully',
      phoneNumber,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponseDto> {
    const { phoneNumber, code } = verifyOtpDto;

    // Verify OTP
    const otp = await this.otpService.verifyOtp(phoneNumber, code, 'login');
    if (!otp) {
      throw new CustomUnauthorizedException('UNAUTHORIZED');
    }

    // Check if user exists
    let user: UserDocument | null = await this.usersService.findByPhoneNumber(phoneNumber);
    let isNewUser = false;

    if (!user) {
      // Create new user with minimal information
      user = await this.usersService.create({
        phoneNumber,
        dataCollectionConsent: false,
        marketingConsent: false,
      }) as UserDocument;
      isNewUser = true;
    }

    // Generate JWT token
    const payload = {
      phoneNumber: user.phoneNumber,
      userId: user._id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        totalPoints: user.totalPoints,
        role: user.role,
        tags: user.tags,
        lastActivity: user.lastActivity,
      },
      isNewUser,
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new CustomUnauthorizedException('TOKEN_INVALID');
    }
  }
}
