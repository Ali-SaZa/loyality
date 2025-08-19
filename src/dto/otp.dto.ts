import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, Matches } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ description: 'Iranian mobile number', example: '09123456789' })
  @IsString()
  @Matches(/^09[0-9]{9}$/, { message: 'Phone number must be a valid Iranian mobile number' })
  phoneNumber: string;

  @ApiProperty({ description: 'OTP context', enum: ['login', 'scratch'] })
  @IsEnum(['login', 'scratch'])
  context: 'login' | 'scratch';

  @ApiProperty({ description: 'Scratch card code (required for scratch context)', required: false })
  @IsOptional()
  @IsString()
  scratchCode?: string;
}

export class VerifyOtpDto {
  @ApiProperty({ description: 'Iranian mobile number' })
  @IsString()
  @Matches(/^09[0-9]{9}$/)
  phoneNumber: string;

  @ApiProperty({ description: '6-digit OTP code' })
  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'OTP must be exactly 6 digits' })
  code: string;

  @ApiProperty({ description: 'OTP context', enum: ['login', 'scratch'] })
  @IsEnum(['login', 'scratch'])
  context: 'login' | 'scratch';

  @ApiProperty({ description: 'Scratch card code (required for scratch context)', required: false })
  @IsOptional()
  @IsString()
  scratchCode?: string;
}

export class OtpResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  userId?: string;

  @ApiProperty()
  context: 'login' | 'scratch';

  @ApiProperty()
  scratchCode?: string;

  @ApiProperty()
  status: 'sent' | 'verified' | 'expired';

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  createdAt: Date;
}
