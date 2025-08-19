import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsMongoId, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ description: 'User ID' })
  @IsMongoId()
  userId: string;

  @ApiProperty({ description: 'Store ID' })
  @IsMongoId()
  storeId: string;

  @ApiProperty({ description: 'Transaction type', enum: ['purchase', 'cashback', 'lottery'] })
  @IsEnum(['purchase', 'cashback', 'lottery'])
  type: 'purchase' | 'cashback' | 'lottery';

  @ApiProperty({ description: 'Amount in IRR', minimum: 0 })
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

  @ApiProperty({ description: 'Transaction description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateTransactionDto {
  @ApiProperty({ description: 'Transaction type', required: false })
  @IsOptional()
  @IsEnum(['purchase', 'cashback', 'lottery'])
  type?: 'purchase' | 'cashback' | 'lottery';

  @ApiProperty({ description: 'Amount in IRR', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiProperty({ description: 'Scratch card code', required: false })
  @IsOptional()
  @IsString()
  scratchCode?: string;

  @ApiProperty({ description: 'Entry method', required: false })
  @IsOptional()
  @IsEnum(['sms', 'qr'])
  entryMethod?: 'sms' | 'qr';

  @ApiProperty({ description: 'Transaction description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class TransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  storeId: string;

  @ApiProperty({ enum: ['purchase', 'cashback', 'lottery'] })
  type: 'purchase' | 'cashback' | 'lottery';

  @ApiProperty()
  amount: number;

  @ApiProperty({ required: false })
  scratchCode?: string;

  @ApiProperty({ enum: ['sms', 'qr'] })
  entryMethod: 'sms' | 'qr';

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
