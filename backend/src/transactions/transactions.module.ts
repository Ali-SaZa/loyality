import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Store, StoreSchema } from '../schemas/store.schema';
import { PromoCode, PromoCodeSchema } from '../schemas/promoCode.schema';
import { Promotion, PromotionSchema } from '../schemas/promotion.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: User.name, schema: UserSchema },
      { name: Store.name, schema: StoreSchema },
      { name: PromoCode.name, schema: PromoCodeSchema },
      { name: Promotion.name, schema: PromotionSchema },
    ]),
    AuthModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
