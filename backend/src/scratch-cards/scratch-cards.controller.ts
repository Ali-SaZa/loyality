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
  @ApiOperation({ summary: 'ایجاد کارت تخفیف جدید (فقط مدیر/مالک فروشگاه)' })
  @ApiResponse({ 
    status: 201, 
    description: 'کارت تخفیف با موفقیت ایجاد شد',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 401, description: 'دسترسی غیرمجاز' })
  @ApiResponse({ status: 403, description: 'دسترسی ممنوع - دسترسی کافی نیست' })
  async create(@Body() createScratchCardDto: CreateScratchCardDto): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.create(createScratchCardDto);
  }

  @Get()
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت تمام کارت‌های تخفیف (فقط مدیر)' })
  @ApiResponse({ 
    status: 200, 
    description: 'لیست تمام کارت‌های تخفیف',
    type: [ScratchCardResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'دسترسی غیرمجاز' })
  @ApiResponse({ status: 403, description: 'دسترسی ممنوع - دسترسی مدیر الزامی است' })
  async findAll(): Promise<ScratchCardResponseDto[]> {
    return this.scratchCardsService.findAll();
  }

  @Get(':id')
  @ScratchCardAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت کارت تخفیف بر اساس شناسه (فقط مالک/مدیر)' })
  @ApiParam({ name: 'id', description: 'شناسه کارت تخفیف' })
  @ApiResponse({ 
    status: 200, 
    description: 'کارت تخفیف یافت شد',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 404, description: 'کارت تخفیف یافت نشد' })
  @ApiResponse({ status: 401, description: 'دسترسی غیرمجاز' })
  @ApiResponse({ status: 403, description: 'دسترسی ممنوع - دسترسی کافی نیست' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.findOne(id, user);
  }

  @Get('code/:code')
  @Public()
  @ApiOperation({ summary: 'دریافت کارت تخفیف بر اساس کد (عمومی - برای اسکن QR)' })
  @ApiParam({ name: 'code', description: 'کد کارت تخفیف' })
  @ApiResponse({ 
    status: 200, 
    description: 'کارت تخفیف یافت شد',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 404, description: 'کارت تخفیف یافت نشد' })
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
  @ApiOperation({ summary: 'به‌روزرسانی اطلاعات کارت تخفیف (فقط مالک/مدیر)' })
  @ApiParam({ name: 'id', description: 'شناسه کارت تخفیف' })
  @ApiResponse({ 
    status: 200, 
    description: 'کارت تخفیف با موفقیت به‌روزرسانی شد',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 404, description: 'کارت تخفیف یافت نشد' })
  @ApiResponse({ status: 401, description: 'دسترسی غیرمجاز' })
  @ApiResponse({ status: 403, description: 'دسترسی ممنوع - دسترسی کافی نیست' })
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
  @ApiOperation({ summary: 'به‌روزرسانی وضعیت کارت تخفیف (فقط مالک/مدیر)' })
  @ApiParam({ name: 'id', description: 'شناسه کارت تخفیف' })
  @ApiResponse({ 
    status: 200, 
    description: 'وضعیت با موفقیت به‌روزرسانی شد',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 404, description: 'کارت تخفیف یافت نشد' })
  @ApiResponse({ status: 401, description: 'دسترسی غیرمجاز' })
  @ApiResponse({ status: 403, description: 'دسترسی ممنوع - دسترسی کافی نیست' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'unused' | 'used' | 'expired' },
    @CurrentUser() user: any
  ): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.updateStatus(id, body.status, user);
  }

  @Post(':id/use')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'استفاده از کارت تخفیف (کاربر احراز هویت شده)' })
  @ApiParam({ name: 'id', description: 'شناسه کارت تخفیف' })
  @ApiResponse({ 
    status: 200, 
    description: 'کارت تخفیف با موفقیت استفاده شد',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 401, description: 'دسترسی غیرمجاز' })
  @ApiResponse({ status: 404, description: 'کارت تخفیف یافت نشد' })
  @ApiResponse({ status: 400, description: 'کارت تخفیف در دسترس نیست یا منقضی شده' })
  async useCard(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.useCard(id, user.userId);
  }

  @Delete(':id')
  @ScratchCardAuth({ paramName: 'id' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'حذف کارت تخفیف (فقط مالک/مدیر)' })
  @ApiParam({ name: 'id', description: 'شناسه کارت تخفیف' })
  @ApiResponse({ status: 200, description: 'کارت تخفیف با موفقیت حذف شد' })
  @ApiResponse({ status: 404, description: 'کارت تخفیف یافت نشد' })
  @ApiResponse({ status: 401, description: 'دسترسی غیرمجاز' })
  @ApiResponse({ status: 403, description: 'دسترسی ممنوع - دسترسی کافی نیست' })
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
  @ApiOperation({ summary: 'دریافت کارت‌های تخفیف بر اساس فروشگاه (فقط مالک فروشگاه/مدیر)' })
  @ApiParam({ name: 'storeId', description: 'شناسه فروشگاه' })
  @ApiResponse({ 
    status: 200, 
    description: 'لیست کارت‌های تخفیف برای فروشگاه',
    type: [ScratchCardResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'دسترسی غیرمجاز' })
  @ApiResponse({ status: 403, description: 'دسترسی ممنوع - دسترسی کافی نیست' })
  async findByStore(
    @Param('storeId') storeId: string,
    @CurrentUser() user: any
  ): Promise<ScratchCardResponseDto[]> {
    return this.scratchCardsService.findByStore(storeId, user);
  }

  @Get('user/:userId')
  @UserAuth({ paramName: 'userId' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت کارت‌های تخفیف بر اساس کاربر (خود/مدیر)' })
  @ApiParam({ name: 'userId', description: 'شناسه کاربر' })
  @ApiResponse({ 
    status: 200, 
    description: 'لیست کارت‌های تخفیف برای کاربر',
    type: [ScratchCardResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'دسترسی غیرمجاز' })
  @ApiResponse({ status: 403, description: 'دسترسی ممنوع - دسترسی کافی نیست' })
  async findByUser(
    @Param('userId') userId: string,
    @CurrentUser() user: any
  ): Promise<ScratchCardResponseDto[]> {
    return this.scratchCardsService.findByUser(userId, user);
  }

  @Post('register/:code')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ثبت نام کارت تخفیف بر اساس کد (فقط مشتری - برای اسکن QR)' })
  @ApiParam({ name: 'code', description: 'کد کارت تخفیف از QR' })
  @ApiResponse({ 
    status: 201, 
    description: 'کارت تخفیف با موفقیت ثبت نام کرد',
    type: ScratchCardResponseDto 
  })
  @ApiResponse({ status: 401, description: 'دسترسی غیرمجاز' })
  @ApiResponse({ status: 404, description: 'کارت تخفیف یافت نشد' })
  @ApiResponse({ status: 400, description: 'کارت تخفیف در دسترس نیست یا منقضی شده' })
  @HttpCode(HttpStatus.CREATED)
  async registerCard(
    @Param('code') code: string,
    @CurrentUser() user: any
  ): Promise<ScratchCardResponseDto> {
    return this.scratchCardsService.registerCard(code, user);
  }

  @Get('my-cards')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'دریافت کارت‌های تخفیف فعلی کاربر (فقط مشتری)' })
  @ApiResponse({ 
    status: 200, 
    description: 'لیست کارت‌های تخفیف کاربر',
    type: [ScratchCardResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'دسترسی غیرمجاز' })
  @ApiResponse({ status: 403, description: 'دسترسی ممنوع - فقط مشتری مجاز است' })
  async getMyCards(
    @CurrentUser() user: any
  ): Promise<ScratchCardResponseDto[]> {
    return this.scratchCardsService.findMyCards(user);
  }
}
