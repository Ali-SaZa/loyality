#!/bin/bash

# Production Deployment Script for Iranian Server
# This script handles the complete deployment process

echo "🚀 Iranian Server Deployment Script"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "SUCCESS" ]; then
        echo -e "${GREEN}✅ $message${NC}"
    elif [ "$status" = "ERROR" ]; then
        echo -e "${RED}❌ $message${NC}"
    elif [ "$status" = "WARNING" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}"
    elif [ "$status" = "INFO" ]; then
        echo -e "${BLUE}ℹ️  $message${NC}"
    fi
}

# Function to check if running as root
check_root() {
    if [ "$EUID" -eq 0 ]; then
        print_status "WARNING" "Running as root. Consider using a non-root user for security."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "INFO" "Exiting. Please run as a non-root user."
            exit 1
        fi
    fi
}

# Function to check prerequisites
check_prerequisites() {
    print_status "INFO" "Checking prerequisites..."
    
    # Check if Docker is installed and running
    if ! docker info > /dev/null 2>&1; then
        print_status "ERROR" "Docker is not running or not installed"
        print_status "INFO" "Installing Docker..."
        install_docker
    else
        print_status "SUCCESS" "Docker is running"
    fi
    
    # Check if Docker Compose is available
    if ! docker compose version &> /dev/null && ! command -v docker-compose &> /dev/null; then
        print_status "ERROR" "Docker Compose is not available"
        exit 1
    fi
    
    # Check if git is available
    if ! command -v git &> /dev/null; then
        print_status "ERROR" "Git is not installed"
        exit 1
    fi
    
    print_status "SUCCESS" "All prerequisites met"
}

# Function to install Docker
install_docker() {
    print_status "INFO" "Installing Docker..."
    
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
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    
    # Start Docker service
    sudo systemctl start docker
    sudo systemctl enable docker
    
    print_status "SUCCESS" "Docker installed successfully"
    print_status "WARNING" "Please log out and log back in for group changes to take effect"
}

# Function to setup environment
setup_environment() {
    print_status "INFO" "Setting up environment..."
    
    # Check if .env exists, if not create from env.production
    if [ ! -f ".env" ]; then
        if [ -f "env.production" ]; then
            print_status "INFO" "Creating .env from env.production..."
            cp env.production .env
            print_status "SUCCESS" ".env file created"
        else
            print_status "ERROR" "No environment file found (env.production)"
            exit 1
        fi
    else
        print_status "INFO" ".env file already exists"
    fi
    
    # Prompt for server-specific configuration
    echo ""
    print_status "INFO" "Please configure your server settings:"
    
    # Get server IP
    read -p "Enter your server IP address: " SERVER_IP
    if [ -z "$SERVER_IP" ]; then
        print_status "ERROR" "Server IP is required"
        exit 1
    fi
    
    # Get domain name (optional)
    read -p "Enter your domain name (optional): " DOMAIN_NAME
    
    # Update .env file with server-specific settings
    sed -i "s/65.108.27.195/$SERVER_IP/g" .env
    
    if [ ! -z "$DOMAIN_NAME" ]; then
        # Add domain to allowed origins
        sed -i "s|ALLOWED_ORIGINS=.*|ALLOWED_ORIGINS=http://$SERVER_IP:3000,http://localhost:3000,http://127.0.0.1:3000,http://$DOMAIN_NAME,https://$DOMAIN_NAME,http://www.$DOMAIN_NAME,https://www.$DOMAIN_NAME|g" .env
        sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://$SERVER_IP:3001|g" .env
    fi
    
    print_status "SUCCESS" "Environment configured for server: $SERVER_IP"
}

# Function to build and deploy
deploy_application() {
    print_status "INFO" "Starting deployment process..."
    
    # Determine compose command
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    print_status "INFO" "Using: $COMPOSE_CMD"
    
    # Stop any existing containers
    print_status "INFO" "Stopping existing containers..."
    $COMPOSE_CMD down --remove-orphans
    
    # Pull latest images
    print_status "INFO" "Pulling latest images..."
    $COMPOSE_CMD pull
    
    # Build and start services
    print_status "INFO" "Building and starting services..."
    $COMPOSE_CMD up -d --build
    
    # Wait for services to be ready
    print_status "INFO" "Waiting for services to be ready..."
    sleep 30
    
    # Check service status
    print_status "INFO" "Checking service status..."
    $COMPOSE_CMD ps
    
    # Check if services are running
    if $COMPOSE_CMD ps | grep -q "Up"; then
        print_status "SUCCESS" "Services are running!"
    else
        print_status "ERROR" "Some services failed to start"
        print_status "INFO" "Check logs with: $COMPOSE_CMD logs -f"
        exit 1
    fi
}

