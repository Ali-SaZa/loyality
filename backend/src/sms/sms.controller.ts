import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { SmsService, SendSmsDto } from './sms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sms')
@UseGuards(JwtAuthGuard)
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  async sendSms(@Body() sendSmsDto: SendSmsDto) {
    return this.smsService.sendSms(sendSmsDto);
  }

  @Get()
  async findAll() {
    return this.smsService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.smsService.getSmsStats();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.smsService.findById(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.smsService.findByUserId(userId);
  }
}
