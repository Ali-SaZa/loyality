#!/bin/bash

# Comprehensive VPS Troubleshooting Script
echo "🔧 VPS Troubleshooting for 65.108.27.195"
echo "=========================================="
echo ""

# Step 1: Check if services are running
echo "1️⃣ Checking if Docker services are running..."
if command -v docker &> /dev/null; then
    echo "Docker containers status:"
    docker compose ps
    echo ""
else
    echo "❌ Docker is not installed"
    exit 1
fi

# Step 2: Check if services are actually listening
echo "2️⃣ Checking if ports are listening..."
echo "Port 3000 (Frontend):"
netstat -tlnp | grep :3000 || echo "❌ Port 3000 not listening"
echo ""

echo "Port 3001 (Backend):"
netstat -tlnp | grep :3001 || echo "❌ Port 3001 not listening"
echo ""

echo "Port 27017 (MongoDB):"
netstat -tlnp | grep :27017 || echo "❌ Port 27017 not listening"
echo ""

# Step 3: Check Docker Compose configuration
echo "3️⃣ Checking Docker Compose configuration..."
echo "Current port bindings:"
grep -E "ports:" -A 3 docker-compose.yml || echo "❌ Could not find port bindings"
echo ""

# Step 4: Check environment variables
echo "4️⃣ Checking environment variables..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    echo "Key variables:"
    grep -E "(BACKEND_PORT|FRONTEND_PORT|NEXT_PUBLIC_API_URL|ALLOWED_ORIGINS)" .env || echo "❌ Missing key environment variables"
else
    echo "❌ .env file does not exist"
fi
echo ""

# Step 5: Test local connectivity
echo "5️⃣ Testing local connectivity..."
echo "Testing localhost:3000 (Frontend):"
curl -s --connect-timeout 5 http://localhost:3000 > /dev/null && echo "✅ Frontend accessible locally" || echo "❌ Frontend not accessible locally"

echo "Testing localhost:3001 (Backend):"
curl -s --connect-timeout 5 http://localhost:3001 > /dev/null && echo "✅ Backend accessible locally" || echo "❌ Backend not accessible locally"

echo "Testing localhost:3001/api (API):"
curl -s --connect-timeout 5 http://localhost:3001/api > /dev/null && echo "✅ API accessible locally" || echo "❌ API not accessible locally"
echo ""

# Step 6: Check logs
echo "6️⃣ Checking service logs..."
echo "Backend logs (last 10 lines):"
docker compose logs --tail=10 backend
echo ""

echo "Frontend logs (last 10 lines):"
docker compose logs --tail=10 frontend
echo ""

echo "MongoDB logs (last 10 lines):"
docker compose logs --tail=10 mongodb
echo ""

# Step 7: Provide solutions
echo "7️⃣ Solutions:"
echo ""
echo "If services are not running:"
echo "   docker compose up -d"
echo ""
echo "If ports are not listening:"
echo "   docker compose down"
echo "   docker compose up --build -d"
echo ""
echo "If .env file is missing:"
echo "   cp env.production .env"
echo ""
echo "If you need to restart everything:"
echo "   docker compose down"
echo "   ./setup-vps-quick.sh"
echo "   ./start-docker.sh"
