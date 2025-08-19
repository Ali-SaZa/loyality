import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsBoolean, Min, MaxLength, Matches, IsDateString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ description: 'Store name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Owner name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  ownerName: string;

  @ApiProperty({ description: 'Iranian mobile number', example: '09123456789' })
  @IsString()
  @Matches(/^09[0-9]{9}$/, { message: 'Phone number must be a valid Iranian mobile number' })
  phoneNumber: string;

  @ApiProperty({ description: 'Store address' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Street address', required: false })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ description: 'Latitude', required: false })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({ description: 'Longitude', required: false })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiProperty({ description: 'Loyalty tiers', required: false })
  @IsOptional()
  @IsArray()
  loyaltyTiers?: Array<{
    minAmount: number;
    rewardType: 'discount' | 'cashback' | 'lottery';
    value: number;
    description?: string;
  }>;

  @ApiProperty({ description: 'Lottery frequency', enum: ['weekly', 'monthly', 'none'], default: 'none' })
  @IsOptional()
  @IsEnum(['weekly', 'monthly', 'none'])
  lotteryFrequency?: 'weekly' | 'monthly' | 'none';

  @ApiProperty({ description: 'Default cashback rate', minimum: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultCashbackRate?: number;
}

export class UpdateStoreDto {
  @ApiProperty({ description: 'Store name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ description: 'Owner name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ownerName?: string;

  @ApiProperty({ description: 'Store address', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'Street address', required: false })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ description: 'Latitude', required: false })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({ description: 'Longitude', required: false })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiProperty({ description: 'Loyalty tiers', required: false })
  @IsOptional()
  @IsArray()
  loyaltyTiers?: Array<{
    minAmount: number;
    rewardType: 'discount' | 'cashback' | 'lottery';
    value: number;
    description?: string;
  }>;

  @ApiProperty({ description: 'Lottery frequency', required: false })
  @IsOptional()
  @IsEnum(['weekly', 'monthly', 'none'])
  lotteryFrequency?: 'weekly' | 'monthly' | 'none';

  @ApiProperty({ description: 'Default cashback rate', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultCashbackRate?: number;
}

export class StoreResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ownerName: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  address: {
    city: string;
    street?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  @ApiProperty()
  loyaltySettings: {
    tiers: Array<{
      minAmount: number;
      rewardType: 'discount' | 'cashback' | 'lottery';
      value: number;
      description?: string;
    }>;
    lotteryFrequency: 'weekly' | 'monthly' | 'none';
    defaultCashbackRate: number;
  };

  @ApiProperty()
  plan: {
    type: 'free' | 'premium';
    startDate: Date;
    endDate: Date;
  };

  @ApiProperty()
  role: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
