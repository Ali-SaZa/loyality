import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { ScratchCardsModule } from './scratch-cards/scratch-cards.module';
import { OtpModule } from './otp/otp.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AdminsModule } from './admins/admins.module';
import { SeedingModule } from './seeding/seeding.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/loyalty'),
    UsersModule,
    StoresModule,
    ScratchCardsModule,
    OtpModule,
    TransactionsModule,
    AdminsModule,
    SeedingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
