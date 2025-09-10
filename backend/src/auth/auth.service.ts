import { Injectable, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OtpService } from "../otp/otp.service";
import { UsersService } from "../users/users.service";
import { RequestOtpDto, VerifyOtpDto, AuthResponseDto } from "./dto/auth.dto";
import { User, UserDocument } from "../schemas/user.schema";
import {
  CustomBadRequestException,
  CustomUnauthorizedException,
} from "../common/errors";
import { PERSIAN_ERROR_MESSAGES } from "../common/errors";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private otpService: OtpService,
    private usersService: UsersService,
  ) {}

  async requestOtp(
    requestOtpDto: RequestOtpDto,
  ): Promise<{ message: string; phoneNumber: string }> {
    try {
      const { phoneNumber } = requestOtpDto;

      // Validate phone number format
      const phoneRegex = /^09[0-9]{9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new BadRequestException(
          "فرمت شماره موبایل نامعتبر است. باید به فرمت 09XXXXXXXXX باشد",
        ); // translated to Persian
      }

      // Check if there's a recent OTP request (within 2 minutes)
      const recentOtp = await this.otpService.findRecentOtp(
        phoneNumber,
        "login",
      );
      if (recentOtp && recentOtp.createdAt) {
        const timeDiff = Date.now() - new Date(recentOtp.createdAt).getTime();
        const remainingTime = Math.ceil((2 * 60 * 1000 - timeDiff) / 1000); // 2 minutes in seconds

        if (timeDiff < 2 * 60 * 1000) {
          // 2 minutes
          throw new CustomBadRequestException(
            "OTP_ALREADY_SENT",
            `لطفاً ${remainingTime} ثانیه صبر کنید قبل از درخواست کد تایید جدید`,
          ); // translated to Persian
        }
      }

      // Generate a 6-digit OTP code
      // const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // For testing purposes, use fixed OTP code
      const otpCode = "123456";

      // Create OTP record with shorter expiration for security
      await this.otpService.create({
        phoneNumber,
        code: otpCode,
        context: "login",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes (reduced from 10)
      });

      // In a real application, you would send SMS here
      // For now, we'll just log it (in development)
      if (process.env.NODE_ENV === "development") {
        console.log(`📱 OTP for ${phoneNumber}: ${otpCode}`);
      }

      return {
        message: PERSIAN_ERROR_MESSAGES.OTP_SENT_SUCCESSFULLY,
        phoneNumber,
      };
    } catch (error) {
      console.error("Error in requestOtp:", error);
      throw error;
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponseDto> {
    const { phoneNumber, code } = verifyOtpDto;

    // Validate phone number format
    const phoneRegex = /^09[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new BadRequestException("فرمت شماره موبایل نامعتبر است"); // translated to Persian
    }

    // Validate OTP code format
    if (!/^\d{6}$/.test(code)) {
      throw new BadRequestException(
        "فرمت کد تایید نامعتبر است. باید 6 رقم باشد",
      ); // translated to Persian
    }

    // Verify OTP
    const otp = await this.otpService.verifyOtp(phoneNumber, code, "login");
    if (!otp) {
      throw new CustomUnauthorizedException("UNAUTHORIZED");
    }

    // Check if user exists
    let user: UserDocument | null =
      await this.usersService.findByPhoneNumber(phoneNumber);
    let isNewUser = false;

    if (!user) {
      // Create new user with minimal information
      user = await this.usersService.create({
        phoneNumber,
      });
      isNewUser = true;
    }

    // Generate JWT token with enhanced security
    const payload = {
      phoneNumber: user.phoneNumber,
      userId: user._id.toString(), // Ensure userId is always included
      role: user.role,
      iat: Math.floor(Date.now() / 1000), // Issued at
      type: "access", // Token type
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      issuer: "loyalty-api",
      audience: "loyalty-users",
    });

    return {
      accessToken,
      user: {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,

        role: user.role,

        lastActivity: user.lastActivity,
      },
      isNewUser,
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token, {
        issuer: "loyalty-api",
        audience: "loyalty-users",
      });
      return payload;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new CustomUnauthorizedException("TOKEN_EXPIRED");
      } else if (error.name === "JsonWebTokenError") {
        throw new CustomUnauthorizedException("TOKEN_INVALID");
      } else if (error.name === "NotBeforeError") {
        throw new CustomUnauthorizedException("UNAUTHORIZED");
      }
      throw new CustomUnauthorizedException("TOKEN_INVALID");
    }
  }
}
