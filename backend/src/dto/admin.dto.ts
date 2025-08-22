import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum, Matches, MaxLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ description: 'Iranian mobile number', example: '09123456789' })
  @IsString()
  @Matches(/^09[0-9]{9}$/)
  phoneNumber: string;

  @ApiProperty({ description: 'Admin name', required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ 
    description: 'Admin permissions', 
    type: [String],
    enum: ['manage_stores', 'view_reports', 'run_lottery', 'manage_users']
  })
  @IsArray()
  @IsEnum(['manage_stores', 'view_reports', 'run_lottery', 'manage_users'], { each: true })
  permissions: Array<'manage_stores' | 'view_reports' | 'run_lottery' | 'manage_users'>;
}

export class UpdateAdminDto {
  @ApiProperty({ description: 'Admin name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ 
    description: 'Admin permissions', 
    required: false,
    type: [String],
    enum: ['manage_stores', 'view_reports', 'run_lottery', 'manage_users']
  })
  @IsOptional()
  @IsArray()
  @IsEnum(['manage_stores', 'view_reports', 'run_lottery', 'manage_users'], { each: true })
  permissions?: Array<'manage_stores' | 'view_reports' | 'run_lottery' | 'manage_users'>;
}

export class AdminResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ enum: ['admin'] })
  role: string;

  @ApiProperty({ 
    type: [String],
    enum: ['manage_stores', 'view_reports', 'run_lottery', 'manage_users']
  })
  permissions: Array<'manage_stores' | 'view_reports' | 'run_lottery' | 'manage_users'>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
