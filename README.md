# Loyalty Program

A comprehensive loyalty program system for Iranian businesses with frontend and backend components.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+

### Single Command Setup

To run the entire project (frontend and backend) with one command:

```bash
npm run dev
```

This command will:
1. 🚀 **Launch the NestJS backend** on port 3001
2. ⚛️ **Start the Next.js frontend** on port 3000

## 📁 Project Structure

```
loyalty/
├── frontend/          # Next.js React application
├── backend/           # NestJS API server
├── package.json       # Root package with dev scripts
└── README.md         # This file
```

## 🔧 Available Scripts

### **Development Commands**
- `npm run dev` - Start frontend and backend locally
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
- **Swagger Docs**: http://localhost:3001/api

## 🔒 Environment Variables

### **Backend (.env.development)**
```bash
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://admin:admin123@localhost:27017/loyalty?authSource=admin
JWT_SECRET=dev-jwt-secret-key-change-in-production-environment
JWT_EXPIRES_IN=7d
```

### **Frontend (env.local.example)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_APP_NAME=Loyalty Program
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

### **Clean Reset**
```bash
# Complete reset
npm run reset
npm run dev
```

## 📝 Development Notes

- Backend runs on port 3001 to avoid conflicts with frontend
- Frontend connects to backend via `NEXT_PUBLIC_API_URL`
- Hot reloading enabled for both frontend and backend
- You'll need to set up MongoDB locally or use a cloud service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm run dev`
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.
