# Loyalty Program Project

A comprehensive loyalty system for small traditional businesses in Iran, consisting of a NestJS backend API and a Next.js frontend.

## Project Structure

```
Loyalty/
├── backend/                 # NestJS Backend API
│   ├── src/                # Source code
│   ├── package.json        # Backend dependencies
│   ├── docker-compose.yml  # Docker configuration
│   └── README.md          # Backend documentation
├── frontend/               # Next.js Frontend
│   ├── src/                # Source code
│   ├── package.json        # Frontend dependencies
│   └── README.md          # Frontend documentation
├── FRONTEND_DEVELOPMENT_PLAN.md  # Frontend development roadmap
└── README.md              # This file
```

## Quick Start

### Backend (NestJS API)
```bash
cd backend
npm install
npm run start:dev
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## Features

- **Customer Management**: Register and manage customer accounts
- **Store Management**: Manage store loyalty settings and tiers
- **Scratch Card System**: Physical and digital scratch card support
- **OTP Authentication**: SMS-based authentication
- **Multi-store Support**: Customers can earn points across multiple stores
- **Privacy Compliance**: Built-in consent management for Iran's privacy laws

## Tech Stack

### Backend
- NestJS (Node.js framework)
- MongoDB with Mongoose
- JWT authentication
- Swagger/OpenAPI documentation

### Frontend
- Next.js 14+ with App Router
- TypeScript
- HeroUI (Tailwind CSS based)
- Axios for API calls

## Development

See individual README files in `backend/` and `frontend/` directories for detailed development instructions.

## License

This project is licensed under the MIT License.
