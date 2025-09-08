#!/bin/bash

# Check VPS service status
echo "🔍 Checking VPS service status..."
echo "🌐 VPS IP: 65.108.27.195"
echo ""

# Check if Docker containers are running
echo "🐳 Checking Docker containers..."
if command -v docker &> /dev/null; then
    echo "Docker containers status:"
    docker compose ps
    echo ""
else
    echo "❌ Docker is not installed or not running"
    exit 1
fi

# Check if ports are listening
echo "🔌 Checking if ports are listening..."
echo "Port 3000 (Frontend):"
netstat -tlnp | grep :3000 || echo "❌ Port 3000 not listening"
echo ""

echo "Port 3001 (Backend):"
netstat -tlnp | grep :3001 || echo "❌ Port 3001 not listening"
echo ""

echo "Port 27017 (MongoDB):"
netstat -tlnp | grep :27017 || echo "❌ Port 27017 not listening"
echo ""

# Check firewall status
echo "🔥 Checking firewall status..."
if command -v ufw &> /dev/null; then
    echo "UFW Status:"
    ufw status
    echo ""
fi

if command -v iptables &> /dev/null; then
    echo "iptables rules for our ports:"
    iptables -L INPUT -n | grep -E "(3000|3001|27017)" || echo "No iptables rules found for our ports"
    echo ""
fi

# Test local connectivity
echo "🧪 Testing local connectivity..."
echo "Testing localhost:3000 (Frontend):"
curl -s --connect-timeout 5 http://localhost:3000 > /dev/null && echo "✅ Frontend accessible locally" || echo "❌ Frontend not accessible locally"

echo "Testing localhost:3001 (Backend):"
curl -s --connect-timeout 5 http://localhost:3001 > /dev/null && echo "✅ Backend accessible locally" || echo "❌ Backend not accessible locally"

echo "Testing localhost:3001/api (API):"
curl -s --connect-timeout 5 http://localhost:3001/api > /dev/null && echo "✅ API accessible locally" || echo "❌ API not accessible locally"
