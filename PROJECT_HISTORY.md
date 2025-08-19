# PROJECT HISTORY & INSTRUCTIONS

## 🚨 IMPORTANT: READ THIS FIRST IN EVERY NEW CONVERSATION

**Whenever you start a new chat with me, the FIRST thing you must do is read this entire document to understand the project context, what has been built, and what needs to be done next.**

**CRITICAL: After reading this document, you MUST keep it updated throughout our conversation. Update the status, add new work completed, and modify next steps as we progress. This document is our shared memory and must reflect the current state of the project.**

**IMPORTANT: The "Last Updated" timestamp MUST always be updated to reflect the current date and time in Iran (Persian calendar format) whenever any changes are made to this document. Use the format: [Day] [Month] [Year], [Hour]:[Minute] IRST (Iran Standard Time)**

---

## 📖 EXECUTIVE SUMMARY (READ THIS FOR QUICK UNDERSTANDING)

### What This Project Is
A **Loyalty Program System** - a backend API that manages customer rewards, store operations, and transaction tracking for businesses that want to offer scratch card rewards and loyalty points to their customers.

### Core Business Logic
1. **Users** register and earn loyalty points through purchases
2. **Stores** can generate and distribute scratch cards to customers
3. **Scratch Cards** have monetary value and can be redeemed for rewards
4. **Transactions** track all point earnings, redemptions, and card usage
5. **OTP System** verifies user actions for security
6. **Admin Panel** manages stores, users, and system operations

### Technical Architecture
- **Backend**: NestJS (Node.js + TypeScript) REST API
- **Database**: MongoDB with Mongoose ODM
- **Containerization**: Docker for development and deployment
- **Authentication**: OTP-based verification system
- **Structure**: Modular architecture with separate modules for each business domain

### Current State
- **Foundation**: 100% Complete (project structure, schemas, DTOs, modules)
- **Implementation**: 95% Complete (all services, controllers, and business logic implemented)
- **Ready For**: Testing, deployment, and minor enhancements

### What You Need to Do Next
1. ✅ **Business Logic** - All services fully implemented
2. ✅ **API Endpoints** - All controllers complete with Swagger docs
3. 🔄 **Testing** - Set up and run unit/integration tests
4. 🔄 **Deployment** - Test Docker setup and deploy
5. 🔄 **Minor Enhancements** - Add global exception filters, enhance validation

### Key Files to Understand
- `src/schemas/` - Database models (User, Store, ScratchCard, Transaction, OTP, Admin)
- `src/dto/` - Data validation and transfer objects
- `src/users/`, `src/stores/`, `src/scratch-cards/` - Core business modules
- `docker-compose.yml` - Development environment setup

**This summary gives you everything you need to understand the project and continue development immediately.**

---

## 📋 PROJECT OVERVIEW

**Project Name:** Loyalty Program System  
**Technology Stack:** NestJS (Node.js), MongoDB, Docker  
**Project Type:** Backend API for a loyalty/rewards program system  

## 🎯 BUSINESS REQUIREMENTS

Based on the business consultation document, this system should handle:
- User registration and authentication
- Store management
- Scratch card generation and redemption
- Transaction tracking
- OTP verification
- Admin functionality

## 🏗️ ARCHITECTURE & STRUCTURE

### Backend Framework
- **NestJS** - Modern Node.js framework with TypeScript
- **MongoDB** - NoSQL database with Mongoose ODM
- **Docker** - Containerization for development and deployment

### Project Structure
```
src/
├── app/                 # Main application module
├── users/              # User management
├── stores/             # Store management
├── scratch-cards/      # Scratch card system
├── transactions/       # Transaction tracking
├── otp/               # OTP verification
└── schemas/           # MongoDB schemas
```

## 📝 WORK COMPLETED

### 1. Project Setup & Configuration
- ✅ Created NestJS project structure
- ✅ Configured TypeScript and ESLint
- ✅ Set up MongoDB connection
- ✅ Created Docker configuration
- ✅ Added comprehensive README documentation

### 2. Database Schemas
- ✅ **User Schema** - User registration, authentication, loyalty points
- ✅ **Store Schema** - Store information and management
- ✅ **Scratch Card Schema** - Scratch card generation and redemption
- ✅ **Transaction Schema** - Transaction tracking and history
- ✅ **OTP Schema** - One-time password verification
- ✅ **Admin Schema** - Administrative functionality

### 3. DTOs (Data Transfer Objects)
- ✅ **User DTOs** - Registration, login, profile updates
- ✅ **Store DTOs** - Store creation and management
- ✅ **Scratch Card DTOs** - Card generation and redemption
- ✅ **Transaction DTOs** - Transaction creation and queries
- ✅ **OTP DTOs** - OTP verification requests

