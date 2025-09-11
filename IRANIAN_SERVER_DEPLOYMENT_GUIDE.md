# Iranian Server Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying your Loyalty Program application on an Iranian server using Docker.

## Prerequisites

### Server Requirements
- **Operating System**: Ubuntu 20.04+ or CentOS 7+
- **RAM**: Minimum 2GB (Recommended: 4GB+)
- **Storage**: Minimum 5GB free space (Recommended: 20GB+)
- **CPU**: 2+ cores
- **Network**: Stable internet connection

### Software Requirements
- Docker Engine 20.10+
- Docker Compose 2.0+
- Git
- curl/wget

## Quick Start

### 1. Test Docker Connectivity
Before deploying, test if your server can connect to Docker services:

```bash
# Run the comprehensive Docker test
./test-docker-connectivity.sh
```

This script will test:
- Docker service availability
- Network connectivity
- Image pulling capabilities
- Build capabilities
- System resources
- Port availability

### 2. Deploy the Application
Run the automated deployment script:

```bash
# Run the deployment script
./deploy-iranian-server.sh
```

The script will:
- Check prerequisites
- Install Docker if needed
- Configure environment
- Set up firewall
- Deploy the application
- Set up monitoring

## Manual Deployment Steps

If you prefer manual deployment or need to troubleshoot:

### 1. Install Docker

```bash
# Update package list
sudo apt-get update

# Install required packages
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Log out and log back in for group changes to take effect
```

### 2. Configure Environment

```bash
# Copy production environment file
cp env.production .env

# Edit the .env file with your server details
nano .env
```

Update these variables in `.env`:
```bash
# Replace with your server IP
ALLOWED_ORIGINS=http://YOUR_SERVER_IP:3000,http://localhost:3000,http://127.0.0.1:3000,http://yourdomain.com,https://yourdomain.com
NEXT_PUBLIC_API_URL=http://YOUR_SERVER_IP:3001

# Update MongoDB connection if needed
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/loyalty?authSource=admin
```

### 3. Deploy with Docker Compose

```bash
# Build and start all services
docker compose up -d --build

# Check service status
docker compose ps

# View logs
docker compose logs -f
```

### 4. Configure Firewall

```bash
# Allow necessary ports
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 3001

# Enable firewall
sudo ufw enable
```

## Service Management

### Check Service Status
```bash
# View running containers
docker compose ps

# Check logs
docker compose logs -f

# Check specific service logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb
```

### Restart Services
```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart backend
```

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker compose up -d --build
```

### Stop Services
```bash
# Stop all services
docker compose down

# Stop and remove volumes (WARNING: This will delete data)
docker compose down -v
```

## Monitoring and Maintenance

### System Monitoring
```bash
# Run the monitoring script
./monitor.sh

# Check system resources
htop
df -h
free -h
```

### Database Backup
```bash
# Create backup
docker compose exec mongodb mongodump --out /backup/$(date +%Y%m%d_%H%M%S)

# Restore backup
docker compose exec mongodb mongorestore /backup/backup_folder
```

### Log Management
```bash
# View application logs
docker compose logs --tail=100

# Follow logs in real-time
docker compose logs -f

# Save logs to file
docker compose logs > application.log
```

## Troubleshooting

### Common Issues

#### 1. Docker Service Not Running
```bash
# Start Docker service
sudo systemctl start docker

# Check Docker status
sudo systemctl status docker
```

#### 2. Permission Denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and log back in
```

#### 3. Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :3000

# Kill the process
sudo kill -9 PID
```

#### 4. Out of Disk Space
```bash
# Clean up Docker
docker system prune -a

# Remove unused volumes
docker volume prune
```

#### 5. Network Connectivity Issues
```bash
# Test connectivity
ping 8.8.8.8
curl -I https://registry-1.docker.io/v2/

# Check DNS
nslookup google.com
```

### Log Analysis
```bash
# Check for errors
docker compose logs | grep -i error

# Check for warnings
docker compose logs | grep -i warning

# Check specific service
docker compose logs backend | grep -i error
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong passwords for MongoDB
- Rotate JWT secrets regularly

### 2. Firewall Configuration
- Only open necessary ports
- Use fail2ban for additional protection
- Consider using a reverse proxy

### 3. SSL/TLS
- Use Let's Encrypt for free SSL certificates
- Configure HTTPS redirects
- Use strong cipher suites

### 4. Database Security
- Use authentication for MongoDB
- Enable SSL for database connections
- Regular backups

## Performance Optimization

### 1. Resource Limits
Add resource limits to `docker-compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### 2. Caching
- Enable Redis for session caching
- Use CDN for static assets
- Implement application-level caching

### 3. Database Optimization
- Create appropriate indexes
- Monitor slow queries
- Regular maintenance

## Backup Strategy

### 1. Database Backups
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker compose exec mongodb mongodump --out /backup/$DATE
```

### 2. Application Backups
```bash
# Backup application code
tar -czf app_backup_$(date +%Y%m%d).tar.gz .
```

### 3. Configuration Backups
```bash
# Backup configuration files
cp .env .env.backup
cp docker-compose.yml docker-compose.yml.backup
```

## Scaling Considerations

### 1. Horizontal Scaling
- Use load balancers
- Implement session sharing
- Database clustering

### 2. Vertical Scaling
- Increase server resources
- Optimize application code
- Use caching strategies

## Support and Maintenance

### Regular Tasks
- [ ] Monitor system resources
- [ ] Check application logs
- [ ] Update dependencies
- [ ] Backup databases
- [ ] Security updates
- [ ] Performance monitoring

### Emergency Procedures
- [ ] Service restart procedures
- [ ] Database recovery
- [ ] Rollback procedures
- [ ] Contact information

## Contact and Support

For issues specific to Iranian server deployment:
- Check network connectivity to international services
- Verify DNS resolution
- Test package manager access
- Monitor firewall rules

---

**Note**: This deployment is specifically optimized for Iranian servers and includes considerations for potential network restrictions and connectivity issues.
