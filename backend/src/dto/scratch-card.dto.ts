import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsObject, IsMongoId } from 'class-validator';

export class CreateScratchCardDto {
  @ApiProperty({ description: 'Unique 12-character code', example: 'ABC123DEF456' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Store ID' })
  @IsMongoId()
  storeId: string;

  @ApiProperty({ description: 'Reward details' })
  @IsObject()
  reward: {
    type: 'discount' | 'cashback' | 'lottery';
    value: number;
  };

  @ApiProperty({ description: 'Entry method', enum: ['sms', 'qr'], required: false })
  @IsOptional()
  @IsEnum(['sms', 'qr'])
  entryMethod?: 'sms' | 'qr';

  @ApiProperty({ description: 'QR code URL' })
  @IsString()
  qrUrl: string;

  @ApiProperty({ description: 'Expiration date' })
  @IsDateString()
  expiresAt: string;
}

export class UpdateScratchCardDto {
  @ApiProperty({ description: 'Reward details', required: false })
  @IsOptional()
  @IsObject()
  reward?: {
    type?: 'discount' | 'cashback' | 'lottery';
    value?: number;
  };

  @ApiProperty({ description: 'Entry method', required: false })
  @IsOptional()
  @IsEnum(['sms', 'qr'])
  entryMethod?: 'sms' | 'qr';

  @ApiProperty({ description: 'QR code URL', required: false })
  @IsOptional()
  @IsString()
  qrUrl?: string;

  @ApiProperty({ description: 'Expiration date', required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class UseScratchCardDto {
  @ApiProperty({ description: 'User ID' })
  @IsMongoId()
  userId: string;
}

export class ScratchCardResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  storeId: string;

  @ApiProperty({ enum: ['unused', 'used', 'expired'] })
  status: 'unused' | 'used' | 'expired';

  @ApiProperty({ required: false })
  userId?: string;

  @ApiProperty()
  reward: {
    type: 'discount' | 'cashback' | 'lottery';
    value: number;
  };

  @ApiProperty({ enum: ['sms', 'qr'], required: false })
  entryMethod?: 'sms' | 'qr';

  @ApiProperty()
  qrUrl: string;

  @ApiProperty({ required: false })
  usedAt?: Date;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
