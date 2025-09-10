import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { Sms, SmsSchema } from '../schemas/sms.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sms.name, schema: SmsSchema }]),
  ],
  controllers: [SmsController],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
