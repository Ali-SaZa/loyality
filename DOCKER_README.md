# Docker Setup for Loyalty Program

This document explains how to run the Loyalty Program using Docker.

## Prerequisites

- Docker and Docker Compose installed
- Git (to clone the repository)

## Quick Start

1. **Clone the repository and navigate to the project directory:**

   ```bash
   cd /path/to/loyalty-program
   ```

2. **Run the Docker startup script:**

   ```bash
   ./start-docker.sh
   ```

   This script will:
   - Check if Docker is running
   - Create a `.env` file from `env.docker` if it doesn't exist
   - Start all services using Docker Compose
   - Display service URLs

## Manual Setup

If you prefer to run commands manually:

1. **Copy environment file:**

   ```bash
   cp env.docker .env
   ```

2. **Start all services:**
   ```bash
   docker compose up --build -d
   ```

## Services

Once running, the following services will be available:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api
- **MongoDB**: localhost:27017

## Useful Commands

- **View logs:**

  ```bash
  docker compose logs -f
  ```

- **Stop services:**

  ```bash
  docker compose down
  ```

- **Restart services:**

  ```bash
  docker compose restart
  ```

- **Rebuild and restart:**
  ```bash
  docker compose up --build -d
  ```

## Environment Variables

The main environment variables are defined in `env.docker`:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NEXT_PUBLIC_API_URL`: Backend API URL for frontend
- `FRONTEND_PORT`: Frontend service port (default: 3000)
- `BACKEND_PORT`: Backend service port (default: 3001)

## Troubleshooting

### Frontend Build Issues

If the frontend fails to build, ensure:

- The `frontend/Dockerfile` exists
- All dependencies are properly installed
- The `.dockerignore` file is present

### MongoDB Connection Issues

If MongoDB fails to start:

- Check if port 27017 is available
- Verify the environment variables in `.env`
- Check Docker logs: `docker compose logs mongodb`

### Port Conflicts

If ports are already in use:

- Change the port mappings in `docker-compose.yml`
- Update the corresponding environment variables in `.env`

## Development

For development, the services are configured with:

- Hot reloading enabled for both frontend and backend
- Volume mounts for live code changes
- Development mode for all services

## Production

For production deployment:

- Update environment variables for production
- Use production Dockerfiles (if available)
- Configure proper security settings
- Set up proper logging and monitoring
