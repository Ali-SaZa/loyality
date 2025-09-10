import { Injectable, Logger } from "@nestjs/common";
import {
  StoresSeeder,
  UsersSeeder,
  PromotionsSeeder,
  PromoCodesSeeder,
  TransactionsSeeder,
  OTPsSeeder,
  SmsSeeder,
} from "./seeders";

@Injectable()
export class SeedingService {
  private readonly logger = new Logger(SeedingService.name);

  constructor(
    private readonly storesSeeder: StoresSeeder,
    private readonly usersSeeder: UsersSeeder,
    private readonly promotionsSeeder: PromotionsSeeder,
    private readonly promoCodesSeeder: PromoCodesSeeder,
    private readonly transactionsSeeder: TransactionsSeeder,
    private readonly otpsSeeder: OTPsSeeder,
    private readonly smsSeeder: SmsSeeder,
  ) {}

  async seedAll(
    environment: "development" | "production" = "development",
  ): Promise<void> {
    this.logger.log(`Starting seeding for ${environment} environment...`);

    try {
      // Clear existing data if development
      if (environment === "development") {
        await this.clearAllData();
      }

      // Seed in order to maintain referential integrity
      const users = await this.seedUsers([]); // Pass empty array since stores are created after users
      const stores = await this.seedStores(users);
      const promotions = await this.seedPromotions(stores);
      const promoCodes = await this.seedPromoCodes(promotions, users);
      const transactions = await this.seedTransactions(
        users,
        stores,
        promoCodes,
        promotions,
      );
      await this.seedOTPs(users);
      await this.seedSMS(users);

      this.logger.log(
        `Seeding completed successfully for ${environment} environment`,
      );
      this.logger.log(
        `Created: ${users.length} users, ${stores.length} stores, ${promotions.length} promotions, ${promoCodes.length} promo codes, ${transactions.length} transactions`,
      );
    } catch (error) {
      this.logger.error("Seeding failed:", error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    this.logger.log("Clearing all existing data...");

    await Promise.all([
      this.transactionsSeeder.clear(),
      this.promoCodesSeeder.clear(),
      this.promotionsSeeder.clear(),
      this.storesSeeder.clear(),
      this.usersSeeder.clear(),
      this.otpsSeeder.clear(),
      this.smsSeeder.clear(),
    ]);

    this.logger.log("All data cleared successfully");
  }

  private async seedStores(users: any[]) {
    this.storesSeeder.setUsers(users);
    return this.storesSeeder.seed();
  }

  private async seedPromotions(stores: any[]) {
    this.promotionsSeeder.setStores(stores);
    return this.promotionsSeeder.seed();
  }

  private async seedPromoCodes(promotions: any[], users: any[]) {
    this.promoCodesSeeder.setPromotions(promotions);
    this.promoCodesSeeder.setUsers(users);
    return this.promoCodesSeeder.seed();
  }

  private async seedTransactions(
    users: any[],
    stores: any[],
    promoCodes: any[],
    promotions: any[],
  ) {
    this.transactionsSeeder.setUsers(users);
    this.transactionsSeeder.setStores(stores);
    this.transactionsSeeder.setPromoCodes(promoCodes);
    this.transactionsSeeder.setPromotions(promotions);
    return this.transactionsSeeder.seed();
  }

  private async seedUsers(stores: any[]) {
    // Users are created without stores now
    return this.usersSeeder.seed();
  }

  private async seedOTPs(users: any[]) {
    this.otpsSeeder.setUsers(users);
    return this.otpsSeeder.seed();
  }

  async getSeedingStatus(): Promise<{
    users: number;
    stores: number;
    promotions: number;
    promoCodes: number;
    transactions: number;
    otps: number;
    sms: number;
  }> {
    const [users, stores, promotions, promoCodes, transactions, otps, sms] =
      await Promise.all([
        this.usersSeeder.count(),
        this.storesSeeder.count(),
        this.promotionsSeeder.count(),
        this.promoCodesSeeder.count(),
        this.transactionsSeeder.count(),
        this.otpsSeeder.count(),
        this.smsSeeder.count(),
      ]);

    return { users, stores, promotions, promoCodes, transactions, otps, sms };
  }

  private async seedSMS(users: any[]) {
    this.smsSeeder.setUsers(users);
    return this.smsSeeder.seed();
  }

  // Individual seeding methods for flexibility
  async seedStoresOnly(): Promise<any[]> {
    return this.storesSeeder.seed();
  }

  async seedPromotionsOnly(stores: any[]): Promise<any[]> {
    this.promotionsSeeder.setStores(stores);
    return this.promotionsSeeder.seed();
  }

  async seedPromoCodesOnly(promotions: any[], users: any[]): Promise<any[]> {
    this.promoCodesSeeder.setPromotions(promotions);
    this.promoCodesSeeder.setUsers(users);
    return this.promoCodesSeeder.seed();
  }

  async seedTransactionsOnly(
    users: any[],
    stores: any[],
    promoCodes: any[],
    promotions: any[],
  ): Promise<any[]> {
    this.transactionsSeeder.setUsers(users);
    this.transactionsSeeder.setStores(stores);
    this.transactionsSeeder.setPromoCodes(promoCodes);
    this.transactionsSeeder.setPromotions(promotions);
    return this.transactionsSeeder.seed();
  }

  async seedUsersOnly(stores: any[]): Promise<any[]> {
    // Users are created without stores now
    return this.usersSeeder.seed();
  }

  async seedOTPsOnly(users: any[]): Promise<any[]> {
    this.otpsSeeder.setUsers(users);
    return this.otpsSeeder.seed();
  }

  async seedSMSOnly(users: any[]): Promise<any[]> {
    this.smsSeeder.setUsers(users);
    return this.smsSeeder.seed();
  }
}
