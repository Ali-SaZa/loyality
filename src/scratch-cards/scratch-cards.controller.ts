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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ScratchCardsService } from './scratch-cards.service';
import { CreateScratchCardDto, UpdateScratchCardDto, ScratchCardResponseDto } from '../dto';
import { ScratchCardNotFoundException } from '../common/errors';

@ApiTags('scratch-cards')
@Controller('scratch-cards')
export class ScratchCardsController {
  constructor(private readonly scratchCardsService: ScratchCardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new scratch card' })
  @ApiResponse({ 
    status: 201, 
    description: 'Scratch card created successfully',
    type: ScratchCardResponseDto 
  })
  async create(@Body() createScratchCardDto: CreateScratchCardDto): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.create(createScratchCardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all scratch cards' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all scratch cards',
    type: [ScratchCardResponseDto] 
  })
  async findAll(): Promise<ScratchCardResponseDto[]> {
    return this.scratchCardsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get scratch card by ID' })
  @ApiParam({ name: 'id', description: 'Scratch card ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Scratch card found',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Scratch card not found' })
  async findOne(@Param('id') id: string): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get scratch card by code' })
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
  @ApiOperation({ summary: 'Update scratch card information' })
  @ApiParam({ name: 'id', description: 'Scratch card ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Scratch card updated successfully',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Scratch card not found' })
  async update(
    @Param('id') id: string,
    @Body() updateScratchCardDto: UpdateScratchCardDto,
  ): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.update(id, updateScratchCardDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update scratch card status' })
  @ApiParam({ name: 'id', description: 'Scratch card ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Status updated successfully',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Scratch card not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'unused' | 'used' | 'expired' },
  ): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.updateStatus(id, body.status);
  }

  @Post(':id/use')
  @ApiOperation({ summary: 'Use a scratch card' })
  @ApiParam({ name: 'id', description: 'Scratch card ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Scratch card used successfully',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Scratch card not found' })
  @ApiResponse({ status: 400, description: 'Scratch card not available or expired' })
  async useCard(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.useCard(id, body.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete scratch card' })
  @ApiParam({ name: 'id', description: 'Scratch card ID' })
  @ApiResponse({ status: 200, description: 'Scratch card deleted successfully' })
  @ApiResponse({ status: 404, description: 'Scratch card not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<void> {
    return this.scratchCardsService.remove(id);
  }

  @Get('store/:storeId')
  @ApiOperation({ summary: 'Get scratch cards by store' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of scratch cards for the store',
    type: [ScratchCardResponseDto] 
  })
  async findByStore(@Param('storeId') storeId: string): Promise<ScratchCardResponseDto[]> {
    return this.scratchCardsService.findByStore(storeId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get scratch cards by user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of scratch cards for the user',
    type: [ScratchCardResponseDto] 
  })
  async findByUser(@Param('userId') userId: string): Promise<ScratchCardResponseDto[]> {
    return this.scratchCardsService.findByUser(userId);
  }
}
