#!/bin/bash

# Loyalty Program Docker Startup Script
echo "🐳 Starting Loyalty Program with Docker..."

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
    echo "   Please install Docker Compose or ensure Docker Desktop is running."
    exit 1
fi

echo "🔧 Using: $DOCKER_COMPOSE"

# Start all services
echo "🚀 Starting all services..."
$DOCKER_COMPOSE up --build -d

echo ""
echo "✅ All services started!"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔌 Backend: http://localhost:3001"
echo "   🗄️  MongoDB: localhost:27017"
echo "   📚 API Docs: http://localhost:3001/api"
echo ""
echo "📋 Commands:"
echo "   View logs: $DOCKER_COMPOSE logs -f"
echo "   Stop: $DOCKER_COMPOSE down"
echo "   Restart: $DOCKER_COMPOSE restart"
