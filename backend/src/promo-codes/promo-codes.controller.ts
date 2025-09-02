import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PromoCodesService } from './promo-codes.service';
import { 
  CreatePromoCodeDto, 
  UpdatePromoCodeDto, 
  ChangePromoCodeStatusDto,
  ValidatePromoCodeDto,
  PromoCodeResponseDto,
  PromoCodeValidationResponseDto,
  BulkCreatePromoCodesDto,
  PromoCodeListResponseDto,
  RegisterPromoCodeDto,
  GetUserPromoCodesDto
} from '../dto';
import { PromotionAuth, AdminAuth, PromoCodeAuth } from '../common/security';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ListRequestDto } from '../common/dto/list.dto';

@ApiTags('promo-codes')
@Controller('promo-codes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Post()
  @PromoCodeAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new promo code (Store/Admin only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Promo code created successfully',
    type: PromoCodeResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Promo code already exists' })
  async create(
    @Body() createPromoCodeDto: CreatePromoCodeDto,
    @CurrentUser() user: any
  ): Promise<PromoCodeResponseDto> {
    return this.promoCodesService.create(createPromoCodeDto, user);
  }

  @Post('bulk')
  @PromoCodeAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create multiple promo codes at once (Store/Admin only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Promo codes created successfully',
    type: [PromoCodeResponseDto]
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async bulkCreate(
    @Body() bulkCreateDto: BulkCreatePromoCodesDto,
    @CurrentUser() user: any
  ): Promise<PromoCodeResponseDto[]> {
    return this.promoCodesService.bulkCreate(bulkCreateDto, user);
  }

  @Get()
  @PromoCodeAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all promo codes with pagination and filtering (Store/Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Promo codes retrieved successfully',
    type: PromoCodeListResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query() listRequest: ListRequestDto,
    @CurrentUser() user: any
  ): Promise<PromoCodeListResponseDto> {
    return this.promoCodesService.findAll(listRequest, user);
  }

  @Get('stats')
  @PromoCodeAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get promo code statistics (Store/Admin only)' })
  @ApiQuery({ name: 'promotionId', required: false, description: 'Filter by specific promotion ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        unused: { type: 'number' },
        used: { type: 'number' },
        registered: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStats(
    @Query('promotionId') promotionId?: string,
    @CurrentUser() user?: any
  ): Promise<{
    total: number;
    unused: number;
    used: number;
    registered: number;
  }> {
    return this.promoCodesService.getStats(promotionId, user);
  }

  @Get(':id')
  @PromoCodeAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific promo code by ID (Store/Admin only)' })
  @ApiParam({ name: 'id', description: 'Promo code ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Promo code found',
    type: PromoCodeResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<PromoCodeResponseDto> {
    return this.promoCodesService.findOne(id, user);
  }

  @Patch(':id')
  @PromoCodeAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a promo code (Store/Admin only)' })
  @ApiParam({ name: 'id', description: 'Promo code ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Promo code updated successfully',
    type: PromoCodeResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updatePromoCodeDto: UpdatePromoCodeDto,
    @CurrentUser() user: any
  ): Promise<PromoCodeResponseDto> {
    return this.promoCodesService.update(id, updatePromoCodeDto, user);
  }

  @Patch(':id/status')
  @PromoCodeAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update promo code status (Store/Admin only)' })
  @ApiParam({ name: 'id', description: 'Promo code ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Promo code status updated successfully',
    type: PromoCodeResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangePromoCodeStatusDto,
    @CurrentUser() user: any
  ): Promise<PromoCodeResponseDto> {
    return this.promoCodesService.updateStatus(id, changeStatusDto, user);
  }

  @Post('validate')
  @PromoCodeAuth()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate a promo code for store use (Store/Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Validation result',
    type: PromoCodeValidationResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async validateCode(
    @Body() validateDto: ValidatePromoCodeDto,
    @CurrentUser() user: any
  ): Promise<PromoCodeValidationResponseDto> {
    return this.promoCodesService.validateCode(validateDto, user);
  }

  @Post('register')
  @PromoCodeAuth()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register a promo code to a user (Customer only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Promo code registered successfully',
    type: PromoCodeResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Promo code or user not found' })
  async registerCodeToUser(
    @Body() registerDto: RegisterPromoCodeDto,
    @CurrentUser() user: any
  ): Promise<PromoCodeResponseDto> {
    // Ensure customer can only register codes to their own phone number
    if (user.role !== 'customer' || user.phoneNumber !== registerDto.phoneNumber) {
      throw new ForbiddenException('You can only register codes to your own phone number');
    }
    return this.promoCodesService.registerCodeToUser(registerDto.code, registerDto.phoneNumber);
  }

  @Get('user/:phoneNumber')
  @PromoCodeAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all promo codes registered to a user by phone number (Store/Admin only)' })
  @ApiParam({ name: 'phoneNumber', description: 'User phone number' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by specific store ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User promo codes retrieved successfully',
    type: [PromoCodeResponseDto]
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getUserPromoCodes(
    @Param('phoneNumber') phoneNumber: string,
    @Query('storeId') storeId?: string,
    @CurrentUser() user?: any
  ): Promise<PromoCodeResponseDto[]> {
    return this.promoCodesService.getUserPromoCodes(phoneNumber, storeId, user);
  }

  @Get('promotion/:promotionId')
  @PromoCodeAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all promo codes for a specific promotion (Store/Admin only)' })
  @ApiParam({ name: 'promotionId', description: 'Promotion ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Promo codes for promotion retrieved successfully',
    type: PromoCodeListResponseDto
  })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getPromoCodesByPromotion(
    @Param('promotionId') promotionId: string,
    @Query() query: any,
    @CurrentUser() user: any
  ): Promise<PromoCodeListResponseDto> {
    const request: ListRequestDto = {
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 20,
      search: query.search,
      searchFields: query.searchFields ? query.searchFields.split(',') : ['code', 'notes'],
      sort: query.sort ? JSON.parse(query.sort) : [],
      filters: query.filters ? JSON.parse(query.filters) : {}
    };

    // Add promotion filter
    const additionalFilters = { promotionId };
    
    return this.promoCodesService.findAll(request, user, additionalFilters);
  }

  @Get('my-codes')
  @PromoCodeAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user\'s promo codes (Customer only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'User\'s promo codes retrieved successfully',
    type: [PromoCodeResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getMyPromoCodes(
    @CurrentUser() user: any
  ): Promise<PromoCodeResponseDto[]> {
    if (user.role !== 'customer') {
      throw new ForbiddenException('Only customers can access their own promo codes');
    }
    return this.promoCodesService.getUserPromoCodes(user.phoneNumber, undefined, user);
  }

  @Delete(':id')
  @PromoCodeAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a promo code (Store/Admin only)' })
  @ApiParam({ name: 'id', description: 'Promo code ID' })
  @ApiResponse({ status: 204, description: 'Promo code deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<void> {
    return this.promoCodesService.remove(id, user);
  }
}
