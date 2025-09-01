import { Injectable, Logger } from '@nestjs/common';
import { 
  StoresSeeder, 
  AdminsSeeder, 
  UsersSeeder, 
 
 
  OTPsSeeder 
} from './seeders';

@Injectable()
export class SeedingService {
  private readonly logger = new Logger(SeedingService.name);

  constructor(
    private readonly storesSeeder: StoresSeeder,
    private readonly adminsSeeder: AdminsSeeder,
    private readonly usersSeeder: UsersSeeder,


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


      await this.seedOTPs(users);

      this.logger.log(`Seeding completed successfully for ${environment} environment`);
      this.logger.log(`Created: ${stores.length} stores, ${admins.length} admins, ${users.length} users`);
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





  private async seedOTPs(users: any[]) {
    this.otpsSeeder.setUsers(users);
    return this.otpsSeeder.seed();
  }

  async getSeedingStatus(): Promise<{
    users: number;
    stores: number;
    admins: number;


    otps: number;
  }> {
    const [users, stores, admins, otps] = await Promise.all([
      this.usersSeeder.count(),
      this.storesSeeder.count(),
      this.adminsSeeder.count(),


      this.otpsSeeder.count(),
    ]);

    return { users, stores, admins, otps };
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





  async seedOTPsOnly(users: any[]): Promise<any[]> {
    this.otpsSeeder.setUsers(users);
    return this.otpsSeeder.seed();
  }
}
