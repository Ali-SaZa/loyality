#!/bin/bash

# Hybrid Development Setup: MongoDB in Docker + Local Frontend/Backend
echo "🚀 Starting Hybrid Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if env.docker exists, if not create from example
if [ ! -f ".env" ]; then
    if [ -f "env.docker" ]; then
        echo "📝 Creating .env from env.docker..."
        cp env.docker .env
    else
        echo "❌ No environment file found. Please create .env or env.docker"
        exit 1
    fi
fi

# Start MongoDB in Docker
echo "🗄️  Starting MongoDB in Docker..."
docker-compose -f docker-compose.db.yml up -d

# Wait a moment for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 5

# Check if MongoDB is running
if docker-compose -f docker-compose.db.yml ps mongodb | grep -q "Up"; then
    echo "✅ MongoDB is running!"
else
    echo "❌ MongoDB failed to start. Check logs with: npm run dev:db:logs"
    exit 1
fi

echo ""
echo "🚀 Starting Frontend and Backend locally..."
echo "   🗄️  MongoDB: localhost:27017 (Docker)"
echo "   🔌 Backend: Will start on port 3001 (Local)"
echo "   🌐 Frontend: Will start on port 3000 (Local)"
echo ""

# Start frontend and backend locally
npm run dev
