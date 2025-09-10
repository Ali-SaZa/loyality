#!/bin/bash

# Hybrid Development Setup: MongoDB in Docker + Local Frontend/Backend
echo "🚀 Starting Hybrid Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
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

# Determine which docker compose command to use
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Neither 'docker-compose' nor 'docker compose' command found."
    echo "   Please install Docker Compose or ensure Docker is running."
    exit 1
fi

echo "🔧 Using: $DOCKER_COMPOSE"

# Start MongoDB in Docker
echo "🗄️  Starting MongoDB in Docker..."
$DOCKER_COMPOSE -f docker-compose.db.yml up -d

# Wait a moment for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 5

# Check if MongoDB is running
if $DOCKER_COMPOSE -f docker-compose.db.yml ps mongodb | grep -q "Up"; then
    echo "✅ MongoDB is running!"
else
    echo "❌ MongoDB failed to start. Check logs with: $DOCKER_COMPOSE -f docker-compose.db.yml logs -f"
    exit 1
fi

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set default ports if not defined
BACKEND_PORT=${BACKEND_PORT:-5555}
FRONTEND_PORT=${FRONTEND_PORT:-4444}
MONGODB_PORT=${MONGODB_PORT:-27018}

echo ""
echo "🚀 Starting Frontend and Backend locally..."
echo "   🗄️  MongoDB: localhost:$MONGODB_PORT (Docker)"
echo "   🔌 Backend: Will start on port $BACKEND_PORT (Local)"
echo "   🌐 Frontend: Will start on port 4444 (Local)"
echo ""

# Start frontend and backend locally
cd frontend && npm run dev
