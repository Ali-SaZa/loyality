# PROJECT HISTORY & INSTRUCTIONS

## 🚨 IMPORTANT: READ THIS FIRST IN EVERY NEW CONVERSATION

**Whenever you start a new chat with me, the FIRST thing you must do is read this entire document to understand the project context, what has been built, and what needs to be done next.**

**CRITICAL: After reading this document, you MUST keep it updated throughout our conversation. Update the status, add new work completed, and modify next steps as we progress. This document is our shared memory and must reflect the current state of the project.**

**IMPORTANT: The "Last Updated" timestamp MUST always be updated to reflect the current date and time in Iran (Persian calendar format) whenever any changes are made to this document. Use the format: [Day] [Month] [Year], [Hour]:[Minute] IRST (Iran Standard Time)**

---

## 📖 EXECUTIVE SUMMARY (READ THIS FOR QUICK UNDERSTANDING)

### What This Project Is
A **Loyalty Program System** - a full-stack application that manages customer rewards, store operations, and transaction tracking for businesses that want to offer scratch card rewards and loyalty points to their customers.

### Core Business Logic
1. **Users** register and earn loyalty points through purchases
2. **Stores** can generate and distribute scratch cards to customers
3. **Scratch Cards** have monetary value and can be redeemed for rewards
4. **Transactions** track all point earnings, redemptions, and card usage
5. **OTP System** verifies user actions for security
6. **Admin Panel** manages stores, users, and system operations

### Technical Architecture
- **Backend**: NestJS (Node.js + TypeScript) REST API
- **Frontend**: Next.js (React + TypeScript) with modern UI components
- **Database**: MongoDB with Mongoose ODM
- **Containerization**: Docker for development and deployment
- **Authentication**: JWT-based authentication with OTP verification
- **Security**: Comprehensive role-based access control and authorization
- **Structure**: Modular architecture with separate modules for each business domain

### Current State
- **Backend Foundation**: 100% Complete (project structure, schemas, DTOs, modules)
- **Backend Implementation**: 100% Complete (all services, controllers, and business logic implemented)
- **Backend Security**: 100% Complete (comprehensive authorization and security measures)
- **Backend Scratch Card Flow**: 100% Complete (full QR code registration and access flow)
- **Frontend Foundation**: 100% Complete (Next.js project structure, routing, components)
- **Frontend Implementation**: 🔄 In Progress (UI components, forms, authentication)
- **Ready For**: Frontend completion, testing, deployment, and production use

### What You Need to Do Next
1. ✅ **Backend Business Logic** - All services fully implemented
2. ✅ **Backend API Endpoints** - All controllers complete with Swagger docs
3. ✅ **Backend Security System** - Comprehensive authorization and access control
4. ✅ **Backend Scratch Card Flow** - Complete QR code registration system
5. ✅ **Frontend Project Structure** - Next.js setup with proper routing
6. 🔄 **Frontend Implementation** - Complete UI components and authentication
7. 🔄 **Testing** - Set up and run unit/integration tests
8. 🔄 **Deployment** - Test Docker setup and deploy

### Key Files to Understand
- **Backend**: `backend/src/schemas/` - Database models (User, Store, ScratchCard, Transaction, OTP, Admin)
- **Backend**: `backend/src/dto/` - Data validation and transfer objects
- **Backend**: `backend/src/users/`, `backend/src/stores/`, `backend/src/scratch-cards/` - Core business modules
- **Backend**: `backend/src/common/security/` - Authorization and security system
- **Frontend**: `frontend/src/app/` - Next.js app router structure
- **Frontend**: `frontend/src/components/` - UI components and business logic
- **Docker**: `docker-compose.yml` - Development environment setup

**This summary gives you everything you need to understand the project and continue development immediately.**

---

## 📋 PROJECT OVERVIEW

**Project Name:** Loyalty Program System  
**Technology Stack:** NestJS (Backend), Next.js (Frontend), MongoDB, Docker  
**Project Type:** Full-stack loyalty/rewards program system  

## 🎯 BUSINESS REQUIREMENTS

