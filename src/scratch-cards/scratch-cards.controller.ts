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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ScratchCardsService } from './scratch-cards.service';
import { CreateScratchCardDto, UpdateScratchCardDto, ScratchCardResponseDto } from '../dto';
import { ScratchCardNotFoundException } from '../common/errors';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { ScratchCardAuth, AdminAuth, StoreAuth, UserAuth } from '../common/security';

@ApiTags('scratch-cards')
@Controller('scratch-cards')
export class ScratchCardsController {
  constructor(private readonly scratchCardsService: ScratchCardsService) {}

  @Post()
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new scratch card (Admin/Store Owner only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Scratch card created successfully',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async create(@Body() createScratchCardDto: CreateScratchCardDto): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.create(createScratchCardDto);
  }

  @Get()
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all scratch cards (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all scratch cards',
    type: [ScratchCardResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findAll(): Promise<ScratchCardResponseDto[]> {
    return this.scratchCardsService.findAll();
  }

  @Get(':id')
  @ScratchCardAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get scratch card by ID (Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Scratch card ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Scratch card found',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Scratch card not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.findOne(id, user);
  }

  @Get('code/:code')
  @Public()
  @ApiOperation({ summary: 'Get scratch card by code (Public - for QR scanning)' })
  @ApiParam({ name: 'code', description: 'Scratch card code' })
  @ApiResponse({ 
    status: 200, 
    description: 'Scratch card found',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Scratch card not found' })
  async findByCode(@Param('code') code: string): Promise<ScratchCardResponseDto> {
    const card = await this.scratchCardsService.findByCode(code);
    if (!card) {
      throw new ScratchCardNotFoundException();
    }
    return card;
  }

  @Patch(':id')
  @ScratchCardAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update scratch card information (Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Scratch card ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Scratch card updated successfully',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Scratch card not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async update(
    @Param('id') id: string,
    @Body() updateScratchCardDto: UpdateScratchCardDto,
    @CurrentUser() user: any
  ): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.update(id, updateScratchCardDto, user);
  }

  @Patch(':id/status')
  @ScratchCardAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update scratch card status (Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Scratch card ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Status updated successfully',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Scratch card not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'unused' | 'used' | 'expired' },
    @CurrentUser() user: any
  ): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.updateStatus(id, body.status, user);
  }

  @Post(':id/use')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Use a scratch card (Authenticated user)' })
  @ApiParam({ name: 'id', description: 'Scratch card ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Scratch card used successfully',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Scratch card not found' })
  @ApiResponse({ status: 400, description: 'Scratch card not available or expired' })
  async useCard(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.useCard(id, user.userId);
  }

  @Delete(':id')
  @ScratchCardAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete scratch card (Owner/Admin only)' })
  @ApiParam({ name: 'id', description: 'Scratch card ID' })
  @ApiResponse({ status: 200, description: 'Scratch card deleted successfully' })
  @ApiResponse({ status: 404, description: 'Scratch card not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<void> {
    return this.scratchCardsService.remove(id, user);
  }

  @Get('store/:storeId')
  @StoreAuth({ paramName: 'storeId' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get scratch cards by store (Store Owner/Admin only)' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of scratch cards for the store',
    type: [ScratchCardResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findByStore(
    @Param('storeId') storeId: string,
    @CurrentUser() user: any
  ): Promise<ScratchCardResponseDto[]> {
    return this.scratchCardsService.findByStore(storeId, user);
  }

  @Get('user/:userId')
  @UserAuth({ paramName: 'userId' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get scratch cards by user (Self/Admin only)' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of scratch cards for the user',
    type: [ScratchCardResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findByUser(
    @Param('userId') userId: string,
    @CurrentUser() user: any
  ): Promise<ScratchCardResponseDto[]> {
    return this.scratchCardsService.findByUser(userId, user);
  }
}
