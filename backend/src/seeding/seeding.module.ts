import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedingService } from './seeding.service';
import { SeedingController } from './seeding.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { Store, StoreSchema } from '../schemas/store.schema';
import { Admin, AdminSchema } from '../schemas/admin.schema';
import { PromoCode, PromoCodeSchema } from '../schemas/promoCode.schema';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { Otp, OtpSchema } from '../schemas/otp.schema';
import { 
  StoresSeeder, 
  AdminsSeeder, 
  UsersSeeder, 
  ScratchCardsSeeder, 
  TransactionsSeeder, 
  OTPsSeeder 
} from './seeders';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Store.name, schema: StoreSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: PromoCode.name, schema: PromoCodeSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],
  providers: [
    SeedingService,
    StoresSeeder,
    AdminsSeeder,
    UsersSeeder,
    ScratchCardsSeeder,
    TransactionsSeeder,
    OTPsSeeder,
  ],
  controllers: [SeedingController],
  exports: [SeedingService],
})
export class SeedingModule {}
