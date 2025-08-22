import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GlobalAuthGuard } from './guards/global-auth.guard';
import { OtpModule } from '../otp/otp.module';
import { UsersModule } from '../users/users.module';
import { AuthorizationService } from '../common/security/authorization.service';
import { ResourceAuthGuard } from '../common/security/resource-auth.guard';
import { Store, StoreSchema } from '../schemas/store.schema';

@Module({
  imports: [
    PassportModule.register({ 
      defaultStrategy: 'jwt',
      session: false, // Disable sessions for stateless JWT
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN') || '7d';
        
        if (!secret) {
          throw new Error('متغیر محیطی JWT_SECRET الزامی است'); // translated to Persian
        }
        
        return {
          secret,
          signOptions: {
            expiresIn,
            issuer: 'loyalty-api',
            audience: 'loyalty-users',
          },
          verifyOptions: {
            issuer: 'loyalty-api',
            audience: 'loyalty-users',
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Store.name, schema: StoreSchema }
    ]),
    OtpModule,
    UsersModule,
  ],
  providers: [
    AuthService, 
    JwtStrategy,
    GlobalAuthGuard,
    AuthorizationService,
    ResourceAuthGuard,
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, PassportModule, AuthorizationService, ResourceAuthGuard],
})
export class AuthModule {}
