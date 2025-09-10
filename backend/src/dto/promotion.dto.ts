import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsMongoId,
  Min,
  MaxLength,
} from "class-validator";

// Base DTO with common fields
export class BasePromotionDto {
  @ApiProperty({
    description: "Store ID this promotion belongs to",
    example: "507f1f77bcf86cd799439011",
  })
  @IsMongoId()
  storeId: string;

  @ApiProperty({ description: "Promotion title", maxLength: 100 })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: "Promotion description",
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: "Purchase amount in Toman", example: 100000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: "Points awarded for the purchase", example: 1 })
  @IsNumber()
  @Min(1)
  points: number;
}

// Create Promotion DTO
export class CreatePromotionDto extends BasePromotionDto {
  // All fields are required for creation
}

// Update Promotion DTO - allows partial updates
export class UpdatePromotionDto {
  @ApiProperty({
    description: "Promotion title",
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiProperty({
    description: "Promotion description",
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: "Purchase amount in Toman", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    description: "Points awarded for the purchase",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  points?: number;

  @ApiProperty({
    description: "Promotion status",
    enum: ["active", "inactive", "deleted", "expired"],
    required: false,
  })
  @IsOptional()
  @IsEnum(["active", "inactive", "deleted", "expired"])
  status?: string;
}

// Status Change DTO
export class ChangePromotionStatusDto {
  @ApiProperty({
    description: "New status for the promotion",
    enum: ["active", "inactive", "deleted", "expired"],
  })
  @IsEnum(["active", "inactive", "deleted", "expired"])
  status: string;
}

// Response DTOs
export class PromotionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  storeId: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  points: number;

  @ApiProperty({ enum: ["active", "inactive", "deleted", "expired"] })
  status: string;

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
