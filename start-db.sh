#!/bin/bash

# Start MongoDB Database Only
echo "🗄️  Starting MongoDB Database..."

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

# Start MongoDB only
echo "🚀 Starting MongoDB..."
docker-compose -f docker-compose.db.yml up -d

echo ""
echo "✅ MongoDB started!"
echo "   🗄️  MongoDB: localhost:27017"
echo "   📊 Database: loyalty"
echo "   👤 Username: admin"
echo "   🔑 Password: admin123"
echo ""
echo "📋 Commands:"
echo "   View logs: docker-compose -f docker-compose.db.yml logs -f"
echo "   Stop: docker-compose -f docker-compose.db.yml down"
echo "   Restart: docker-compose -f docker-compose.db.yml restart"
echo ""
echo "💡 Now you can run: npm run dev (for local frontend + backend)"
