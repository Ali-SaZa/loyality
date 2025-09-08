import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Iranian mobile number', example: '09123456789' })
  @IsString()
  @Matches(/^09[0-9]{9}$/)
  phoneNumber: string;

  @ApiProperty({ description: 'User first name', required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiProperty({ description: 'User last name', required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;


}

export class CreateCustomerDto {
  @ApiProperty({ 
    description: 'Customer phone number', 
    example: '09123456789',
    pattern: '^09[0-9]{9}$'
  })
  @IsString()
  @Matches(/^09[0-9]{9}$/, { 
    message: 'Phone number must be in format 09xxxxxxxxx' 
  })
  phoneNumber: string;

  @ApiProperty({ 
    description: 'Customer first name', 
    required: false,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiProperty({ 
    description: 'Customer last name', 
    required: false,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;
}

export class CustomerResponseDto {
  @ApiProperty({ description: 'Customer ID' })
  id: string;

  @ApiProperty({ description: 'Error message if customer already exists', required: false })
  error?: string;

  @ApiProperty({ description: 'Whether customer is already in this store', required: false })
  isAlreadyInStore?: boolean;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'User first name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiProperty({ description: 'User last name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;


}



export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;





  @ApiProperty()
  role: string;

  @ApiProperty({ enum: ['active', 'blocked', 'deleted'] })
  status: string;

  @ApiProperty()
  lastActivity: Date;

  @ApiProperty({ description: 'Store name (for store users)', required: false })
  storeName?: string;

  @ApiProperty({ description: 'Store address (for store users)', required: false })
  address?: string;

  @ApiProperty({ description: 'Store description (for store users)', required: false })
  description?: string;



  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
