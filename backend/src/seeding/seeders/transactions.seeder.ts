import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Transaction,
  TransactionDocument,
} from "../../schemas/transaction.schema";
import { User, UserDocument } from "../../schemas/user.schema";
import { Store, StoreDocument } from "../../schemas/store.schema";
import { PromoCode, PromoCodeDocument } from "../../schemas/promoCode.schema";
import { Promotion, PromotionDocument } from "../../schemas/promotion.schema";
import { BaseSeeder } from "./base.seeder";

@Injectable()
export class TransactionsSeeder extends BaseSeeder<TransactionDocument> {
  private users: UserDocument[] = [];
  private stores: StoreDocument[] = [];
  private promoCodes: PromoCodeDocument[] = [];
  private promotions: PromotionDocument[] = [];

  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(PromoCode.name)
    private promoCodeModel: Model<PromoCodeDocument>,
    @InjectModel(Promotion.name)
    private promotionModel: Model<PromotionDocument>,
  ) {
    super();
  }

  protected get model(): Model<TransactionDocument> {
    return this.transactionModel;
  }

  protected get data(): any[] {
    if (this.users.length === 0) {
      throw new Error("Users must be set before seeding transactions");
    }
    if (this.stores.length === 0) {
      throw new Error("Stores must be set before seeding transactions");
    }
    if (this.promoCodes.length === 0) {
      throw new Error("Promo codes must be set before seeding transactions");
    }
    if (this.promotions.length === 0) {
      throw new Error("Promotions must be set before seeding transactions");
    }
    // Get the customer user (09051455365)
    const customerUser = this.users.find(
      (user) => user.phoneNumber === "09051455365",
    );

    if (!customerUser) {
      throw new Error("Customer user (09051455365) not found");
    }

    // Get Doris Accessories store
    const dorisStore = this.stores.find(
      (store) => store.phoneNumber === "09387114120",
    );

    if (!dorisStore) {
      throw new Error("Doris Accessories store (09387114120) not found");
    }

    // Get used promo codes for the customer (first 15 codes)
    const usedPromoCodes = this.promoCodes.filter(
      (promoCode) =>
        promoCode.status === "used" &&
        promoCode.userId &&
        promoCode.userId.toString() === customerUser._id.toString(),
    );

    const transactions: any[] = [];

    // Create transactions for the 15 used promo codes
    usedPromoCodes.forEach((promoCode) => {
      const promotion = this.promotions.find(
        (promotion) =>
          promotion._id.toString() === promoCode.promotionId.toString(),
      );

      if (promotion && promoCode.usedAt) {
        transactions.push({
          customerId: customerUser._id,
          storeId: dorisStore._id,
          promoCodeId: promoCode._id,
          promotionId: promotion._id,
          createdAt: promoCode.usedAt,
          updatedAt: promoCode.usedAt,
        });
      }
    });

    return transactions;
  }

  protected getData(): any[] {
    return this.data;
  }

  // Setter methods to be called by the main seeder
  setUsers(users: UserDocument[]): void {
    this.users = users;
  }

  setStores(stores: StoreDocument[]): void {
    this.stores = stores;
  }

  setPromoCodes(promoCodes: PromoCodeDocument[]): void {
    this.promoCodes = promoCodes;
  }

  setPromotions(promotions: PromotionDocument[]): void {
    this.promotions = promotions;
  }
}