# Function to setup SSL (optional)
setup_ssl() {
    echo ""
    read -p "Do you want to setup SSL with Let's Encrypt? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "INFO" "Setting up SSL with Let's Encrypt..."
        
        # Check if certbot is installed
        if ! command -v certbot &> /dev/null; then
            print_status "INFO" "Installing certbot..."
            sudo apt-get update
            sudo apt-get install -y certbot python3-certbot-nginx
        fi
        
        # Get domain name
        read -p "Enter your domain name for SSL: " SSL_DOMAIN
        if [ -z "$SSL_DOMAIN" ]; then
            print_status "ERROR" "Domain name is required for SSL"
            return 1
        fi
        
        # Generate SSL certificate
        sudo certbot certonly --standalone -d $SSL_DOMAIN
        
        if [ $? -eq 0 ]; then
            print_status "SUCCESS" "SSL certificate generated for $SSL_DOMAIN"
            print_status "INFO" "You'll need to configure nginx or a reverse proxy to use the certificate"
        else
            print_status "ERROR" "Failed to generate SSL certificate"
        fi
    fi
}

# Function to setup firewall
setup_firewall() {
    print_status "INFO" "Setting up firewall rules..."
    
    # Check if ufw is available
    if command -v ufw &> /dev/null; then
        # Allow SSH
        sudo ufw allow ssh
        
        # Allow HTTP and HTTPS
        sudo ufw allow 80
        sudo ufw allow 443
        
        # Allow application ports
        sudo ufw allow 3000
        sudo ufw allow 3001
        
        # Enable firewall
        sudo ufw --force enable
        
        print_status "SUCCESS" "Firewall configured"
    else
        print_status "WARNING" "UFW not available, please configure firewall manually"
    fi
}

# Function to setup monitoring
setup_monitoring() {
    print_status "INFO" "Setting up basic monitoring..."
    
    # Create a simple monitoring script
    cat > monitor.sh << 'EOF'
#!/bin/bash
echo "=== System Status ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo "Disk Usage:"
df -h
echo ""
echo "Memory Usage:"
free -h
echo ""
echo "Docker Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "Application Logs (last 10 lines):"
docker compose logs --tail=10
EOF
    
    chmod +x monitor.sh
    print_status "SUCCESS" "Monitoring script created: ./monitor.sh"
}

# Function to show deployment summary
show_summary() {
    echo ""
    echo "=========================================================="
    print_status "SUCCESS" "🎉 Deployment completed successfully!"
    echo ""
    print_status "INFO" "Your application is now running at:"
    echo "  🌐 Frontend: http://$SERVER_IP:3000"
    echo "  🔌 Backend API: http://$SERVER_IP:3001"
    echo "  🗄️  MongoDB: localhost:27017"
    echo ""
    print_status "INFO" "Useful commands:"
    echo "  📊 Check status: docker compose ps"
    echo "  📝 View logs: docker compose logs -f"
    echo "  🔄 Restart: docker compose restart"
    echo "  🛑 Stop: docker compose down"
    echo "  📈 Monitor: ./monitor.sh"
    echo ""
    print_status "INFO" "Next steps:"
    echo "  1. Configure your domain DNS to point to $SERVER_IP"
    echo "  2. Set up a reverse proxy (nginx) for production"
    echo "  3. Configure SSL certificates"
    echo "  4. Set up automated backups"
    echo "  5. Configure monitoring and alerts"
    echo ""
}

# Main deployment function
main() {
    echo ""
    print_status "INFO" "Starting Iranian server deployment..."
    echo ""
    
    # Check if running as root
    check_root
    
    # Check prerequisites
    check_prerequisites
    
    # Setup environment
    setup_environment
    
    # Setup firewall
    setup_firewall
    
    # Deploy application
    deploy_application
    
    # Setup SSL (optional)
    setup_ssl
    
    # Setup monitoring
    setup_monitoring
    
    # Show summary
    show_summary
}

# Run main function
main "$@"
