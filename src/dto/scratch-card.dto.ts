import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min, Matches } from 'class-validator';

export class CreateScratchCardDto {
  @ApiProperty({ description: '12-character alphanumeric code', example: 'ABCD12345678' })
  @IsString()
  @Matches(/^[A-Z0-9]{12}$/, { message: 'Code must be exactly 12 alphanumeric characters' })
  code: string;

  @ApiProperty({ description: 'Store ID' })
  @IsString()
  storeId: string;

  @ApiProperty({ description: 'Reward type', enum: ['discount', 'cashback', 'lottery'] })
  @IsEnum(['discount', 'cashback', 'lottery'])
  rewardType: 'discount' | 'cashback' | 'lottery';

  @ApiProperty({ description: 'Reward value (percentage for discount, amount for cashback)', minimum: 0 })
  @IsNumber()
  @Min(0)
  rewardValue: number;

  @ApiProperty({ description: 'QR URL for the scratch card' })
  @IsString()
  qrUrl: string;

  @ApiProperty({ description: 'Expiration date' })
  @IsDateString()
  expiresAt: string;
}

export class UseScratchCardDto {
  @ApiProperty({ description: 'Scratch card code' })
  @IsString()
  @Matches(/^[A-Z0-9]{12}$/)
  code: string;

  @ApiProperty({ description: 'User phone number' })
  @IsString()
  @Matches(/^09[0-9]{9}$/)
  phoneNumber: string;

  @ApiProperty({ description: 'Entry method', enum: ['sms', 'qr'] })
  @IsEnum(['sms', 'qr'])
  entryMethod: 'sms' | 'qr';
}

export class ScratchCardResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  storeId: string;

  @ApiProperty()
  status: 'unused' | 'used' | 'expired';

  @ApiProperty()
  userId?: string;

  @ApiProperty()
  reward: {
    type: 'discount' | 'cashback' | 'lottery';
    value: number;
  };

  @ApiProperty()
  entryMethod?: 'sms' | 'qr';

  @ApiProperty()
  qrUrl: string;

  @ApiProperty()
  usedAt?: Date;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
