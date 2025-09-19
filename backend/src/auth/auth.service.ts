import { Injectable, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { OtpService } from "../otp/otp.service";
import { UsersService } from "../users/users.service";
import { RequestOtpDto, VerifyOtpDto, AuthResponseDto } from "./dto/auth.dto";
import { UserDocument } from "../schemas/user.schema";
import {
  CustomBadRequestException,
  CustomUnauthorizedException,
} from "../common/errors";
import { PERSIAN_ERROR_MESSAGES } from "../common/errors";

interface KavehNegarResponse {
  return: {
    status: number;
    message: string;
  };
  entries: Array<{
    messageid: number;
    message: string;
    status: number;
    statustext: string;
    sender: string;
    receptor: string;
    date: number;
    cost: number;
  }>;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private otpService: OtpService,
    private usersService: UsersService,
    private httpService: HttpService,
    private configService: ConfigService,
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
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Create OTP record with shorter expiration for security
      await this.otpService.create({
        phoneNumber,
        code: otpCode,
        context: "login",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
      });

      // Send SMS using Kaveh Negar API directly
      try {
        const kavehNegarResponse = await this.sendOtpViaKavehNegar(
          phoneNumber,
          otpCode,
        );
        console.log(
          "✅ OTP SMS sent successfully via Kaveh Negar:",
          kavehNegarResponse,
        );
      } catch (smsError) {
        console.error("❌ Failed to send OTP SMS:", smsError);
        // Don't throw error here - OTP is still created and can be used
        // In development, log the OTP for testing
        if (process.env.NODE_ENV === "development") {
          console.log(`📱 OTP for ${phoneNumber}: ${otpCode}`);
        }
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

  validateToken(token: string): Record<string, any> {
    try {
      const payload: Record<string, any> = this.jwtService.verify(token, {
        issuer: "loyalty-api",
        audience: "loyalty-users",
      });
      return payload;
    } catch (error) {
      if ((error as Error).name === "TokenExpiredError") {
        throw new CustomUnauthorizedException("TOKEN_EXPIRED");
      } else if ((error as Error).name === "JsonWebTokenError") {
        throw new CustomUnauthorizedException("TOKEN_INVALID");
      } else if ((error as Error).name === "NotBeforeError") {
        throw new CustomUnauthorizedException("UNAUTHORIZED");
      }
      throw new CustomUnauthorizedException("TOKEN_INVALID");
    }
  }

  /**
   * Send OTP via Kaveh Negar verify/lookup API
   */
  private async sendOtpViaKavehNegar(
    phoneNumber: string,
    otpCode: string,
  ): Promise<KavehNegarResponse> {
    const apiKey = this.configService.get<string>("KAVEH_NEGAR_API_KEY");
    if (!apiKey) {
      throw new Error("KAVEH_NEGAR_API_KEY is not configured");
    }

    const baseUrl = "https://api.kavenegar.com/v1";
    const endpoint = `${baseUrl}/${apiKey}/verify/lookup.json`;

    console.log(`📱 Sending OTP to ${phoneNumber} via Kaveh Negar`);

    try {
      const response = await firstValueFrom(
        this.httpService.get(endpoint, {
          params: {
            receptor: phoneNumber,
            token: otpCode,
            template: "verify",
          },
        }),
      );

      const result: KavehNegarResponse = (response as any).data as KavehNegarResponse;

      if (result.return.status === 200) {
        console.log(`✅ OTP SMS sent successfully to ${phoneNumber}`);

        // Log the actual message that was sent
        if (result.entries && result.entries.length > 0) {
          console.log(`📱 SMS Message: ${result.entries[0].message}`);
        }

        return result;
      } else {
        console.error(`❌ Failed to send OTP SMS: ${result.return.message}`);
        throw new Error(`SMS sending failed: ${result.return.message}`);
      }
    } catch (error) {
      console.error(`❌ Error sending OTP SMS to ${phoneNumber}:`, error);
      throw new Error(`Failed to send SMS: ${(error as Error).message}`);
    }
  }
}
