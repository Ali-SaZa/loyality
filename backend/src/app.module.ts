import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { StoresModule } from "./stores/stores.module";
import { PromotionsModule } from "./promotions/promotions.module";
import { PromoCodesModule } from "./promo-codes/promo-codes.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { SmsModule } from "./sms/sms.module";
import { OtpModule } from "./otp/otp.module";
import { SeedingModule } from "./seeding/seeding.module";
import { AuthModule } from "./auth/auth.module";
import { RateLimiterMiddleware } from "./common/security/rate-limiter.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === "development" ? ".env.development" : ".env",
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || "mongodb://localhost:27017/loyalty",
      {
        connectionFactory: (connection) => {
          connection.on("connected", () => {
            console.log("✅ MongoDB connected successfully");
          });
          connection.on("error", (error) => {
            console.error("❌ MongoDB connection error:", error);
          });
          connection.on("disconnected", () => {
            console.log("⚠️ MongoDB disconnected");
          });
          return connection;
        },
      }
    ),
    UsersModule,
    StoresModule,
    PromotionsModule,
    PromoCodesModule,
    TransactionsModule,
    SmsModule,
    OtpModule,
    SeedingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
