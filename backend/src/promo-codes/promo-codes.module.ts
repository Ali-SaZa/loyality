import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromoCodesController } from './promo-codes.controller';
import { PromoCodesService } from './promo-codes.service';
import { PromoCode, PromoCodeSchema } from '../schemas/promoCode.schema';
import { Promotion, PromotionSchema } from '../schemas/promotion.schema';
import { Store, StoreSchema } from '../schemas/store.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { AuthModule } from '../auth/auth.module';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromoCode.name, schema: PromoCodeSchema },
      { name: Promotion.name, schema: PromotionSchema },
      { name: Store.name, schema: StoreSchema },
      { name: User.name, schema: UserSchema },
      { name: Transaction.name, schema: TransactionSchema }
    ]),
    AuthModule,
    OtpModule,
  ],
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
  exports: [PromoCodesService],
})
export class PromoCodesModule {}
