# Loyalty API

A comprehensive loyalty system API for small traditional businesses in Iran, built with NestJS and MongoDB.

## Features

- **Customer Management**: Register and manage customer accounts with consent tracking
- **Store Management**: Manage store loyalty settings and tiers
- **Scratch Card System**: Physical and digital scratch card support
- **OTP Authentication**: SMS-based authentication for secure access
- **Multi-store Support**: Customers can earn points across multiple stores
- **Privacy Compliance**: Built-in consent management for Iran's 2025 privacy laws

## Tech Stack

- **Backend**: NestJS (latest)
- **Database**: MongoDB with Mongoose ODM
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer
- **Authentication**: OTP-based (SMS)

## Database Schema

The system includes 6 main collections:

1. **Users** - Customer accounts with purchase history
2. **Stores** - Business locations with loyalty settings
3. **Admins** - System administrators with role-based permissions
4. **ScratchCards** - Physical/digital reward codes
5. **Transactions** - Purchase and reward tracking
6. **OTPs** - One-time password management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env file
   MONGODB_URI=mongodb://localhost:27017/loyalty
   PORT=3000
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

5. Access the API:
   - API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api

## API Endpoints

### Users
- `POST /users` - Create new customer
- `GET /users` - List all customers
- `GET /users/:id` - Get customer details
- `PATCH /users/:id` - Update customer
- `DELETE /users/:id` - Delete customer
- `PATCH /users/:id/consents` - Update consent preferences

### Stores
- `POST /stores` - Create new store
- `GET /stores` - List all stores
- `GET /stores/:id` - Get store details
- `PATCH /stores/:id` - Update store
- `DELETE /stores/:id` - Delete store

### Scratch Cards
- `POST /scratch-cards` - Create new scratch card
- `GET /scratch-cards` - List all scratch cards
- `GET /scratch-cards/:id` - Get scratch card details
- `PATCH /scratch-cards/:id` - Update scratch card
- `DELETE /scratch-cards/:id` - Delete scratch card
- `POST /scratch-cards/:id/use` - Use scratch card

### OTP
- `POST /otp` - Create new OTP
- `GET /otp` - List all OTPs
- `GET /otp/:id` - Get OTP details
- `PATCH /otp/:id` - Update OTP
- `DELETE /otp/:id` - Delete OTP
- `POST /otp/verify` - Verify OTP code

### Transactions
- `POST /transactions` - Create new transaction
- `GET /transactions` - List all transactions
- `GET /transactions/:id` - Get transaction details
- `PATCH /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction
- `GET /transactions/analytics` - Get transaction analytics

### Admins
- `POST /admins` - Create new admin
- `GET /admins` - List all admins
- `GET /admins/:id` - Get admin details
- `PATCH /admins/:id` - Update admin
- `DELETE /admins/:id` - Delete admin
- `PATCH /admins/:id/permissions` - Update admin permissions

## Development

### Project Structure

```
src/
├── schemas/          # MongoDB schemas
├── dto/             # Data transfer objects
├── users/           # User management module
├── stores/          # Store management module
├── scratch-cards/   # Scratch card operations
├── otp/             # OTP management
└── app.module.ts    # Main application module
```

### Adding New Features

1. Create schema in `src/schemas/`
2. Create DTOs in `src/dto/`
3. Create service and controller
4. Add to appropriate module
5. Update Swagger documentation

## Deployment

### Production Build

```bash
npm run build
npm run start:prod
```

### Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Application port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Contributing

1. Follow NestJS best practices
2. Add proper validation and error handling
3. Include Swagger documentation
4. Write tests for new features

## License

This project is licensed under the MIT License.