Based on the business consultation document, this system should handle:
- User registration and authentication
- Store management
- Scratch card generation and redemption
- Transaction tracking
- OTP verification
- Admin functionality
- **NEW**: Complete scratch card QR code registration flow
- **NEW**: Modern web interface for all operations

## 🏗️ ARCHITECTURE & STRUCTURE

### Backend Framework
- **NestJS** - Modern Node.js framework with TypeScript
- **MongoDB** - NoSQL database with Mongoose ODM
- **Docker** - Containerization for development and deployment

### Frontend Framework
- **Next.js 14** - Modern React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Modern UI Components** - Reusable component library

### Project Structure
```
├── backend/                 # Backend API (NestJS)
│   ├── src/
│   │   ├── app/            # Main application module
│   │   ├── users/          # User management
│   │   ├── stores/         # Store management
│   │   ├── scratch-cards/  # Scratch card system
│   │   ├── transactions/   # Transaction tracking
│   │   ├── otp/            # OTP verification
│   │   ├── admins/         # Admin management
│   │   ├── seeding/        # Database seeding system
│   │   ├── schemas/        # MongoDB schemas
│   │   └── common/         # Shared utilities
│   │       ├── errors/     # Error handling system
│   │       ├── filters/    # Global exception filters
│   │       └── security/   # Authorization and security
│   └── Dockerfile          # Backend containerization
├── frontend/                # Frontend Application (Next.js)
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   │   ├── (auth)/     # Authentication routes
│   │   │   ├── (dashboard)/ # Dashboard routes
│   │   │   └── (public)/   # Public routes
│   │   ├── components/     # UI components
│   │   │   ├── business/   # Business logic components
│   │   │   ├── forms/      # Form components
│   │   │   ├── layout/     # Layout components
│   │   │   └── ui/         # Base UI components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
│   │       ├── api/        # API client configuration
│   │       ├── auth/       # Authentication utilities
│   │       ├── theme/      # Theme configuration
│   │       └── types/      # TypeScript type definitions
│   └── Dockerfile          # Frontend containerization
├── docker-compose.yml       # Multi-service orchestration
└── docker-compose.db.yml    # Database service
```

## 📝 WORK COMPLETED

### 1. Backend Setup & Configuration
- ✅ Created NestJS project structure
- ✅ Configured TypeScript and ESLint
- ✅ Set up MongoDB connection
- ✅ Created Docker configuration
- ✅ Added comprehensive README documentation

### 2. Backend Database Schemas
- ✅ **User Schema** - User registration, authentication, loyalty points
- ✅ **Store Schema** - Store information and management
- ✅ **Scratch Card Schema** - Scratch card generation and redemption
- ✅ **Transaction Schema** - Transaction tracking and history
- ✅ **OTP Schema** - One-time password verification
- ✅ **Admin Schema** - Administrative functionality

### 3. Backend DTOs (Data Transfer Objects)
- ✅ **User DTOs** - Registration, login, profile updates
- ✅ **Store DTOs** - Store creation and management
- ✅ **Scratch Card DTOs** - Card generation and redemption
- ✅ **Transaction DTOs** - Transaction creation and queries
- ✅ **OTP DTOs** - OTP verification requests

### 4. Backend Core Modules
- ✅ **Users Module** - User management service and controller
- ✅ **Stores Module** - Store management service and controller
- ✅ **Scratch Cards Module** - Scratch card service and controller
- ✅ **OTP Module** - OTP generation and verification
- ✅ **Transactions Module** - Transaction service and controller
- ✅ **Admins Module** - Admin management service and controller

### 5. Backend Docker Configuration
- ✅ **Dockerfile** - Application containerization
- ✅ **docker-compose.yml** - Multi-service orchestration
- ✅ **mongo-init.js** - MongoDB initialization script
- ✅ **docker-scripts.sh** - Development automation scripts

### 6. **NEW: Comprehensive Security System**
- ✅ **JWT Authentication** - Enhanced with userId, issuer, audience validation
- ✅ **Role-Based Access Control** - Admin, Store, Customer roles
- ✅ **Resource Authorization** - Comprehensive access control for all resources
- ✅ **Security Headers** - XSS protection, CSRF prevention, HSTS
- ✅ **Rate Limiting** - IP-based throttling with automatic cleanup
- ✅ **Input Validation** - Enhanced validation with security options

