import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsArray, 
  IsEnum, 
  IsBoolean, 
  IsDateString, 
  IsObject, 
  IsMongoId, 
  Min, 
  Max, 
  MaxLength, 
  Matches,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

// Base DTO with common fields
export class BasePromotionDto {
  @ApiProperty({ description: 'Store ID this promotion belongs to', example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  storeId: string;

  @ApiProperty({ 
    description: 'Type of promotion', 
    enum: [
      'coupon', 'cashback', 'referral', 'conditional', 'percentage', 
      'fixed', 'flashSale', 'freeShipping', 'loyaltyPoints', 'behavioral', 'stackable'
    ]
  })
  @IsEnum([
    'coupon', 'cashback', 'referral', 'conditional', 'percentage', 
    'fixed', 'flashSale', 'freeShipping', 'loyaltyPoints', 'behavioral', 'stackable'
  ])
  type: string;

  @ApiProperty({ description: 'Promotion title', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Promotion description', maxLength: 500, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Discount value (percentage or fixed amount)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @ApiProperty({ description: 'Minimum purchase amount required', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPurchaseAmount?: number;

  @ApiProperty({ description: 'Maximum discount amount allowed', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @ApiProperty({ description: 'Promo code (for coupon type)', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]{3,20}$/, { message: 'Promo code must be 3-20 characters, uppercase letters and numbers only' })
  code?: string;

  @ApiProperty({ description: 'Loyalty points to award', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  points?: number;

  @ApiProperty({ description: 'Start date of promotion', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({ description: 'End date of promotion', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ description: 'Maximum usage limit', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @ApiProperty({ description: 'Applicable events for behavioral promotions', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableEvents?: string[];

  @ApiProperty({ description: 'Maximum usage per customer', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxUsagePerCustomer?: number;

  @ApiProperty({ description: 'Whether promotion can be stacked with others', required: false })
  @IsOptional()
  @IsBoolean()
  isStackable?: boolean;

  @ApiProperty({ description: 'Promotion types this can be stacked with', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stackableWith?: string[];

  @ApiProperty({ description: 'Terms and conditions', required: false })
  @IsOptional()
  @IsString()
  termsAndConditions?: string;

  @ApiProperty({ description: 'Whether promotion requires approval', required: false })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;
}

// Create Promotion DTO with type-specific validation
export class CreatePromotionDto extends BasePromotionDto {
  // Override base properties with stricter validation for creation
  @ValidateIf(o => o.type === 'coupon')
  @IsString()
  @Matches(/^[A-Z0-9]{3,20}$/, { message: 'Code is required for coupon promotions and must be 3-20 characters, uppercase letters and numbers only' })
  declare code?: string;

  @ValidateIf(o => o.type === 'loyaltyPoints')
  @IsNumber()
  @Min(1, { message: 'Points are required for loyalty point promotions' })
  declare points?: number;

  @ValidateIf(o => ['percentage', 'fixed', 'conditional', 'cashback', 'referral', 'flashSale', 'behavioral', 'stackable'].includes(o.type))
  @IsNumber()
  @Min(0.01, { message: 'Value is required for this promotion type' })
  declare value?: number;

  @ValidateIf(o => o.type === 'conditional')
  @IsNumber()
  @Min(0.01, { message: 'Minimum purchase amount is required for conditional promotions' })
  declare minPurchaseAmount?: number;

  @ValidateIf(o => o.type === 'flashSale')
  @IsDateString({}, { message: 'Start date is required for flash sale promotions' })
  declare startDate?: Date;

  @ValidateIf(o => o.type === 'flashSale')
  @IsDateString({}, { message: 'End date is required for flash sale promotions' })
  declare endDate?: Date;

  @ValidateIf(o => o.type === 'behavioral')
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  declare applicableEvents?: string[];

  @ValidateIf(o => o.type === 'stackable')
  @IsBoolean()
  declare isStackable?: boolean;

  @ValidateIf(o => o.type === 'stackable')
  @IsArray()
  @IsString({ each: true })
  declare stackableWith?: string[];
}

// Update Promotion DTO - excludes immutable fields
export class UpdatePromotionDto {
  @ApiProperty({ description: 'Promotion title', maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiProperty({ description: 'Promotion description', maxLength: 500, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Discount value (percentage or fixed amount)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @ApiProperty({ description: 'Minimum purchase amount required', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPurchaseAmount?: number;

  @ApiProperty({ description: 'Maximum discount amount allowed', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @ApiProperty({ description: 'Maximum usage limit', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @ApiProperty({ description: 'Maximum usage per customer', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxUsagePerCustomer?: number;

  @ApiProperty({ description: 'Whether promotion can be stacked with others', required: false })
  @IsOptional()
  @IsBoolean()
  isStackable?: boolean;

  @ApiProperty({ description: 'Promotion types this can be stacked with', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stackableWith?: string[];

  @ApiProperty({ description: 'Terms and conditions', required: false })
  @IsOptional()
  @IsString()
  termsAndConditions?: string;

  @ApiProperty({ description: 'Whether promotion requires approval', required: false })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @ApiProperty({ description: 'Applicable events for behavioral promotions', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableEvents?: string[];

  // Note: type, storeId, startDate, endDate, code, points are immutable and not included
}

// Status Change DTO
export class ChangePromotionStatusDto {
  @ApiProperty({ 
    description: 'New status for the promotion', 
    enum: ['active', 'inactive', 'deleted', 'expired']
  })
  @IsEnum(['active', 'inactive', 'deleted', 'expired'])
  status: string;
}

// Response DTOs
export class PromotionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  storeId: string;

  @ApiProperty({ 
    enum: [
      'coupon', 'cashback', 'referral', 'conditional', 'percentage', 
      'fixed', 'flashSale', 'freeShipping', 'loyaltyPoints', 'behavioral', 'stackable'
    ]
  })
  type: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  value?: number;

  @ApiProperty({ required: false })
  minPurchaseAmount?: number;

  @ApiProperty({ required: false })
  maxDiscountAmount?: number;

  @ApiProperty({ required: false })
  code?: string;

  @ApiProperty({ required: false })
  points?: number;

  @ApiProperty({ required: false })
  startDate?: Date;

  @ApiProperty({ required: false })
  endDate?: Date;

  @ApiProperty({ enum: ['active', 'inactive', 'deleted', 'expired'] })
  status: string;

  @ApiProperty({ required: false })
  usageLimit?: number;

  @ApiProperty({ required: false })
  currentUsageCount?: number;

  @ApiProperty({ required: false })
  maxUsagePerCustomer?: number;

  @ApiProperty({ required: false })
  isStackable?: boolean;

  @ApiProperty({ required: false })
  stackableWith?: string[];

  @ApiProperty({ required: false })
  termsAndConditions?: string;

  @ApiProperty({ required: false })
  requiresApproval?: boolean;

  @ApiProperty({ required: false })
  applicableEvents?: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// List Response DTO
export class PromotionListResponseDto {
  @ApiProperty({ type: [PromotionResponseDto] })
  data: PromotionResponseDto[];

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
