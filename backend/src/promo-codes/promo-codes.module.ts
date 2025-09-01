import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromoCodesController } from './promo-codes.controller';
import { PromoCodesService } from './promo-codes.service';
import { PromoCode, PromoCodeSchema } from '../schemas/promoCode.schema';
import { Promotion, PromotionSchema } from '../schemas/promotion.schema';
import { Store, StoreSchema } from '../schemas/store.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromoCode.name, schema: PromoCodeSchema },
      { name: Promotion.name, schema: PromotionSchema },
      { name: Store.name, schema: StoreSchema },
      { name: User.name, schema: UserSchema }
    ]),
  ],
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
  exports: [PromoCodesService],
})
export class PromoCodesModule {}
