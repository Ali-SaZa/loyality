#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedingService } from './seeding.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedingService = app.get(SeedingService);

  try {
    console.log('🚀 Starting database seeding...');
    
    // Get command line arguments
    const args = process.argv.slice(2);
    const environment = args.includes('--production') ? 'production' : 'development';
    const clearOnly = args.includes('--clear-only');
    const statusOnly = args.includes('--status-only');
    const storesOnly = args.includes('--stores-only');
    const adminsOnly = args.includes('--admins-only');
    
    if (statusOnly) {
      console.log('📊 Getting database status...');
      const status = await seedingService.getSeedingStatus();
      console.log('Database Status:');
      console.log(`  Users: ${status.users}`);
      console.log(`  Stores: ${status.stores}`);
      console.log(`  Admins: ${status.admins}`);
      console.log(`  Scratch Cards: ${status.scratchCards}`);
      console.log(`  Transactions: ${status.transactions}`);
      console.log(`  OTPs: ${status.otps}`);
      return;
    }
    
    if (clearOnly) {
      console.log('🗑️  Clearing all data...');
      await seedingService.clearAllData();
      console.log('✅ All data cleared successfully');
      return;
    }
    
    if (storesOnly) {
      console.log('🏪 Seeding stores only...');
      const stores = await seedingService.seedStoresOnly();
      console.log(`✅ Created ${stores.length} stores`);
      return;
    }
    
    if (adminsOnly) {
      console.log('👨‍💼 Seeding admins only...');
      const admins = await seedingService.seedAdminsOnly();
      console.log(`✅ Created ${admins.length} admins`);
      return;
    }
    
    console.log(`🌱 Seeding database for ${environment} environment...`);
    await seedingService.seedAll(environment);
    console.log('✅ Database seeded successfully!');
    
    // Show final status
    const status = await seedingService.getSeedingStatus();
    console.log('\n📊 Final Database Status:');
    console.log(`  Users: ${status.users}`);
    console.log(`  Stores: ${status.stores}`);
    console.log(`  Admins: ${status.admins}`);
    console.log(`  Scratch Cards: ${status.scratchCards}`);
    console.log(`  Transactions: ${status.transactions}`);
    console.log(`  OTPs: ${status.otps}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

// Handle command line usage
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🌱 Loyalty Program Database Seeder

Usage:
  npm run seed                    # Seed database (development mode)
  npm run seed:prod              # Seed database (production mode)
  npm run seed:clear             # Clear all data
  npm run seed:status            # Show database status

Options:
  --production                   # Use production mode (won't clear existing data)
  --clear-only                   # Only clear data, don't seed
  --status-only                  # Only show database status
  --stores-only                  # Seed only stores collection
  --admins-only                  # Seed only admins collection
  --help, -h                    # Show this help message

Examples:
  npm run seed                   # Seed with development data
  npm run seed:prod             # Seed with production data
  npm run seed:clear            # Clear all data
  npm run seed:status           # Show current status
  npm run seed -- --stores-only # Seed only stores
  npm run seed -- --admins-only # Seed only admins
`);
  process.exit(0);
}

bootstrap();
