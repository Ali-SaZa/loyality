#!/bin/bash

# VPS Setup Script for External Access
echo "🌐 Setting up VPS for external access..."

# Check if VPS_IP is provided
if [ -z "$1" ]; then
    echo "❌ Please provide your VPS IP address:"
    echo "   Usage: ./setup-vps.sh YOUR_VPS_IP"
    echo "   Example: ./setup-vps.sh 123.456.789.012"
    exit 1
fi

VPS_IP=$1
echo "🔧 Configuring for VPS IP: $VPS_IP"

# Create production environment file
echo "📝 Creating production environment file..."
cp env.production .env

# Replace placeholders with actual VPS IP
sed -i "s/YOUR_VPS_IP/$VPS_IP/g" .env

# Update Docker Compose to bind to all interfaces
echo "🔧 Updating Docker Compose configuration..."
if [ -f "docker-compose.yml" ]; then
    # Backup original file
    cp docker-compose.yml docker-compose.yml.backup
    
    # Update port bindings to bind to all interfaces
    sed -i 's/- "27017:27017"/- "0.0.0.0:27017:27017"/g' docker-compose.yml
    sed -i 's/- "${BACKEND_PORT}:3001"/- "0.0.0.0:${BACKEND_PORT}:3001"/g' docker-compose.yml
    sed -i 's/- "${FRONTEND_PORT}:3000"/- "0.0.0.0:${FRONTEND_PORT}:3000"/g' docker-compose.yml
    
    echo "✅ Docker Compose updated to bind to all interfaces"
fi

# Check if UFW firewall is active
if command -v ufw &> /dev/null; then
    echo "🔥 Configuring UFW firewall..."
    ufw allow 3000/tcp
    ufw allow 3001/tcp
    ufw allow 27017/tcp
    echo "✅ Firewall rules added for ports 3000, 3001, and 27017"
fi

# Check if iptables is being used
if command -v iptables &> /dev/null; then
    echo "🔥 Configuring iptables..."
    iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
    iptables -A INPUT -p tcp --dport 3001 -j ACCEPT
    iptables -A INPUT -p tcp --dport 27017 -j ACCEPT
    echo "✅ iptables rules added"
fi

echo ""
echo "✅ VPS configuration complete!"
echo ""
echo "🌐 Your services will be available at:"
echo "   Frontend: http://$VPS_IP:3000"
echo "   Backend: http://$VPS_IP:3001"
echo "   API Docs: http://$VPS_IP:3001/api"
echo "   MongoDB: $VPS_IP:27017"
echo ""
echo "🚀 To start the services:"
echo "   ./start-docker.sh"
echo ""
echo "📋 To check if services are running:"
echo "   docker compose ps"
echo ""
echo "🔍 To view logs:"
echo "   docker compose logs -f"
