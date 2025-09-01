import { Controller, Post, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SeedingService } from './seeding.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Database Seeding')
@Controller('seeding')
export class SeedingController {
  constructor(private readonly seedingService: SeedingService) {}

  @Public()
  @Post('seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Seed database with sample data',
    description: 'Populates the database with realistic sample data for development and testing purposes. This will clear existing data in development mode.'
  })
  @ApiQuery({
    name: 'environment',
    required: false,
    enum: ['development', 'production'],
    description: 'Environment type for seeding (defaults to development)',
    example: 'development'
  })
  @ApiResponse({
    status: 200,
    description: 'Database seeded successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Database seeded successfully' },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Seeding failed',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Seeding failed' },
        error: { type: 'string' }
      }
    }
  })
  async seedDatabase(
    @Query('environment') environment: 'development' | 'production' = 'development'
  ) {
    await this.seedingService.seedAll(environment);
    
    return {
      message: 'Database seeded successfully',
      timestamp: new Date().toISOString(),
      environment
    };
  }

  @Post('seed/stores')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Seed stores collection only',
    description: 'Populates only the stores collection with sample data'
  })
  async seedStoresOnly() {
    const stores = await this.seedingService.seedStoresOnly();
    
    return {
      message: 'Stores seeded successfully',
      count: stores.length,
      timestamp: new Date().toISOString()
    };
  }

  @Post('seed/admins')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Seed admins collection only',
    description: 'Populates only the admins collection with sample data'
  })
  async seedAdminsOnly() {
    const admins = await this.seedingService.seedAdminsOnly();
    
    return {
      message: 'Admins seeded successfully',
      count: admins.length,
      timestamp: new Date().toISOString()
    };
  }

  @Post('seed/users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Seed users collection only',
    description: 'Populates only the users collection with sample data. Requires stores to exist first.'
  })
  async seedUsersOnly() {
    // Note: This would need to fetch existing stores first in a real implementation
    // For now, we'll return an error message
    return {
      message: 'Users seeding requires existing stores. Use /seeding/seed for complete seeding.',
      timestamp: new Date().toISOString()
    };
  }

  @Post('clear')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Clear all database data',
    description: 'Removes all data from all collections. Use with caution!'
  })
  @ApiResponse({
    status: 200,
    description: 'All data cleared successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'All data cleared successfully' },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  })
  async clearDatabase() {
    await this.seedingService.clearAllData();
    
    return {
      message: 'All data cleared successfully',
      timestamp: new Date().toISOString()
    };
  }

  @Get('status')
  @ApiOperation({
    summary: 'Get database seeding status',
    description: 'Returns the current count of documents in each collection'
  })
  @ApiResponse({
    status: 200,
    description: 'Database status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        users: { type: 'number', description: 'Number of users' },
        stores: { type: 'number', description: 'Number of stores' },
        admins: { type: 'number', description: 'Number of admins' },

        otps: { type: 'number', description: 'Number of OTPs' },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  })
  async getSeedingStatus() {
    const status = await this.seedingService.getSeedingStatus();
    
    return {
      ...status,
      timestamp: new Date().toISOString()
    };
  }
}
