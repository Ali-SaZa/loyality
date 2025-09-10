import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PromoCode, PromoCodeDocument } from "../../schemas/promoCode.schema";
import { Promotion, PromotionDocument } from "../../schemas/promotion.schema";
import { User, UserDocument } from "../../schemas/user.schema";
import { BaseSeeder } from "./base.seeder";

@Injectable()
export class PromoCodesSeeder extends BaseSeeder<PromoCodeDocument> {
  private promotions: PromotionDocument[] = [];
  private users: UserDocument[] = [];

  constructor(
    @InjectModel(PromoCode.name)
    private promoCodesModel: Model<PromoCodeDocument>,
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
      throw new Error("Promotions must be set before seeding promo codes");
    }

    if (this.users.length === 0) {
      throw new Error("Users must be set before seeding promo codes");
    }

    const now = new Date();
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Get the customer user (09123333333)
    const customerUser = this.users.find(
      (user) => user.phoneNumber === "09123333333",
    );

    if (!customerUser) {
      throw new Error("Customer user (09123333333) not found");
    }

    const promoCodes: any[] = [];

    // Generate exactly 5 promo codes per promotion (50 total)
    this.promotions.forEach((promotion, promotionIndex) => {
      for (let i = 0; i < 5; i++) {
        const code = `DORIS${String(promotionIndex + 1).padStart(2, "0")}${String(i + 1).padStart(2, "0")}`;

        promoCodes.push({
          code,
          promotionId: promotion._id,
          status: "unused",
          notes: `Generated promo code for ${promotion.title} - Buy ${promotion.price.toLocaleString()} Toman, Get ${promotion.points} Points`,
        });
      }
    });

    // Assign exactly 30 codes to the customer (15 used, 15 unused)
    const codesToAssign = promoCodes.slice(0, 30);

    codesToAssign.forEach((promoCode, index) => {
      promoCode.userId = customerUser._id;
      promoCode.registeredAt = new Date(
        now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ); // Random date within last week

      // First 15 codes are used, last 15 are unused
      if (index < 15) {
        promoCode.status = "used";
        promoCode.usedAt = new Date(
          promoCode.registeredAt.getTime() +
            Math.random() * 3 * 24 * 60 * 60 * 1000,
        ); // Used within 3 days of registration
      } else {
        promoCode.status = "unused";
      }
    });

    return promoCodes;
  }

  protected getData(): any[] {
    return this.data;
  }
}
