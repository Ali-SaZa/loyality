import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsBoolean, Min, MaxLength, Matches, IsDateString, IsObject, IsMongoId } from 'class-validator';

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
  @Matches(/^09[0-9]{9}$/)
  phoneNumber: string;

  @ApiProperty({ description: 'User ID of the store manager', example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  userId: string;

  @ApiProperty({ description: 'Store address' })
  @IsObject()
  address: {
    city: string;
    street?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  @ApiProperty({ description: 'Loyalty settings' })
  @IsObject()
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

  @ApiProperty({ description: 'Store plan' })
  @IsObject()
  plan: {
    type: 'free' | 'premium';
    startDate: Date;
    endDate: Date;
  };
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

  @ApiProperty({ description: 'User ID of the store manager', required: false, example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiProperty({ description: 'Store address', required: false })
  @IsOptional()
  @IsObject()
  address?: {
    city?: string;
    street?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
  };

  @ApiProperty({ description: 'Loyalty settings', required: false })
  @IsOptional()
  @IsObject()
  loyaltySettings?: {
    tiers?: Array<{
      minAmount: number;
      rewardType: 'discount' | 'cashback' | 'lottery';
      value: number;
      description?: string;
    }>;
    lotteryFrequency?: 'weekly' | 'monthly' | 'none';
    defaultCashbackRate?: number;
  };

  @ApiProperty({ description: 'Store plan', required: false })
  @IsOptional()
  @IsObject()
  plan?: {
    type?: 'free' | 'premium';
    startDate?: Date;
    endDate?: Date;
  };
}

export class StoreResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ownerName: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  userId: string;

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

export class CreateStoreUserDto {
  @ApiProperty({ description: 'Iranian mobile number', example: '09123456789' })
  @IsString()
  @Matches(/^09[0-9]{9}$/)
  phoneNumber: string;

  @ApiProperty({ description: 'First name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ description: 'Last name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  lastName: string;
}

export class CreateStoreWithUserDto {
  @ApiProperty({ description: 'User information for the store manager' })
  @IsObject()
  user: CreateStoreUserDto;

  @ApiProperty({ description: 'Store information' })
  @IsObject()
  store: CreateStoreDto;
}

export class StoreWithUserResponseDto {
  @ApiProperty()
  user: {
    id: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };

  @ApiProperty()
  store: StoreResponseDto;
}
