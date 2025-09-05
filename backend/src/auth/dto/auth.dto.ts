import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestOtpDto {
  @ApiProperty({
    description: 'Phone number in Iranian format',
    example: '09123456789',
    pattern: '^09[0-9]{9}$'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^09[0-9]{9}$/, {
    message: 'Phone number must be in Iranian format (09XXXXXXXXX)'
  })
  phoneNumber: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Phone number in Iranian format',
    example: '09123456789'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^09[0-9]{9}$/, {
    message: 'Phone number must be in Iranian format (09XXXXXXXXX)'
  })
  phoneNumber: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{6}$/, {
    message: 'OTP code must be exactly 6 digits'
  })
  code: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    example: {
      _id: '507f1f77bcf86cd799439011',
      phoneNumber: '09123456789',
      name: 'Ali Ahmadi',

      role: 'customer'
    }
  })
  user: any;

  @ApiProperty({
    description: 'Whether this is a new user registration',
    example: false
  })
  isNewUser: boolean;
}
