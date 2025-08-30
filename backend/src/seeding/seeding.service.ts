import { Injectable, Logger } from '@nestjs/common';
import { 
  StoresSeeder, 
  AdminsSeeder, 
  UsersSeeder, 
  ScratchCardsSeeder, 
  TransactionsSeeder, 
  OTPsSeeder 
} from './seeders';

@Injectable()
export class SeedingService {
  private readonly logger = new Logger(SeedingService.name);

  constructor(
    private readonly storesSeeder: StoresSeeder,
    private readonly adminsSeeder: AdminsSeeder,
    private readonly usersSeeder: UsersSeeder,
    private readonly scratchCardsSeeder: ScratchCardsSeeder,
    private readonly transactionsSeeder: TransactionsSeeder,
    private readonly otpsSeeder: OTPsSeeder,
  ) {}

  async seedAll(environment: 'development' | 'production' = 'development'): Promise<void> {
    this.logger.log(`Starting seeding for ${environment} environment...`);

    try {
      // Clear existing data if development
      if (environment === 'development') {
        await this.clearAllData();
      }

      // Seed in order to maintain referential integrity
      const admins = await this.seedAdmins();
      const users = await this.seedUsers([]); // Pass empty array since stores are created after users
      const stores = await this.seedStores(users);
      const scratchCards = await this.seedScratchCards(stores, users);
      const transactions = await this.seedTransactions(stores, users, scratchCards);
      await this.seedOTPs(users);

      this.logger.log(`Seeding completed successfully for ${environment} environment`);
      this.logger.log(`Created: ${stores.length} stores, ${admins.length} admins, ${users.length} users, ${scratchCards.length} scratch cards, ${transactions.length} transactions`);
    } catch (error) {
      this.logger.error('Seeding failed:', error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    this.logger.log('Clearing all existing data...');
    
    await Promise.all([
      this.storesSeeder.clear(),
      this.adminsSeeder.clear(),
      this.usersSeeder.clear(),
      this.scratchCardsSeeder.clear(),
      this.transactionsSeeder.clear(),
      this.otpsSeeder.clear(),
    ]);
    
    this.logger.log('All data cleared successfully');
  }

  private async seedStores(users: any[]) {
    this.storesSeeder.setUsers(users);
    return this.storesSeeder.seed();
  }

  private async seedAdmins() {
    return this.adminsSeeder.seed();
  }

  private async seedUsers(stores: any[]) {
    // Users are created without stores now
    return this.usersSeeder.seed();
  }

  private async seedScratchCards(stores: any[], users: any[]) {
    this.scratchCardsSeeder.setDependencies(stores, users);
    return this.scratchCardsSeeder.seed();
  }

  private async seedTransactions(stores: any[], users: any[], scratchCards: any[]) {
    this.transactionsSeeder.setDependencies(stores, users, scratchCards);
    return this.transactionsSeeder.seed();
  }

  private async seedOTPs(users: any[]) {
    this.otpsSeeder.setUsers(users);
    return this.otpsSeeder.seed();
  }

  async getSeedingStatus(): Promise<{
    users: number;
    stores: number;
    admins: number;
    scratchCards: number;
    transactions: number;
    otps: number;
  }> {
    const [users, stores, admins, scratchCards, transactions, otps] = await Promise.all([
      this.usersSeeder.count(),
      this.storesSeeder.count(),
      this.adminsSeeder.count(),
      this.scratchCardsSeeder.count(),
      this.transactionsSeeder.count(),
      this.otpsSeeder.count(),
    ]);

    return { users, stores, admins, scratchCards, transactions, otps };
  }

  // Individual seeding methods for flexibility
  async seedStoresOnly(): Promise<any[]> {
    return this.storesSeeder.seed();
  }

  async seedAdminsOnly(): Promise<any[]> {
    return this.adminsSeeder.seed();
  }

  async seedUsersOnly(stores: any[]): Promise<any[]> {
    // Users are created without stores now
    return this.usersSeeder.seed();
  }

  async seedScratchCardsOnly(stores: any[], users: any[]): Promise<any[]> {
    this.scratchCardsSeeder.setDependencies(stores, users);
    return this.scratchCardsSeeder.seed();
  }

  async seedTransactionsOnly(stores: any[], users: any[], scratchCards: any[]): Promise<any[]> {
    this.transactionsSeeder.setDependencies(stores, users, scratchCards);
    return this.transactionsSeeder.seed();
  }

  async seedOTPsOnly(users: any[]): Promise<any[]> {
    this.otpsSeeder.setUsers(users);
    return this.otpsSeeder.seed();
  }
}
