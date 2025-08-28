import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsObject, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SortDto {
  @ApiProperty({ description: 'Field name to sort by', example: 'createdAt' })
  @IsString()
  field: string;

  @ApiProperty({ description: 'Sort direction', enum: ['asc', 'desc'], example: 'desc' })
  @IsString()
  direction: 'asc' | 'desc';
}

export class FilterDto {
  @ApiProperty({ description: 'Field name to filter by', example: 'status' })
  @IsString()
  field: string;

  @ApiProperty({ description: 'Filter operator', enum: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'regex'], example: 'eq' })
  @IsString()
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'regex';

  @ApiProperty({ description: 'Filter value', example: 'active' })
  value: any;
}

export class ListRequestDto {
  @ApiProperty({ description: 'Page number (1-based)', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', example: 20, default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ description: 'Search term for text search across multiple fields', example: 'john', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Search fields to include in text search', example: ['firstName', 'lastName', 'phoneNumber'], required: false })
  @IsOptional()
  @IsString({ each: true })
  searchFields?: string[];

  @ApiProperty({ description: 'Sorting configuration', type: [SortDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SortDto)
  sort?: SortDto[];

  @ApiProperty({ description: 'Filtering configuration', type: [FilterDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FilterDto)
  filters?: FilterDto[];

  @ApiProperty({ description: 'Additional query parameters', required: false })
  @IsOptional()
  @IsObject()
  additionalParams?: Record<string, any>;
}

export class ListResponseDto<T> {
  @ApiProperty({ description: 'List of items' })
  data: T[];

  @ApiProperty({ description: 'Total number of items matching the query' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Whether there is a next page' })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Whether there is a previous page' })
  hasPrevPage: boolean;

  @ApiProperty({ description: 'Applied filters and search parameters' })
  appliedFilters: {
    search?: string;
    searchFields?: string[];
    sort?: SortDto[];
    filters?: FilterDto[];
  };
}
