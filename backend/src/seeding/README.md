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

### Users (10 users)
- **Admin User** (09121111111) - System administrator with full permissions
- **Store Admin** (09122222222) - Store administrator with store management permissions  
- **Customer User** (09123333333) - Regular customer for testing
- **Ali Ahmadi** (09111111111) - Premium customer with multiple purchases
- **Reza Mohammadi** (09133333333) - VIP customer with high spending
- **Narges Hashemi** (09144444444) - New customer with limited activity
- **Amir Hosseini** (09155555555) - Premium customer with loyalty history
- **Store One** (09166666666) - Store owner for Tehran Mall
- **Store Two** (09177777777) - Store owner for Isfahan Bazaar
- **Store Manager** (09221234567) - Store owner for Shiraz Market

### Stores (3 stores)
- **Tehran Mall** - Premium shopping mall in Tehran with comprehensive features
- **Isfahan Bazaar** - Traditional bazaar in Isfahan with basic loyalty features  
- **Shiraz Market** - Modern market in Shiraz with premium features and lottery system

### Promotions (12 promotions)
- **Tehran Mall**: 4 promotions (percentage, cashback, loyalty points, coupon)
- **Isfahan Bazaar**: 3 promotions (fixed discount, referral, conditional)
- **Shiraz Market**: 5 promotions (flash sale, behavioral, free shipping, stackable)

### Promo Codes (Multiple codes)
- Generated promo codes for coupon-type promotions
- Special codes (WELCOME10, VIP2024, SUMMER50)
- Various usage states (unused, used, registered)
- Proper expiration dates and user associations

### OTPs (10 OTPs)
- One OTP per user for verification
- Fixed code '123456' for testing purposes
- Proper expiration times (10 minutes)

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
  "stores": 3,
  "promotions": 12,
  "promoCodes": 25,
  "otps": 10,
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