### 7. **NEW: Complete Scratch Card Flow**
- ✅ **QR Code Registration** - Customers can register cards via QR scanning
- ✅ **Access Control** - Proper authorization for viewing registered cards
- ✅ **User Ownership** - Cards are properly assigned to customers
- ✅ **Store Isolation** - Store owners can only access their store's cards

### 8. **NEW: Database Seeding System**
- ✅ **Comprehensive Seeding** - All entities with realistic data
- ✅ **Modular Architecture** - Separate seeders for each collection
- ✅ **Environment Awareness** - Different behavior for dev/prod
- ✅ **Referential Integrity** - Proper relationships between entities

### 9. **NEW: Enhanced Error Handling**
- ✅ **Persian Language Support** - All error messages in Persian
- ✅ **Custom Exception Classes** - Entity-specific error handling
- ✅ **Global Exception Filter** - Consistent error responses
- ✅ **MongoDB Integration** - Proper database error handling

### 10. **NEW: Frontend Project Structure**
- ✅ **Next.js 14 Setup** - Modern React framework with App Router
- ✅ **TypeScript Configuration** - Type-safe development environment
- ✅ **Project Structure** - Organized component and page architecture
- ✅ **Routing Setup** - Authentication, dashboard, and public routes
- ✅ **Component Architecture** - Business, forms, layout, and UI components
- ✅ **Utility Setup** - API client, authentication, theme, and types
- ✅ **Docker Configuration** - Frontend containerization ready

## 🔒 **COMPREHENSIVE SECURITY IMPLEMENTATION**

### **Critical Security Vulnerability Resolved**
**Problem**: The system had a massive security breach where users could access data they shouldn't have access to.

**Example**: User Ali could access discount codes from Hassan's store by simply knowing the ID.

### **Security Fixes Implemented**

#### **1. JWT Token Enhancement**
- **userId is now ALWAYS included** in JWT tokens
- Enhanced token validation with issuer/audience claims
- Strict algorithm restriction (HS256 only)
- Environment variable validation for JWT_SECRET

#### **2. Comprehensive Authorization System**

##### **Resource Authorization Guard**
- `ResourceAuthGuard` - Centralized authorization logic
- Automatically extracts user context from JWT token
- Validates user permissions for each resource type

##### **Authorization Decorators**
```typescript
@ScratchCardAuth({ paramName: 'id' })     // Scratch card access
@StoreAuth({ paramName: 'id' })           // Store access  
@UserAuth({ paramName: 'id' })            // User data access
@TransactionAuth({ paramName: 'id' })     // Transaction access
@AdminAuth()                              // Admin-only access
```

#### **3. Role-Based Access Control Matrix**

| Resource Type | Customer | Store User | Admin |
|---------------|----------|------------|-------|
| **Own Profile** | ✅ Full | ✅ Full | ✅ Full |
| **Other Users** | ❌ None | ⚠️ Store-related only | ✅ Full |
| **Own Store** | ❌ None | ✅ Full | ✅ Full |
| **Other Stores** | ⚠️ Read-only | ❌ None | ✅ Full |
| **Own Scratch Cards** | ✅ Full | ✅ Full | ✅ Full |
| **Store Scratch Cards** | ❌ None | ✅ Full | ✅ Full |
| **Own Transactions** | ✅ Full | ✅ Full | ✅ Full |
| **Store Transactions** | ❌ None | ✅ Full | ✅ Full |

#### **4. Security Features**
- **Two-Layer Authorization**: Guard level + Service level validation
- **Resource Isolation**: Users can only access their own data
- **Store Separation**: Store owners can't see other stores' data
- **Rate Limiting**: Protection against DDoS attacks
- **Security Headers**: Protection against common web vulnerabilities
- **Proper Error Handling**: Clear 401/403 responses

### **Security Flow Example**

#### **Before (INSECURE)**:
```
1. Ali logs in → gets JWT token
2. Ali knows Hassan's scratch card ID: "abc123"
3. Ali calls: GET /scratch-cards/abc123
4. ❌ System returns Hassan's scratch card data to Ali
```

