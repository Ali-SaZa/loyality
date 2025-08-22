#!/bin/bash

# Simple Docker startup for Loyalty Program
echo "🐳 Starting Loyalty Program with Docker..."

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

# Start all services
echo "🚀 Starting all services..."
docker-compose up --build -d

echo ""
echo "✅ All services started!"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔌 Backend: http://localhost:3001"
echo "   🗄️  MongoDB: localhost:27017"
echo "   📚 API Docs: http://localhost:3001/api"
echo ""
echo "📋 Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop: docker-compose down"
echo "   Restart: docker-compose restart"