### 4. Core Modules
- ✅ **Users Module** - User management service and controller
- ✅ **Stores Module** - Store management service and controller
- ✅ **Scratch Cards Module** - Scratch card service and controller
- ✅ **OTP Module** - OTP generation and verification
- ✅ **Transactions Module** - Transaction service (basic structure)

### 5. Docker Configuration
- ✅ **Dockerfile** - Application containerization
- ✅ **docker-compose.yml** - Multi-service orchestration
- ✅ **mongo-init.js** - MongoDB initialization script
- ✅ **docker-scripts.sh** - Development automation scripts

## 🔧 TECHNICAL IMPLEMENTATION DETAILS

### Database Models
- **User Model**: Includes loyalty points, store association, transaction history
- **Store Model**: Store details, location, operating hours
- **Scratch Card Model**: Card generation, redemption status, value
- **Transaction Model**: Transaction types, amounts, timestamps
- **OTP Model**: Time-based verification codes
- **Admin Model**: Administrative privileges and access control

### API Endpoints Structure
- **Users**: Registration, login, profile management, loyalty points
- **Stores**: Store CRUD operations, location management
- **Scratch Cards**: Generation, redemption, validation
- **Transactions**: Creation, history, reporting
- **OTP**: Generation, verification, expiration handling

### Security Features
- OTP-based verification system
- User authentication and authorization
- Admin role management
- Secure transaction handling

## 🚧 CURRENT STATUS

### What's Working
- ✅ Complete project structure and architecture
- ✅ All database schemas defined and implemented
- ✅ All DTOs created with validation
- ✅ All modules properly configured
- ✅ All services fully implemented with business logic
- ✅ All controllers complete with API endpoints
- ✅ Swagger/OpenAPI documentation ready
- ✅ Docker configuration ready
- ✅ Comprehensive documentation
- ✅ Input validation and error handling

### What Needs Implementation
- 🔄 **Testing** - Unit and integration tests
- 🔄 **Global Exception Filters** - Enhanced error handling
- 🔄 **Rate Limiting** - API protection
- 🔄 **Logging** - Enhanced monitoring
- 🔄 **Deployment** - Production environment setup

### What's Been Added
- ✅ **Database Seeding System** - Comprehensive seeding with modular architecture
  - Individual seeders for each collection (Stores, Admins, Users, Scratch Cards, Transactions, OTPs)
  - Base seeder class with common functionality
  - CLI commands for seeding operations
  - API endpoints for seeding operations
  - Environment-aware seeding (development vs production)
  - Proper referential integrity maintenance

## 📋 NEXT STEPS PRIORITY

### High Priority
1. ✅ **Core service logic** - All modules fully implemented
2. ✅ **API endpoints** - All controllers complete with Swagger docs
3. ✅ **Request validation** - Using class-validator and class-transformer
4. 🔄 **Testing** - Set up and run comprehensive tests

### Medium Priority
1. **Set up testing framework** with Jest
2. **Add API documentation** with Swagger
3. **Implement logging** and monitoring
4. **Add rate limiting** and security headers

### Low Priority
1. **Performance optimization** and caching
2. **Advanced features** like analytics and reporting
3. **Mobile app integration** considerations

## 🐳 DOCKER COMMANDS

### Development
```bash
# Start all services
./docker-scripts.sh start

# Stop all services
./docker-scripts.sh stop

# View logs
./docker-scripts.sh logs

# Rebuild and restart
./docker-scripts.sh rebuild
```

### Manual Docker Commands
```bash
# Build and start
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

## 🔍 IMPORTANT FILES TO REFERENCE

- **`Summary_of_Business_Consultation.markdown`** - Business requirements and use cases
- **`Loyalty Program.docx`** - Original business specification
- **`DOCKER_README.md`** - Docker setup and usage instructions
- **`package.json`** - Dependencies and scripts
- **`src/schemas/`** - Database models and relationships

## 💡 DEVELOPMENT NOTES

### Code Style
- Follow NestJS best practices and conventions
- Use TypeScript strict mode
- Implement proper error handling and logging
- Add comprehensive JSDoc comments

### Testing Strategy
- Unit tests for all services
- Integration tests for controllers
- E2E tests for critical user flows
- Mock external dependencies

### Security Considerations
- Validate all input data
- Implement proper authentication
- Use environment variables for secrets
- Add rate limiting and CORS configuration

---

## 📞 SUPPORT & QUESTIONS

If you have questions about:
- **Business Logic**: Refer to `Summary_of_Business_Consultation.markdown`
- **Technical Implementation**: Check the existing code structure
- **Docker Setup**: See `DOCKER_README.md`
- **Database Schema**: Review files in `src/schemas/`

---

**Last Updated:** 28 Mordad 1403, 21:30 IRST (Iran Standard Time)  
**Project Status:** Implementation Complete + Seeding Feature Added - Ready for Testing & Deployment  
**Next Major Milestone:** Comprehensive Testing & Production Deployment
