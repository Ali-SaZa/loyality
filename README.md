# Loyalty Program

A comprehensive loyalty program system for Iranian businesses with frontend and backend components.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- Docker and Docker Compose (for database)

### Development Options

You now have **multiple ways** to run the project:

#### **Option 1: Hybrid Development (Recommended)**
```bash
./start-hybrid.sh
```
This will:
1. ✅ **Start MongoDB database** in Docker (port 27017)
2. 🚀 **Launch the NestJS backend** locally (port 3001)
3. ⚛️ **Start the Next.js frontend** locally (port 3000)
4. 🔗 **Ensure backend connects to the database**

#### **Option 2: Database Only + Local Development**
```bash
# Start just the database
./start-db.sh

# Then in another terminal, run frontend and backend
npm run dev
```

#### **Option 3: Full Docker Setup**
```bash
./start-docker.sh
```
This runs everything in Docker containers.

#### **Option 4: Direct npm Commands**
```bash
npm run dev
```
This starts frontend and backend locally (requires MongoDB to be running separately).

## 📁 Project Structure

```
loyalty/
├── frontend/                    # Next.js React application
├── backend/                     # NestJS API server
├── docker-compose.yml          # Full Docker setup
├── docker-compose.db.yml       # MongoDB-only Docker setup
├── package.json                # Root package with dev scripts
├── start-hybrid.sh            # Hybrid development startup
├── start-db.sh                # Database-only startup
├── start-docker.sh            # Full Docker startup
└── README.md                  # This file
```

## 🔧 Available Scripts

### **Hybrid Development Commands**
- `./start-hybrid.sh` - Start MongoDB in Docker + Frontend/Backend locally
- `./start-db.sh` - Start just MongoDB in Docker
- `npm run dev` - Start frontend and backend locally
- `npm run dev:db` - Start MongoDB in Docker
- `npm run dev:db:down` - Stop MongoDB
- `npm run dev:db:logs` - View MongoDB logs

### **Full Docker Commands**
- `./start-docker.sh` - Start everything in Docker
- `npm run docker:up` - Start all Docker services
- `npm run docker:down` - Stop all Docker services
- `npm run docker:logs` - View all Docker logs

### **Development Commands**
- `npm run dev:frontend` - Frontend only
- `npm run dev:backend` - Backend only

### **Production Commands**
- `npm run build` - Build both frontend and backend
- `npm run start` - Start production builds

### **Maintenance Commands**
- `npm run install:all` - Install dependencies for all projects
- `npm run clean` - Clean build artifacts and node_modules
- `npm run reset` - Clean and reinstall everything
- `npm run seed` - Seed the database with initial data

## 🌐 Ports

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **MongoDB**: localhost:27017
- **Swagger Docs**: http://localhost:3001/api

## 🗄️ Database

The project uses MongoDB with the following default credentials:
- **Username**: admin
- **Password**: admin123
- **Database**: loyalty
- **Port**: 27017

## 🔒 Environment Variables

### **Root (.env)**
```bash
NODE_ENV=development
MONGODB_URI=mongodb://admin:admin123@localhost:27017/loyalty?authSource=admin
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=admin123
MONGO_INITDB_ROOT_DATABASE=loyalty
BACKEND_PORT=3001
FRONTEND_PORT=3000
JWT_SECRET=dev-jwt-secret-key-change-in-production-environment
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000,http://frontend:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_APP_NAME=Loyalty Program
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:3001/api
- **API Base URL**: http://localhost:3001

## 🧪 Testing

```bash
# Run all tests
npm run test

# Backend tests only
npm run test:backend

# Frontend linting only
npm run test:frontend
```

## 🚨 Troubleshooting

### **Port Conflicts**
If ports 3000 or 3001 are in use:
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### **Database Issues**
```bash
# Check MongoDB status
npm run dev:db:logs

# Restart MongoDB
npm run dev:db:down
npm run dev:db
```

### **Clean Reset**
```bash
# Complete reset
npm run reset
npm run dev
```

## 📝 Development Notes

- **Hybrid Development**: Best for fast development with consistent database
- **MongoDB in Docker**: Provides consistent database environment
- **Local Frontend/Backend**: Fast hot reloading and debugging
- **Port Configuration**: Backend on 3001, Frontend on 3000
- **Environment Variables**: Single `.env` file for all services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `./start-hybrid.sh` or `npm run dev`
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.
