import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PromoCode, PromoCodeDocument } from '../../schemas/promoCode.schema';
import { Promotion, PromotionDocument } from '../../schemas/promotion.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class PromoCodesSeeder extends BaseSeeder<PromoCodeDocument> {
  private promotions: PromotionDocument[] = [];
  private users: UserDocument[] = [];

  constructor(
    @InjectModel(PromoCode.name) private promoCodesModel: Model<PromoCodeDocument>
  ) {
    super();
  }

  setPromotions(promotions: PromotionDocument[]) {
    this.promotions = promotions;
  }

  setUsers(users: UserDocument[]) {
    this.users = users;
  }

  protected get model(): Model<PromoCodeDocument> {
    return this.promoCodesModel;
  }

  protected get data(): any[] {
    if (this.promotions.length === 0) {
      throw new Error('Promotions must be set before seeding promo codes');
    }

    if (this.users.length === 0) {
      throw new Error('Users must be set before seeding promo codes');
    }

    const now = new Date();
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Find coupon promotions
    const couponPromotions = this.promotions.filter(promo => promo.type === 'coupon');
    const customerUsers = this.users.filter(user => user.role === 'customer');

    const promoCodes: any[] = [];

    // Generate promo codes for coupon promotions
    couponPromotions.forEach((promotion, index) => {
      // Generate 5 promo codes per coupon promotion
      for (let i = 0; i < 5; i++) {
        const code = `${promotion.code}${String(i + 1).padStart(2, '0')}`;
        const isRegistered = Math.random() > 0.3; // 70% chance of being registered
        const isUsed = isRegistered && Math.random() > 0.5; // 50% chance of being used if registered

        let userId: Types.ObjectId | undefined = undefined;
        let registeredAt: Date | undefined = undefined;
        let usedAt: Date | undefined = undefined;
        let status = 'unused';

        if (isRegistered && customerUsers.length > 0) {
          userId = customerUsers[Math.floor(Math.random() * customerUsers.length)]._id;
          registeredAt = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Random date within last week
          status = 'unused';

          if (isUsed && registeredAt) {
            usedAt = new Date(registeredAt.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000); // Used within 3 days of registration
            status = 'used';
          }
        }

        promoCodes.push({
          code,
          promotionId: promotion._id,
          status,
          userId,
          registeredAt,
          usedAt,
          notes: `Generated promo code for ${promotion.title}`
        });
      }
    });

    // Generate additional standalone promo codes for other promotion types
    const otherPromotions = this.promotions.filter(promo => promo.type !== 'coupon');
    
    otherPromotions.forEach((promotion, index) => {
      // Generate 3 promo codes per other promotion type
      for (let i = 0; i < 3; i++) {
        const code = `${promotion.type.toUpperCase().substring(0, 4)}${String(index + 1).padStart(2, '0')}${String(i + 1).padStart(2, '0')}`;
        const isRegistered = Math.random() > 0.4; // 60% chance of being registered
        const isUsed = isRegistered && Math.random() > 0.6; // 40% chance of being used if registered

        let userId: Types.ObjectId | undefined = undefined;
        let registeredAt: Date | undefined = undefined;
        let usedAt: Date | undefined = undefined;
        let status = 'unused';

        if (isRegistered && customerUsers.length > 0) {
          userId = customerUsers[Math.floor(Math.random() * customerUsers.length)]._id;
          registeredAt = new Date(now.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000); // Random date within last 10 days
          status = 'unused';

          if (isUsed && registeredAt) {
            usedAt = new Date(registeredAt.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000); // Used within 5 days of registration
            status = 'used';
          }
        }

        promoCodes.push({
          code,
          promotionId: promotion._id,
          status,
          userId,
          registeredAt,
          usedAt,
          notes: `Generated promo code for ${promotion.title}`
        });
      }
    });

    // Add some special promo codes
    const specialCodes: any[] = [
      {
        code: 'WELCOME10',
        promotionId: this.promotions[0]._id, // First promotion
        status: 'unused',
        notes: 'Welcome bonus code for new customers'
      },
      {
        code: 'VIP2024',
        promotionId: this.promotions[1]._id, // Second promotion
        status: 'unused',
        notes: 'VIP customer exclusive code'
      },
      {
        code: 'SUMMER50',
        promotionId: this.promotions[2]._id, // Third promotion
        status: 'unused',
        notes: 'Summer special promotion code'
      }
    ];

    // Register some special codes to users
    specialCodes.forEach((specialCode, index) => {
      if (customerUsers.length > 0 && index < customerUsers.length) {
        specialCode.userId = customerUsers[index]._id;
        specialCode.registeredAt = new Date(now.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000);
      }
    });

    promoCodes.push(...specialCodes);

    return promoCodes;
  }

  protected getData(): any[] {
    return this.data;
  }
}
