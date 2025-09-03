import { IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Customer ID', example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  customerId: string;

  @ApiProperty({ description: 'Store ID', example: '507f1f77bcf86cd799439012' })
  @IsMongoId()
  storeId: string;

  @ApiProperty({ description: 'Promo code ID', example: '507f1f77bcf86cd799439013' })
  @IsMongoId()
  promoCodeId: string;

  @ApiProperty({ description: 'Promotion ID', example: '507f1f77bcf86cd799439014' })
  @IsMongoId()
  promotionId: string;
}

export class TransactionResponseDto {
  @ApiProperty({ description: 'Transaction ID' })
  id: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId: string;

  @ApiProperty({ description: 'Store ID' })
  storeId: string;

  @ApiProperty({ description: 'Promo code ID' })
  promoCodeId: string;

  @ApiProperty({ description: 'Promotion ID' })
  promotionId: string;

  @ApiProperty({ description: 'Transaction creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Transaction last update date' })
  updatedAt: Date;

  // Populated fields
  @ApiProperty({ description: 'Customer information (if populated)', required: false })
  customer?: {
    id: string;
    phoneNumber: string;
    firstName?: string;
    lastName?: string;
  };

  @ApiProperty({ description: 'Store information (if populated)', required: false })
  store?: {
    id: string;
    name: string;
    phoneNumber: string;
  };

  @ApiProperty({ description: 'Promo code information (if populated)', required: false })
  promoCode?: {
    id: string;
    code: string;
    status: string;
  };

  @ApiProperty({ description: 'Promotion information (if populated)', required: false })
  promotion?: {
    id: string;
    title: string;
    price: number;
    points: number;
  };
}

export class CustomerTransactionDto {
  @ApiProperty({ description: 'Customer ID' })
  id: string;

  @ApiProperty({ description: 'Customer phone number' })
  phoneNumber: string;

  @ApiProperty({ description: 'Customer first name', required: false })
  firstName?: string;

  @ApiProperty({ description: 'Customer last name', required: false })
  lastName?: string;

  @ApiProperty({ description: 'Customer status' })
  status: string;

  @ApiProperty({ description: 'Total number of transactions with this store' })
  totalTransactions: number;

  @ApiProperty({ description: 'Total amount spent at this store' })
  totalSpent: number;

  @ApiProperty({ description: 'Total points earned at this store' })
  totalPointsEarned: number;

  @ApiProperty({ description: 'Date of first transaction' })
  firstTransactionDate: Date;

  @ApiProperty({ description: 'Date of last transaction' })
  lastTransactionDate: Date;

  @ApiProperty({ description: 'Customer last activity' })
  lastActivity: Date;
}
