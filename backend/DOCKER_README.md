# Docker Setup for Loyalty API

This project includes Docker configuration for easy development and deployment.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### 1. Start Services
```bash
./docker-scripts.sh start
```

### 2. Build and Start Services (first time or after changes)
```bash
./docker-scripts.sh build
```

### 3. Check Service Status
```bash
./docker-scripts.sh status
```

### 4. View Logs
```bash
./docker-scripts.sh logs
```

### 5. Stop Services
```bash
./docker-scripts.sh stop
```

## Services

### MongoDB
- **Container**: `loyalty-mongodb`
- **Port**: 27017
- **Username**: admin
- **Password**: admin123
- **Database**: loyalty
- **Connection String**: `mongodb://admin:admin123@localhost:27017/loyalty?authSource=admin`

### Loyalty API
- **Container**: `loyalty-api`
- **Port**: 3000
- **URL**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api

## Environment Variables

The following environment variables are configured:

- `MONGODB_URI`: MongoDB connection string with authentication
- `PORT`: API server port (3000)
- `NODE_ENV`: Environment mode (development/production)

## Database Initialization

When MongoDB starts for the first time, it automatically:
1. Creates the `loyalty` database
2. Creates a user with admin privileges
3. Creates initial collections (users, stores, scratch_cards, transactions, otps)
4. Inserts a test user document

## Useful Commands

### Access MongoDB Shell
```bash
docker exec -it loyalty-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

### View API Logs
```bash
docker logs -f loyalty-api
```

### View MongoDB Logs
```bash
docker logs -f loyalty-mongodb
```

### Restart Services
```bash
./docker-scripts.sh restart
```

### Clean Up Everything
```bash
./docker-scripts.sh clean
```

## Troubleshooting

### Port Already in Use
If you get a port conflict error:
```bash
# Check what's using the port
lsof -i :27017
lsof -i :3000

# Stop conflicting services or change ports in docker-compose.yml
```

### Database Connection Issues
1. Ensure MongoDB container is running: `docker ps`
2. Check MongoDB logs: `docker logs loyalty-mongodb`
3. Verify connection string in `.env` file
4. Test connection: `docker exec -it loyalty-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin`

### Build Issues
1. Clean Docker cache: `docker system prune -a`
2. Rebuild without cache: `docker-compose build --no-cache`
3. Check Dockerfile syntax and dependencies

## Development Workflow

1. **Start services**: `./docker-scripts.sh start`
2. **Make code changes** in your local `src/` directory
3. **Rebuild and restart**: `./docker-scripts.sh build`
4. **Test your API** at http://localhost:3000
5. **View logs**: `./docker-scripts.sh logs`
6. **Stop services**: `./docker-scripts.sh stop`

## Production Considerations

For production deployment:
1. Change default passwords
2. Use environment-specific `.env` files
3. Configure proper logging
4. Set up monitoring and health checks
5. Use Docker secrets for sensitive data
6. Configure proper backup strategies for MongoDB
