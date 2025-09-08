#!/bin/bash

# Test connectivity to VPS services
echo "🧪 Testing connectivity to VPS services..."
echo "🌐 VPS IP: 65.108.27.195"
echo ""

# Test frontend
echo "🔍 Testing Frontend (port 3000)..."
if curl -s --connect-timeout 5 http://65.108.27.195:3000 > /dev/null; then
    echo "✅ Frontend is accessible at http://65.108.27.195:3000"
else
    echo "❌ Frontend is not accessible"
fi

echo ""

# Test backend
echo "🔍 Testing Backend (port 3001)..."
if curl -s --connect-timeout 5 http://65.108.27.195:3001 > /dev/null; then
    echo "✅ Backend is accessible at http://65.108.27.195:3001"
else
    echo "❌ Backend is not accessible"
fi

echo ""

# Test API documentation
echo "🔍 Testing API Documentation..."
if curl -s --connect-timeout 5 http://65.108.27.195:3001/api > /dev/null; then
    echo "✅ API Documentation is accessible at http://65.108.27.195:3001/api"
else
    echo "❌ API Documentation is not accessible"
fi

echo ""

# Test MongoDB port (just check if port is open)
echo "🔍 Testing MongoDB port (27017)..."
if nc -z 65.108.27.195 27017 2>/dev/null; then
    echo "✅ MongoDB port 27017 is open"
else
    echo "❌ MongoDB port 27017 is not accessible"
fi

echo ""
echo "📋 Summary of accessible services:"
echo "   Frontend: http://65.108.27.195:3000"
echo "   Backend: http://65.108.27.195:3001"
echo "   API Docs: http://65.108.27.195:3001/api"
echo "   MongoDB: 65.108.27.195:27017"
