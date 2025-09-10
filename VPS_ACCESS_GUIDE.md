# VPS Access Guide

This guide explains how to configure your VPS to access the Loyalty Program from your local system.

## Prerequisites

- Your VPS IP address
- SSH access to your VPS
- Docker and Docker Compose installed on VPS

## Step-by-Step Setup

### 1. Get Your VPS IP Address

First, find your VPS IP address:

```bash
# On your VPS, run:
curl ifconfig.me
# or
hostname -I
```

### 2. Configure VPS for External Access

On your VPS, run the setup script:

```bash
./setup-vps.sh YOUR_VPS_IP
```

Example:

```bash
./setup-vps.sh 123.456.789.012
```

This script will:

- Create a production environment file
- Update Docker Compose to bind to all interfaces
- Configure firewall rules
- Set up proper CORS settings

### 3. Restart Services

After configuration, restart your services:

```bash
# Stop current services
docker compose down

# Start with new configuration
./start-docker.sh
```

### 4. Test Access from Your Local System

From your local computer, test the connections:

```bash
# Test frontend
curl http://YOUR_VPS_IP:3000

# Test backend
curl http://YOUR_VPS_IP:3001

# Test API documentation
curl http://YOUR_VPS_IP:3001/api
```

## Access URLs

Once configured, you can access your services at:

- **Frontend**: `http://YOUR_VPS_IP:3000`
- **Backend API**: `http://YOUR_VPS_IP:3001`
- **API Documentation**: `http://YOUR_VPS_IP:3001/api`
- **MongoDB**: `YOUR_VPS_IP:27017`

## Security Considerations

### 1. Change Default Passwords

Update the default MongoDB credentials in `.env`:

```
MONGO_INITDB_ROOT_USERNAME=your_secure_username
MONGO_INITDB_ROOT_PASSWORD=your_secure_password
```

### 2. Update JWT Secret

Change the JWT secret in `.env`:

```
JWT_SECRET=your-super-secure-jwt-secret-key
```

### 3. Configure Firewall

The setup script configures basic firewall rules, but consider:

- Restricting access to specific IP ranges
- Using a reverse proxy (nginx)
- Setting up SSL/TLS certificates

### 4. Use Domain Name (Optional)

Instead of IP address, you can use a domain name:

1. Point your domain to your VPS IP
2. Update `.env` with your domain
3. Configure SSL certificates

## Troubleshooting

### Port Not Accessible

1. Check if services are running: `docker compose ps`
2. Verify firewall rules: `ufw status` or `iptables -L`
3. Check if ports are bound: `netstat -tlnp | grep :3000`

### CORS Errors

If you see CORS errors in browser console:

1. Update `ALLOWED_ORIGINS` in `.env`
2. Restart services: `docker compose restart`

### Connection Refused

1. Check if Docker containers are running
2. Verify port bindings in `docker-compose.yml`
3. Check VPS firewall settings

## Monitoring

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f mongodb
```

### Check Service Status

```bash
docker compose ps
```

### Restart Services

```bash
docker compose restart
```

## Production Recommendations

For production deployment:

1. **Use HTTPS**: Set up SSL certificates
2. **Reverse Proxy**: Use nginx or Apache
3. **Load Balancing**: For high traffic
4. **Monitoring**: Set up logging and monitoring
5. **Backup**: Regular database backups
6. **Updates**: Keep dependencies updated

## Quick Commands Reference

```bash
# Setup VPS
./setup-vps.sh YOUR_VPS_IP

# Start services
./start-docker.sh

# Stop services
docker compose down

# View logs
docker compose logs -f

# Restart services
docker compose restart

# Check status
docker compose ps
```
