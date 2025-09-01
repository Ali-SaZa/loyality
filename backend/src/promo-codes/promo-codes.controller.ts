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
import { PromotionAuth, AdminAuth } from '../common/security';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ListRequestDto } from '../common/dto/list.dto';

@ApiTags('promo-codes')
@Controller('promo-codes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Post()
  @PromotionAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new promo code' })
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
  @PromotionAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create multiple promo codes at once' })
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
  @PromotionAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all promo codes with pagination and filtering' })
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
  @PromotionAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get promo code statistics' })
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
        expired: { type: 'number' }
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
    expired: number;
  }> {
    return this.promoCodesService.getStats(promotionId, user);
  }

  @Get(':id')
  @PromotionAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific promo code by ID' })
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
  @PromotionAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a promo code' })
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
  @PromotionAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update promo code status (used, expired, etc.)' })
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate a promo code for store use' })
  @ApiResponse({ 
    status: 200, 
    description: 'Validation result',
    type: PromoCodeValidationResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async validateCode(
    @Body() validateDto: ValidatePromoCodeDto
  ): Promise<PromoCodeValidationResponseDto> {
    return this.promoCodesService.validateCode(validateDto);
  }

  @Delete(':id')
  @PromotionAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a promo code' })
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
