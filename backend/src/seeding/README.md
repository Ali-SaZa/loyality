# 🌱 Database Seeding System

This module provides comprehensive database seeding functionality for the Loyalty Program System. It allows developers and administrators to populate the database with realistic sample data for development, testing, and demonstration purposes.

## 🚀 Features

- **Modular Architecture**: Separate seeder for each collection with clear responsibilities
- **Complete Data Seeding**: Seeds all entities (Users, Stores, Admins, OTPs)
- **Individual Collection Seeding**: Can seed specific collections independently
- **Environment-Aware**: Different behavior for development vs production environments
- **Data Relationships**: Maintains proper referential integrity between entities
- **Realistic Data**: Generates realistic Iranian business data with proper phone numbers, cities, and business logic
- **Multiple Interfaces**: CLI commands, API endpoints, and programmatic access
- **Safe Operations**: Production mode won't clear existing data
- **Base Seeder Class**: Common functionality shared across all seeders

## 📊 What Gets Seeded

### Users (4 users)
- **Ali Sagheb** (09368024951) - System administrator with full permissions
- **Saeid Kargaran** (09387114120) - Store administrator for Doris Accessories
- **Saza Miri** (09215501953) - Store administrator for Tehran Mall
- **مشتری تستی** (09051455365) - Regular customer for testing

### Stores (2 stores)
- **Doris Accessories** - Premium accessories store in Tehran with comprehensive loyalty program (SMS Balance: 100)
- **Tehran Mall** - Premium shopping mall in Tehran with comprehensive features (SMS Balance: 200)

### Promotions (8 promotions)
- **Doris Accessories**: 4 promotions (percentage, cashback, loyalty points, coupon)
- **Tehran Mall**: 4 promotions (fixed discount, referral, conditional, flash sale)

### Promo Codes (Multiple codes)
- Generated promo codes for coupon-type promotions
- Special codes (WELCOME10, VIP2024, SUMMER50)
- Various usage states (unused, used, registered)
- Proper expiration dates and user associations

### SMS Records (10 SMS records)
- **Welcome Messages** - Store welcome SMS to new customers
- **Promotional SMS** - Flash sales, special offers, and discounts
- **Order Updates** - Shipping notifications and order status updates
- **Customer Service** - Support responses and policy updates
- **System Notifications** - Admin messages about maintenance and security
- **Birthday/Anniversary** - Special occasion messages with discounts
- **Mixed Senders** - Both store users and admin users sending SMS

## 🛠️ Usage

### CLI Commands

```bash
# Seed database with development data (clears existing data)
npm run seed

# Seed database with production data (preserves existing data)
npm run seed:prod

# Clear all data without seeding
npm run seed:clear

# Show current database status
npm run seed:status

# Seed individual collections
npm run seed:stores              # Seed only stores
npm run seed:promotions          # Seed only promotions
npm run seed:promo-codes         # Seed only promo codes
npm run seed:sms                 # Seed only SMS records

# Show help
npm run seed -- --help
```

### API Endpoints

#### Seed Database
```http
POST /seeding/seed?environment=development
```

**Query Parameters:**
- `environment` (optional): `development` | `production` (defaults to development)

**Response:**
```json
{
  "message": "Database seeded successfully",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

#### Seed Individual Collections
```http
POST /seeding/seed/stores
POST /seeding/seed/promotions
POST /seeding/seed/promo-codes
POST /seeding/seed/users
POST /seeding/seed/sms
```

**Response:**
```json
{
  "message": "Stores seeded successfully",
  "count": 3,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Clear Database
```http
POST /seeding/clear
```

**Response:**
```json
{
  "message": "All data cleared successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Get Database Status
```http
GET /seeding/status
```

**Response:**
```json
{
  "users": 10,
  "stores": 4,
  "promotions": 12,
  "promoCodes": 25,
  "otps": 10,
  "sms": 10,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Programmatic Usage

```typescript
import { SeedingService } from './seeding/seeding.service';

@Injectable()
export class SomeService {
  constructor(private seedingService: SeedingService) {}

  async seedData() {
    // Seed with development data (clears existing)
    await this.seedingService.seedAll('development');
    
    // Seed with production data (preserves existing)
    await this.seedingService.seedAll('production');
    
    // Get current status
    const status = await this.seedingService.getSeedingStatus();
    
    // Clear all data
    await this.seedingService.clearAllData();
  }
}
```

## 🔧 Configuration

### Environment Variables

The seeding system respects the same environment variables as the main application:

- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment type (affects default seeding behavior)

### Development vs Production

- **Development Mode** (default):
  - Clears all existing data before seeding
  - Generates comprehensive sample data
  - Suitable for testing and development

- **Production Mode**:
  - Preserves existing data
  - Only adds missing data if collections are empty
  - Safe for production environments

## 📁 File Structure

```
src/seeding/
├── seeding.module.ts      # NestJS module configuration
├── seeding.service.ts     # Core seeding orchestration
├── seeding.controller.ts  # API endpoints
├── seed-cli.ts           # CLI script
├── seeders/              # Individual collection seeders
│   ├── index.ts          # Exports all seeders
│   ├── base.seeder.ts    # Base seeder class
│   ├── stores.seeder.ts  # Stores collection seeder
│   ├── admins.seeder.ts  # Admins collection seeder
│   ├── users.seeder.ts   # Users collection seeder

│   └── otps.seeder.ts    # OTPs seeder
└── README.md             # This file
```

## 🚨 Important Notes

### Data Safety
- **Development mode** will clear all existing data
- **Production mode** is safe and won't affect existing data
- Always backup production data before running any seeding operations

### Phone Numbers
- All generated phone numbers follow Iranian format: `09XXXXXXXXX`
- These are fictional numbers for development purposes
- Replace with real numbers in production

### Coordinates
- Store coordinates are approximate for major Iranian cities
- Use real coordinates for production applications

## 🧪 Testing

The seeding system is designed to work with the existing test infrastructure:

```bash
# Run tests
npm run test

# Run with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 🔄 Integration with Docker

The seeding system works seamlessly with the Docker setup:

```bash
# Start services
./docker-scripts.sh start

# Seed database
npm run seed

# Check status
npm run seed:status
```

## 📈 Monitoring

Monitor seeding operations through:

- **Logs**: Check application logs for seeding progress
- **API**: Use `/seeding/status` endpoint to monitor data counts
- **CLI**: Use `npm run seed:status` for quick status checks

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in environment variables

2. **Permission Denied**
   - Ensure proper database permissions
   - Check if collections exist and are writable

3. **Data Not Seeded**
   - Check logs for error messages
   - Verify all required schemas are properly imported

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` and checking the application logs for detailed seeding progress.

## 🤝 Contributing

When adding new entities or modifying existing ones:

1. Update the seeding service to include new data
2. Maintain referential integrity
3. Add appropriate logging
4. Update this README with new features
5. Test with both development and production modes

## 📞 Support

For issues or questions about the seeding system:

1. Check the application logs
2. Review the API documentation
3. Test with the CLI commands
4. Verify database connectivity
5. Check the main project documentation
