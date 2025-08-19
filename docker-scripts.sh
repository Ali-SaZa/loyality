#!/bin/bash

# Docker management script for Loyalty API

case "$1" in
  "start")
    echo "Starting Loyalty API and MongoDB..."
    docker-compose up -d
    echo "Services started! API will be available at http://localhost:3000"
    echo "MongoDB will be available at localhost:27017"
    ;;
  "stop")
    echo "Stopping services..."
    docker-compose down
    echo "Services stopped!"
    ;;
  "restart")
    echo "Restarting services..."
    docker-compose restart
    echo "Services restarted!"
    ;;
  "logs")
    echo "Showing logs..."
    docker-compose logs -f
    ;;
  "build")
    echo "Building and starting services..."
    docker-compose up --build -d
    echo "Services built and started!"
    ;;
  "clean")
    echo "Cleaning up containers and volumes..."
    docker-compose down -v
    docker system prune -f
    echo "Cleanup completed!"
    ;;
  "status")
    echo "Service status:"
    docker-compose ps
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|logs|build|clean|status}"
    echo ""
    echo "Commands:"
    echo "  start   - Start the services"
    echo "  stop    - Stop the services"
    echo "  restart - Restart the services"
    echo "  logs    - Show service logs"
    echo "  build   - Build and start services"
    echo "  clean   - Clean up containers and volumes"
    echo "  status  - Show service status"
    exit 1
    ;;
esac
