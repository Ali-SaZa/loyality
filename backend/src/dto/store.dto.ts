import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsBoolean, Min, MaxLength, Matches, IsDateString, IsObject, IsMongoId } from 'class-validator';

export class StoreAddressDto {
  @ApiProperty({ description: 'Province', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  province: string;

  @ApiProperty({ description: 'City', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({ description: 'Full address', maxLength: 500 })
  @IsString()
  @MaxLength(500)
  fullAddress: string;
}

export class SocialLinksDto {
  @ApiProperty({ description: 'Website URL', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: 'Instagram handle', required: false })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({ description: 'Telegram handle', required: false })
  @IsOptional()
  @IsString()
  telegram?: string;
}

export class WorkingHoursDto {
  @ApiProperty({ description: 'Opening time', example: '09:00' })
  @IsString()
  open: string;

  @ApiProperty({ description: 'Closing time', example: '21:00' })
  @IsString()
  close: string;
}

export class CreateStoreDto {
  @ApiProperty({ description: 'Store name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Iranian mobile number', example: '09123456789' })
  @IsString()
  @Matches(/^09[0-9]{9}$/)
  phoneNumber: string;

  @ApiProperty({ description: 'User ID of the store manager', example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  userId: string;

  @ApiProperty({ description: 'Store address' })
  @IsObject()
  address: StoreAddressDto;

  @ApiProperty({ description: 'Promotion IDs', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  promotions?: string[];

  @ApiProperty({ description: 'Plan expiry date', required: false })
  @IsOptional()
  @IsDateString()
  planExpiryDate?: Date;

  @ApiProperty({ description: 'Store status', enum: ['active', 'pending', 'deleted', 'suspended'], required: false })
  @IsOptional()
  @IsEnum(['active', 'pending', 'deleted', 'suspended'])
  status?: string;

  @ApiProperty({ description: 'Logo URL', required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ description: 'Store description', maxLength: 500, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Social media links', required: false })
  @IsOptional()
  @IsObject()
  socialLinks?: SocialLinksDto;

  @ApiProperty({ description: 'Working hours', required: false })
  @IsOptional()
  @IsObject()
  workingHours?: WorkingHoursDto;

  @ApiProperty({ description: 'SMS balance', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  smsBalance?: number;

  @ApiProperty({ description: 'Last SMS sent timestamp', required: false })
  @IsOptional()
  @IsDateString()
  lastSmsSentAt?: Date;

  @ApiProperty({ description: 'Total SMS sent count', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalSmsSent?: number;
}

export class UpdateStoreDto {
  @ApiProperty({ description: 'Store name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ description: 'Iranian mobile number', example: '09123456789', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^09[0-9]{9}$/)
  phoneNumber?: string;

  @ApiProperty({ description: 'User ID of the store manager', required: false, example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiProperty({ description: 'Store address', required: false })
  @IsOptional()
  @IsObject()
  address?: StoreAddressDto;

  @ApiProperty({ description: 'Promotion IDs', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  promotions?: string[];

  @ApiProperty({ description: 'Plan expiry date', required: false })
  @IsOptional()
  @IsDateString()
  planExpiryDate?: Date;

  @ApiProperty({ description: 'Store status', enum: ['active', 'pending', 'deleted', 'suspended'], required: false })
  @IsOptional()
  @IsEnum(['active', 'pending', 'deleted', 'suspended'])
  status?: string;

  @ApiProperty({ description: 'Logo URL', required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ description: 'Store description', maxLength: 500, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Social media links', required: false })
  @IsOptional()
  @IsObject()
  socialLinks?: SocialLinksDto;

  @ApiProperty({ description: 'Working hours', required: false })
  @IsOptional()
  @IsObject()
  workingHours?: WorkingHoursDto;

  @ApiProperty({ description: 'SMS balance', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  smsBalance?: number;

  @ApiProperty({ description: 'Last SMS sent timestamp', required: false })
  @IsOptional()
  @IsDateString()
  lastSmsSentAt?: Date;

  @ApiProperty({ description: 'Total SMS sent count', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalSmsSent?: number;
}

export class StoreResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  address: StoreAddressDto;

  @ApiProperty({ type: [String] })
  promotions: string[];

  @ApiProperty({ required: false })
  planExpiryDate?: Date;

  @ApiProperty({ enum: ['active', 'pending', 'deleted', 'suspended'] })
  status: string;

  @ApiProperty({ required: false })
  logoUrl?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  socialLinks?: SocialLinksDto;

  @ApiProperty({ required: false })
  workingHours?: WorkingHoursDto;

  @ApiProperty({ description: 'SMS balance' })
  smsBalance: number;

  @ApiProperty({ description: 'Last SMS sent timestamp', required: false })
  lastSmsSentAt?: Date;

  @ApiProperty({ description: 'Total SMS sent count' })
  totalSmsSent: number;

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

export class SendSmsToCustomerDto {
  @ApiProperty({ description: 'User ID to send SMS to', example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  userId: string;

  @ApiProperty({ description: 'SMS message content', example: 'Your promo code is ready!', maxLength: 160 })
  @IsString()
  @MaxLength(160)
  text: string;
}

export class UpdateSmsBalanceDto {
  @ApiProperty({ description: 'Amount to add/subtract from SMS balance', example: 10 })
  @IsNumber()
  amount: number;
}

export class SmsHistoryItemDto {
  @ApiProperty({ description: 'SMS ID', example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ description: 'Sent date', example: '2024-01-15T10:30:00.000Z' })
  sentDate: Date;

  @ApiProperty({ description: 'Customer full name', example: 'علی احمدی' })
  customerName: string;

  @ApiProperty({ description: 'Customer phone number', example: '09123456789' })
  customerPhone: string;

  @ApiProperty({ description: 'Message text preview (first 15 chars)', example: 'کد تخفیف شما...' })
  messagePreview: string;

  @ApiProperty({ description: 'Full message text', example: 'کد تخفیف شما آماده است. از کد WELCOME10 استفاده کنید.' })
  messageText: string;
}

export class SmsHistoryResponseDto {
  @ApiProperty({ description: 'List of sent SMS messages', type: [SmsHistoryItemDto] })
  data: SmsHistoryItemDto[];

  @ApiProperty({ description: 'Total number of SMS messages', example: 25 })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of pages', example: 3 })
  totalPages: number;

  @ApiProperty({ description: 'Whether there is a next page', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Whether there is a previous page', example: false })
  hasPrevPage: boolean;
}

export class CreateStoreWithUserDto {
  @ApiProperty({ description: 'User information for the store manager' })
  @IsObject()
  user: CreateStoreUserDto;

  @ApiProperty({ description: 'Store information' })
  @IsObject()
  store: Omit<CreateStoreDto, 'userId'>;
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
