import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import { Promotion, PromotionSchema } from '../schemas/promotion.schema';
import { Store, StoreSchema } from '../schemas/store.schema';
import { PromoCode, PromoCodeSchema } from '../schemas/promoCode.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Promotion.name, schema: PromotionSchema },
      { name: Store.name, schema: StoreSchema },
      { name: PromoCode.name, schema: PromoCodeSchema }
    ]),
  ],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export class PromotionsModule {}