#### **After (SECURE)**:
```
1. Ali logs in → gets JWT token with userId
2. Ali tries: GET /scratch-cards/abc123
3. ✅ ResourceAuthGuard intercepts request
4. ✅ Extracts Ali's userId from JWT token
5. ✅ Checks if Ali owns scratch card "abc123"
6. ✅ Checks if Ali owns store that created "abc123"
7. ❌ Ali doesn't own it → 403 Forbidden
```

## 🎯 **COMPLETE SCRATCH CARD FLOW IMPLEMENTED**

### **Complete Flow Implemented**

#### **1. Admin Creates Encrypted Code**
- Admin creates scratch card with unique code
- Code is assigned to a specific store
- Status: `unused`, `userId: null`

#### **2. Store Distributes Code to Customer**
- Store gives the code to their customer
- Customer receives the QR code (can be scanned)

#### **3. Customer Registers Code via QR**
- **New Endpoint**: `POST /scratch-cards/register/:code`
- Customer scans QR code and calls this endpoint
- System validates:
  - Code exists and is unused
  - Code hasn't expired
  - Code isn't already registered by another user
- **Result**: `userId` is set to customer's ID, `entryMethod: 'qr'`

#### **4. Customer Views Their Registered Code**
- **New Endpoint**: `GET /scratch-cards/my-cards`
- Customer can view all their registered scratch cards
- **Existing Endpoint**: `GET /scratch-cards/:id` (with proper authorization)

### **API Endpoints for Scratch Cards**

#### **Public Endpoints**
- `GET /scratch-cards/code/:code` - Get card info by code (for QR display)

#### **Protected Endpoints**
- `POST /scratch-cards/register/:code` - **NEW**: Register card by QR code
- `GET /scratch-cards/my-cards` - **NEW**: View own registered cards
- `GET /scratch-cards/:id` - View specific card (with authorization)
- `GET /scratch-cards/user/:userId` - View user's cards (with authorization)
- `GET /scratch-cards/store/:storeId` - View store's cards (with authorization)

### **Security Features for Scratch Cards**
1. **Role-Based Access**: Only customers can register cards
2. **Duplicate Prevention**: Cards can't be registered by multiple users
3. **Expiration Check**: Expired cards can't be registered
4. **Status Validation**: Only unused cards can be registered
5. **Ownership Validation**: Customers can only view their own cards

## 🎨 **FRONTEND IMPLEMENTATION STATUS**

### **Project Structure Complete**
- ✅ **Next.js 14 Setup** - Modern React framework with App Router
- ✅ **TypeScript Configuration** - Full type safety
- ✅ **Routing Architecture** - Authentication, dashboard, and public routes
- ✅ **Component Organization** - Business, forms, layout, and UI components
- ✅ **Utility Setup** - API client, authentication, theme, and types
- ✅ **Docker Configuration** - Frontend containerization ready

### **Frontend Components Architecture**
```
src/
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   └── (public)/          # Public routes
├── components/             # UI components
│   ├── business/          # Business logic components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── ui/                # Base UI components
├── contexts/               # React contexts
├── hooks/                  # Custom React hooks
└── lib/                    # Utilities and configurations
    ├── api/                # API client configuration
    ├── auth/               # Authentication utilities
    ├── theme/              # Theme configuration
    └── types/              # TypeScript type definitions
```

### **What's Been Implemented**
- ✅ **Project Foundation** - Complete Next.js setup with TypeScript
- ✅ **Routing Structure** - Proper route organization with app router
- ✅ **Component Architecture** - Organized component hierarchy
- ✅ **Utility Setup** - API client, authentication, and theme configuration
- ✅ **Docker Ready** - Frontend containerization configuration

### **What Needs Implementation**
- 🔄 **UI Components** - Complete business logic components
- 🔄 **Authentication Forms** - Login, registration, and OTP forms
- 🔄 **Dashboard Interface** - User and store management interfaces
- 🔄 **API Integration** - Connect frontend to backend API
- 🔄 **State Management** - User context and application state
- 🔄 **Responsive Design** - Mobile and tablet optimization

