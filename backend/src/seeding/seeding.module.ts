import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedingService } from './seeding.service';
import { SeedingController } from './seeding.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { Store, StoreSchema } from '../schemas/store.schema';
import { Promotion, PromotionSchema } from '../schemas/promotion.schema';
import { PromoCode, PromoCodeSchema } from '../schemas/promoCode.schema';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { Otp, OtpSchema } from '../schemas/otp.schema';
import { Sms, SmsSchema } from '../schemas/sms.schema';
import { 
  StoresSeeder, 
  UsersSeeder, 
  PromotionsSeeder,
  PromoCodesSeeder,
  TransactionsSeeder,
  OTPsSeeder,
  SmsSeeder
} from './seeders';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Store.name, schema: StoreSchema },
      { name: Promotion.name, schema: PromotionSchema },
      { name: PromoCode.name, schema: PromoCodeSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Sms.name, schema: SmsSchema },
    ]),
  ],
  providers: [
    SeedingService,
    StoresSeeder,
    UsersSeeder,
    PromotionsSeeder,
    PromoCodesSeeder,
    TransactionsSeeder,
    OTPsSeeder,
    SmsSeeder,
  ],
  controllers: [SeedingController],
  exports: [SeedingService],
})
export class SeedingModule {}
