import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsBoolean, IsDateString, Min, MaxLength, Matches } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @ApiProperty({ description: 'Iranian mobile number', example: '09123456789' })
  @IsString()
  @Matches(/^09[0-9]{9}$/)
  phoneNumber: string;

  @ApiProperty({ description: 'User name', required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ description: 'Data collection consent', default: false })
  @IsOptional()
  @IsBoolean()
  dataCollectionConsent?: boolean;

  @ApiProperty({ description: 'Marketing consent', default: false })
  @IsOptional()
  @IsBoolean()
  marketingConsent?: boolean;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'User name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ description: 'Data collection consent' })
  @IsOptional()
  @IsBoolean()
  dataCollectionConsent?: boolean;

  @ApiProperty({ description: 'Marketing consent' })
  @IsOptional()
  @IsBoolean()
  marketingConsent?: boolean;
}

export class PurchaseDto {
  @ApiProperty({ description: 'Store ID' })
  @IsString()
  storeId: string;

  @ApiProperty({ description: 'Purchase amount in IRR', minimum: 0 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Scratch card code', required: false })
  @IsOptional()
  @IsString()
  scratchCode?: string;

  @ApiProperty({ description: 'Entry method', enum: ['sms', 'qr'] })
  @IsEnum(['sms', 'qr'])
  entryMethod: 'sms' | 'qr';
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  totalPoints: number;

  @ApiProperty()
  purchases: Array<{
    storeId: string;
    amount: number;
    date: Date;
    scratchCode?: string;
    entryMethod: 'sms' | 'qr';
    rewardApplied: {
      type: 'discount' | 'cashback' | 'lottery';
      value: number;
    };
  }>;

  @ApiProperty()
  consents: {
    dataCollection: boolean;
    marketing: boolean;
    consentDate?: Date;
  };

  @ApiProperty()
  role: string;

  @ApiProperty()
  lastActivity?: Date;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
