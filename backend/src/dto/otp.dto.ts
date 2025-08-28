import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsMongoId, Matches } from 'class-validator';

export class CreateOtpDto {
  @ApiProperty({ description: 'Iranian mobile number', example: '09123456789' })
  @IsString()
  @Matches(/^09[0-9]{9}$/)
  phoneNumber: string;

  @ApiProperty({ description: 'User ID', required: false })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiProperty({ description: '6-digit OTP code', example: '123456' })
  @IsString()
  @Matches(/^[0-9]{6}$/)
  code: string;

  @ApiProperty({ description: 'OTP context', enum: ['login', 'scratch'] })
  @IsEnum(['login', 'scratch'])
  context: 'login' | 'scratch';

  @ApiProperty({ description: 'Scratch code', required: false })
  @IsOptional()
  @IsString()
  scratchCode?: string;

  @ApiProperty({ description: 'Expiration date' })
  @IsDateString()
  expiresAt: string;
}

export class UpdateOtpDto {
  @ApiProperty({ description: 'User ID', required: false })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiProperty({ description: '6-digit OTP code', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{6}$/)
  code?: string;

  @ApiProperty({ description: 'OTP context', required: false })
  @IsOptional()
  @IsEnum(['login', 'scratch'])
  context?: 'login' | 'scratch';

  @ApiProperty({ description: 'Scratch code', required: false })
  @IsOptional()
  @IsString()
  scratchCode?: string;

  @ApiProperty({ description: 'Expiration date', required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}

export class OtpResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ required: false })
  userId?: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ enum: ['login', 'scratch'] })
  context: 'login' | 'scratch';

  @ApiProperty({ required: false })
  scratchCode?: string;

  @ApiProperty({ enum: ['sent', 'verified', 'expired'] })
  status: 'sent' | 'verified' | 'expired';

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
