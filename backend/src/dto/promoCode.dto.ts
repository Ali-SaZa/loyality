import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsMongoId, 
  Matches,
  MaxLength
} from 'class-validator';

// Create Promo Code DTO
export class CreatePromoCodeDto {
  @ApiProperty({ 
    description: 'Promo code string', 
    example: 'WELCOME50',
    pattern: '^[A-Z0-9]{6,12}$'
  })
  @IsString()
  @Matches(/^[A-Z0-9]{6,12}$/, { 
    message: 'Promo code must be 6-12 characters, uppercase letters and numbers only' 
  })
  code: string;

  @ApiProperty({ 
    description: 'Promotion ID this code belongs to', 
    example: '507f1f77bcf86cd799439011' 
  })
  @IsMongoId()
  promotionId: string;

  @ApiProperty({ 
    description: 'When this specific code expires', 
    required: false 
  })
  @IsOptional()
  expiresAt?: Date;

  @ApiProperty({ 
    description: 'Optional notes about this specific code', 
    required: false,
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  notes?: string;
}

// Update Promo Code DTO
export class UpdatePromoCodeDto {
  @ApiProperty({ 
    description: 'Optional notes about this specific code', 
    required: false,
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  notes?: string;

  @ApiProperty({ 
    description: 'When this specific code expires', 
    required: false 
  })
  @IsOptional()
  expiresAt?: Date;

  // Note: code, promotionId, status, userId, usedAt are immutable and not included
}

// Change Status DTO
export class ChangePromoCodeStatusDto {
  @ApiProperty({ 
    description: 'New status for the promo code', 
    enum: ['unused', 'used']
  })
  @IsEnum(['unused', 'used'])
  status: string;

  @ApiProperty({ 
    description: 'User ID who used the code (required when status is "used")', 
    required: false,
    example: '507f1f77bcf86cd799439011'
  })
  @IsOptional()
  @IsMongoId()
  userId?: string;
}

// Validate Code DTO
export class ValidatePromoCodeDto {
  @ApiProperty({ 
    description: 'Promo code to validate', 
    example: 'WELCOME50'
  })
  @IsString()
  @Matches(/^[A-Z0-9]{6,12}$/, { 
    message: 'Promo code must be 6-12 characters, uppercase letters and numbers only' 
  })
  code: string;

  @ApiProperty({ 
    description: 'Store ID where the code is being used', 
    example: '507f1f77bcf86cd799439011'
  })
  @IsMongoId()
  storeId: string;
}

// Response DTOs
export class PromoCodeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  promotionId: string;

  @ApiProperty({ enum: ['unused', 'used'] })
  status: string;

  @ApiProperty({ required: false })
  userId?: string;

  @ApiProperty({ required: false })
  registeredAt?: Date;

  @ApiProperty({ required: false })
  usedAt?: Date;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // Populated fields
  @ApiProperty({ required: false })
  promotion?: {
    id: string;
    title: string;
    price: number;
    points: number;
    status: string;
  };

  @ApiProperty({ required: false })
  user?: {
    id: string;
    phoneNumber: string;
    firstName?: string;
    lastName?: string;
  };
}

// Validation Response DTO (includes promotion details)
export class PromoCodeValidationResponseDto {
  @ApiProperty()
  isValid: boolean;

  @ApiProperty({ required: false })
  promoCode?: PromoCodeResponseDto;

  @ApiProperty({ required: false })
  promotion?: {
    id: string;
    title: string;
    description?: string;
    price: number;
    points: number;
    status: string;
  };

  @ApiProperty({ required: false })
  message?: string;

  @ApiProperty({ required: false })
  errorCode?: string;
}

// Bulk Create DTO
export class BulkCreatePromoCodesDto {
  @ApiProperty({ 
    description: 'Promotion ID to create codes for', 
    example: '507f1f77bcf86cd799439011' 
  })
  @IsMongoId()
  promotionId: string;

  @ApiProperty({ 
    description: 'Number of codes to generate', 
    minimum: 1,
    maximum: 1000
  })
  @IsOptional()
  count?: number;

  @ApiProperty({ 
    description: 'Prefix for all generated codes (optional). Prefix can be any length and contain only English letters and numbers (no spaces)', 
    required: false,
    example: 'WELCOME2024'
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9]*$/, { 
    message: 'Prefix must contain only English letters and numbers (no spaces)' 
  })
  prefix?: string;

  @ApiProperty({ 
    description: 'When these codes expire', 
    required: false 
  })
  @IsOptional()
  expiresAt?: Date;

  @ApiProperty({ 
    description: 'Optional notes for these codes', 
    required: false,
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  notes?: string;
}

// Register Code to User DTO
export class RegisterPromoCodeDto {
  @ApiProperty({ 
    description: 'Promo code to register', 
    example: 'WELCOME50'
  })
  @IsString()
  @Matches(/^[A-Z0-9]{6,12}$/, { 
    message: 'Promo code must be 6-12 characters, uppercase letters and numbers only' 
  })
  code: string;

  @ApiProperty({ 
    description: 'User phone number', 
    example: '09123456789'
  })
  @IsString()
  @Matches(/^09[0-9]{9}$/, { 
    message: 'Phone number must be in format 09xxxxxxxxx' 
  })
  phoneNumber: string;
}

// Get User Promo Codes DTO
export class GetUserPromoCodesDto {
  @ApiProperty({ 
    description: 'User phone number', 
    example: '09123456789'
  })
  @IsString()
  @Matches(/^09[0-9]{9}$/, { 
    message: 'Phone number must be in format 09xxxxxxxxx' 
  })
  phoneNumber: string;

  @ApiProperty({ 
    description: 'Store ID to filter by (optional)', 
    required: false,
    example: '507f1f77bcf86cd799439011'
  })
  @IsOptional()
  @IsMongoId()
  storeId?: string;
}

// List Response DTO
export class PromoCodeListResponseDto {
  @ApiProperty({ type: [PromoCodeResponseDto] })
  data: PromoCodeResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  hasPrevPage: boolean;
}
