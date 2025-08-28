import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsBoolean, IsDateString, Min, MaxLength, Matches } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @ApiProperty({ description: 'Iranian mobile number', example: '09123456789' })
  @IsString()
  @Matches(/^09[0-9]{9}$/)
  phoneNumber: string;

  @ApiProperty({ description: 'User first name', required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiProperty({ description: 'User last name', required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;


}

export class UpdateUserDto {
  @ApiProperty({ description: 'User first name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiProperty({ description: 'User last name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;


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
  firstName?: string;

  @ApiProperty()
  lastName?: string;

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
  role: string;

  @ApiProperty({ enum: ['active', 'blocked', 'deleted'] })
  status: string;

  @ApiProperty()
  lastActivity: Date;

  @ApiProperty({ description: 'Store name (for store users)', required: false })
  storeName?: string;

  @ApiProperty({ description: 'Store address (for store users)', required: false })
  address?: string;

  @ApiProperty({ description: 'Store description (for store users)', required: false })
  description?: string;



  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
