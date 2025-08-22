#!/bin/bash

# Start MongoDB Database Only
echo "🗄️  Starting MongoDB Database..."

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

# Start MongoDB only
echo "🚀 Starting MongoDB..."
$DOCKER_COMPOSE -f docker-compose.db.yml up -d

echo ""
echo "✅ MongoDB started!"
echo "   🗄️  MongoDB: localhost:27017"
echo "   📊 Database: loyalty"
echo "   👤 Username: admin"
echo "   🔑 Password: admin123"
echo ""
echo "📋 Commands:"
echo "   View logs: $DOCKER_COMPOSE -f docker-compose.db.yml logs -f"
echo "   Stop: $DOCKER_COMPOSE -f docker-compose.db.yml down"
echo "   Restart: $DOCKER_COMPOSE -f docker-compose.db.yml restart"
echo ""
echo "💡 Now you can run: npm run dev (for local frontend + backend)"
