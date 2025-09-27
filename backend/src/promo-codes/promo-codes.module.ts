import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PromoCodesController } from "./promo-codes.controller";
import { PromoCodesService } from "./promo-codes.service";
import { PromoCode, PromoCodeSchema } from "../schemas/promoCode.schema";
import { Promotion, PromotionSchema } from "../schemas/promotion.schema";
import { Store, StoreSchema } from "../schemas/store.schema";
import { User, UserSchema } from "../schemas/user.schema";
import { Transaction, TransactionSchema } from "../schemas/transaction.schema";
import { AuthModule } from "../auth/auth.module";
import { OtpModule } from "../otp/otp.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromoCode.name, schema: PromoCodeSchema },
      { name: Promotion.name, schema: PromotionSchema },
      { name: Store.name, schema: StoreSchema },
      { name: User.name, schema: UserSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    HttpModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>("JWT_SECRET");
        const expiresIn = configService.get<string>("JWT_EXPIRES_IN") || "7d";

        if (!secret) {
          throw new Error("متغیر محیطی JWT_SECRET الزامی است");
        }

        return {
          secret,
          signOptions: {
            expiresIn,
            issuer: "loyalty-api",
            audience: "loyalty-users",
          },
          verifyOptions: {
            issuer: "loyalty-api",
            audience: "loyalty-users",
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    OtpModule,
  ],
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
  exports: [PromoCodesService],
})
export class PromoCodesModule {}