## 🔧 TECHNICAL IMPLEMENTATION DETAILS

### Backend Database Models
- **User Model**: Includes loyalty points, store association, transaction history
- **Store Model**: Store details, location, operating hours
- **Scratch Card Model**: Card generation, redemption status, value
- **Transaction Model**: Transaction types, amounts, timestamps
- **OTP Model**: Time-based verification codes
- **Admin Model**: Administrative privileges and access control

### Backend API Endpoints Structure
- **Users**: Registration, login, profile management, loyalty points
- **Stores**: Store CRUD operations, location management
- **Scratch Cards**: Generation, redemption, validation, QR registration
- **Transactions**: Creation, history, reporting
- **OTP**: Generation, verification, expiration handling

### Frontend Architecture
- **Next.js 14**: Modern React framework with App Router
- **TypeScript**: Full type safety and development experience
- **Component Library**: Organized business and UI components
- **API Integration**: Centralized API client configuration
- **Authentication**: JWT-based auth with React contexts
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Security Features
- JWT-based authentication with enhanced security
- Comprehensive role-based access control
- Resource-specific authorization
- Admin role management
- Secure transaction handling
- Rate limiting and security headers

## 🚧 CURRENT STATUS

### What's Working
- ✅ **Backend**: Complete project structure and architecture
- ✅ **Backend**: All database schemas defined and implemented
- ✅ **Backend**: All DTOs created with validation
- ✅ **Backend**: All modules properly configured
- ✅ **Backend**: All services fully implemented with business logic
- ✅ **Backend**: All controllers complete with API endpoints
- ✅ **Backend**: Swagger/OpenAPI documentation ready
- ✅ **Backend**: Docker configuration ready
- ✅ **Backend**: Comprehensive documentation
- ✅ **Backend**: Input validation and error handling
- ✅ **Backend**: Complete security system with authorization
- ✅ **Backend**: Full scratch card QR code registration flow
- ✅ **Backend**: Comprehensive database seeding system
- ✅ **Backend**: Enhanced error handling with Persian support
- ✅ **Frontend**: Complete Next.js project structure and setup
- ✅ **Frontend**: Proper routing architecture with app router
- ✅ **Frontend**: Component organization and utility setup
- ✅ **Frontend**: Docker configuration ready
- ✅ **Infrastructure**: Multi-service Docker orchestration

### What Needs Implementation
- 🔄 **Frontend UI Components** - Complete business logic components
- 🔄 **Frontend Authentication** - Login, registration, and OTP forms
- 🔄 **Frontend Dashboard** - User and store management interfaces
- 🔄 **Frontend API Integration** - Connect to backend API
- 🔄 **Testing** - Unit and integration tests for both frontend and backend
- 🔄 **Deployment** - Production environment setup

### What's Been Added
- ✅ **Database Seeding System** - Comprehensive seeding with modular architecture
  - Individual seeders for each collection (Stores, Admins, Users, Scratch Cards, Transactions, OTPs)
  - Base seeder class with common functionality
  - CLI commands for seeding operations
  - API endpoints for seeding operations
  - Environment-aware seeding (development vs production)
  - Proper referential integrity maintenance
- ✅ **Comprehensive Error Handling System** - Persian language error messages with global exception filter
  - Persian error messages file with 50+ error types
  - Custom exception classes for each entity type
  - Global exception filter for consistent error responses
  - MongoDB error handling integration
  - Structured error logging with context
  - All services updated to use new error handling
- ✅ **Complete Security System** - Comprehensive authorization and access control
  - JWT token enhancement with userId inclusion
  - Resource authorization guard for all endpoints
  - Role-based access control (Admin, Store, Customer)
  - Resource isolation and store separation
  - Rate limiting and security headers
- ✅ **Full Scratch Card Flow** - Complete QR code registration system
  - QR code registration endpoint for customers
  - Proper access control for registered cards
  - User ownership validation
  - Store relationship validation
- ✅ **Frontend Project Structure** - Complete Next.js setup with modern architecture
  - Next.js 14 with App Router
  - TypeScript configuration
  - Organized component architecture
  - Proper routing structure
  - Utility and configuration setup
  - Docker containerization ready

