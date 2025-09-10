import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { Store, StoreSchema } from '../schemas/store.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Sms, SmsSchema } from '../schemas/sms.schema';
import { SmsModule } from '../sms/sms.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Store.name, schema: StoreSchema },
      { name: User.name, schema: UserSchema },
      { name: Sms.name, schema: SmsSchema }
    ]),
    SmsModule,
    TransactionsModule,
  ],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
