import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestOtpDto, VerifyOtpDto, AuthResponseDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request OTP for phone number',
    description: 'Sends a 6-digit OTP code to the specified phone number for authentication'
  })
  @ApiBody({ type: RequestOtpDto })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'OTP sent successfully' },
        phoneNumber: { type: 'string', example: '09123456789' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid phone number format'
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - please wait before requesting another OTP'
  })
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.authService.requestOtp(requestOtpDto);
  }

  @Post('verify-otp')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify OTP and authenticate user',
    description: 'Verifies the OTP code and returns JWT token. Creates new user if phone number does not exist.'
  })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    type: AuthResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid OTP code'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<AuthResponseDto> {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Protected endpoint that returns the current authenticated user profile'
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        phoneNumber: { type: 'string' },
        userId: { type: 'string' },
        role: { type: 'string' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  async getProfile(@CurrentUser() user: any) {
    return {
      message: 'Profile retrieved successfully',
      user: {
        phoneNumber: user.phoneNumber,
        userId: user.userId,
        role: user.role
      }
    };
  }
}