## 📋 NEXT STEPS PRIORITY

### High Priority
1. ✅ **Backend Core service logic** - All modules fully implemented
2. ✅ **Backend API endpoints** - All controllers complete with Swagger docs
3. ✅ **Backend Security system** - Comprehensive authorization and access control
4. ✅ **Backend Scratch card flow** - Complete QR code registration system
5. ✅ **Frontend Project structure** - Next.js setup with proper routing
6. 🔄 **Frontend Implementation** - Complete UI components and authentication
7. 🔄 **Testing** - Set up and run comprehensive tests for both frontend and backend

### Medium Priority
1. **Complete frontend UI components** for all business operations
2. **Implement frontend authentication flow** with JWT integration
3. **Create dashboard interfaces** for users, stores, and admins
4. **Set up testing framework** with Jest for both frontend and backend
5. **Add API documentation** with Swagger
6. **Implement logging** and monitoring

### Low Priority
1. **Performance optimization** and caching
2. **Advanced features** like analytics and reporting
3. **Mobile app integration** considerations
4. **PWA features** for mobile experience

## 🐳 DOCKER COMMANDS

### Development
```bash
# Start all services (backend, frontend, database)
./start-docker.sh

# Start only database
./start-db.sh

# Start hybrid (database + backend)
./start-hybrid.sh

# Stop all services
docker-compose down
```

### Manual Docker Commands
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Frontend only
docker-compose up frontend

# Backend only
docker-compose up backend
```

## 🔍 IMPORTANT FILES TO REFERENCE

- **`Summary_of_Business_Consultation.markdown`** - Business requirements and use cases
- **`Loyalty Program.docx`** - Original business specification
- **`FRONTEND_DEVELOPMENT_PLAN.md`** - Frontend development roadmap
- **`backend/package.json`** - Backend dependencies and scripts
- **`frontend/package.json`** - Frontend dependencies and scripts
- **`backend/src/schemas/`** - Database models and relationships
- **`backend/src/common/security/`** - Authorization and security system
- **`backend/src/seeding/`** - Database seeding system
- **`frontend/src/app/`** - Next.js app router structure
- **`frontend/src/components/`** - UI components and business logic

## 💡 DEVELOPMENT NOTES

### Code Style
- **Backend**: Follow NestJS best practices and conventions
- **Frontend**: Follow Next.js and React best practices
- Use TypeScript strict mode for both frontend and backend
- Implement proper error handling and logging
- Add comprehensive JSDoc comments

### Testing Strategy
- **Backend**: Unit tests for all services, integration tests for controllers
- **Frontend**: Unit tests for components, integration tests for pages
- E2E tests for critical user flows
- Mock external dependencies

### Security Considerations
- Validate all input data on both frontend and backend
- Implement proper authentication with JWT
- Use environment variables for secrets
- Add rate limiting and CORS configuration
- **NEW**: Comprehensive resource authorization
- **NEW**: Role-based access control

### Frontend Development
- Use modern React patterns (hooks, contexts)
- Implement responsive design with Tailwind CSS
- Create reusable component library
- Implement proper state management
- Add loading states and error boundaries

---

## 📞 SUPPORT & QUESTIONS

If you have questions about:
- **Business Logic**: Refer to `Summary_of_Business_Consultation.markdown`
- **Backend Implementation**: Check the existing code structure in `backend/src/`
- **Frontend Implementation**: Check the existing code structure in `frontend/src/`
- **Docker Setup**: See the various start scripts and docker-compose files
- **Database Schema**: Review files in `backend/src/schemas/`
- **Security System**: Check `backend/src/common/security/`
- **Seeding System**: Review `backend/src/seeding/`
- **Frontend Development**: Check `FRONTEND_DEVELOPMENT_PLAN.md`

---

**Last Updated:** 28 Mordad 1403, 23:45 IRST (Iran Standard Time)  
**Project Status:** Backend Complete (100%) + Frontend Foundation Complete (100%) + Frontend Implementation In Progress (🔄) - Ready for Frontend Completion & Testing  
**Next Major Milestone:** Complete Frontend Implementation & Comprehensive Testing
