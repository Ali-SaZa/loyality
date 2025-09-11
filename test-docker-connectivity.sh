#!/bin/bash

# Comprehensive Docker Connectivity Testing Script for Iranian Servers
# This script tests all Docker components needed for deployment

echo "🐳 Docker Connectivity Testing for Iranian Server Deployment"
echo "=========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "SUCCESS" ]; then
        echo -e "${GREEN}✅ $message${NC}"
    elif [ "$status" = "ERROR" ]; then
        echo -e "${RED}❌ $message${NC}"
    elif [ "$status" = "WARNING" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}"
    elif [ "$status" = "INFO" ]; then
        echo -e "${BLUE}ℹ️  $message${NC}"
    fi
}

# Function to test command availability
test_command() {
    local cmd=$1
    local name=$2
    if command -v "$cmd" &> /dev/null; then
        print_status "SUCCESS" "$name is available: $(which $cmd)"
        return 0
    else
        print_status "ERROR" "$name is not installed or not in PATH"
        return 1
    fi
}

# Function to test Docker service
test_docker_service() {
    print_status "INFO" "Testing Docker service..."
    
    if ! docker info > /dev/null 2>&1; then
        print_status "ERROR" "Docker service is not running or not accessible"
        print_status "INFO" "Try: sudo systemctl start docker"
        return 1
    fi
    
    print_status "SUCCESS" "Docker service is running"
    
    # Test Docker version
    local docker_version=$(docker --version)
    print_status "INFO" "Docker version: $docker_version"
    
    # Test Docker Compose
    if docker compose version &> /dev/null; then
        local compose_version=$(docker compose version)
        print_status "SUCCESS" "Docker Compose is available: $compose_version"
    elif command -v docker-compose &> /dev/null; then
        local compose_version=$(docker-compose --version)
        print_status "SUCCESS" "Docker Compose (legacy) is available: $compose_version"
    else
        print_status "ERROR" "Docker Compose is not available"
        return 1
    fi
    
    return 0
}

# Function to test network connectivity
test_network_connectivity() {
    print_status "INFO" "Testing network connectivity..."
    
    # Test basic internet connectivity
    if ping -c 1 8.8.8.8 &> /dev/null; then
        print_status "SUCCESS" "Basic internet connectivity works"
    else
        print_status "WARNING" "Basic internet connectivity test failed"
    fi
    
    # Test DNS resolution
    if nslookup google.com &> /dev/null; then
        print_status "SUCCESS" "DNS resolution works"
    else
        print_status "WARNING" "DNS resolution test failed"
    fi
    
    # Test Docker Hub connectivity (important for pulling images)
    if curl -s --connect-timeout 10 https://registry-1.docker.io/v2/ &> /dev/null; then
        print_status "SUCCESS" "Docker Hub connectivity works"
    else
        print_status "WARNING" "Docker Hub connectivity test failed - this might affect image pulling"
    fi
    
    # Test npm registry connectivity
    if curl -s --connect-timeout 10 https://registry.npmjs.org/ &> /dev/null; then
        print_status "SUCCESS" "NPM registry connectivity works"
    else
        print_status "WARNING" "NPM registry connectivity test failed"
    fi
}

# Function to test Docker image pulling
test_docker_pull() {
    print_status "INFO" "Testing Docker image pulling capabilities..."
    
    # Test pulling a small image
    print_status "INFO" "Testing pull of alpine:latest..."
    if docker pull alpine:latest &> /dev/null; then
        print_status "SUCCESS" "Successfully pulled alpine:latest"
        docker rmi alpine:latest &> /dev/null
    else
        print_status "ERROR" "Failed to pull alpine:latest"
        return 1
    fi
    
    # Test pulling Node.js image (needed for your project)
    print_status "INFO" "Testing pull of node:18-alpine..."
    if docker pull node:18-alpine &> /dev/null; then
        print_status "SUCCESS" "Successfully pulled node:18-alpine"
        docker rmi node:18-alpine &> /dev/null
    else
        print_status "ERROR" "Failed to pull node:18-alpine"
        return 1
    fi
    
    # Test pulling MongoDB image
    print_status "INFO" "Testing pull of mongo:latest..."
    if docker pull mongo:latest &> /dev/null; then
        print_status "SUCCESS" "Successfully pulled mongo:latest"
        docker rmi mongo:latest &> /dev/null
    else
        print_status "ERROR" "Failed to pull mongo:latest"
        return 1
    fi
    
    return 0
}

# Function to test Docker build capabilities
test_docker_build() {
    print_status "INFO" "Testing Docker build capabilities..."
    
    # Create a simple test Dockerfile
    cat > /tmp/test.Dockerfile << EOF
FROM alpine:latest
RUN echo "Test build successful"
CMD ["echo", "Hello from test container"]
EOF
    
    if docker build -f /tmp/test.Dockerfile -t test-build /tmp &> /dev/null; then
        print_status "SUCCESS" "Docker build test successful"
        docker rmi test-build &> /dev/null
        rm /tmp/test.Dockerfile
        return 0
    else
        print_status "ERROR" "Docker build test failed"
        rm /tmp/test.Dockerfile
        return 1
    fi
}

# Function to test Docker Compose functionality
test_docker_compose() {
    print_status "INFO" "Testing Docker Compose functionality..."
    
    # Create a simple test compose file
    cat > /tmp/test-compose.yml << EOF
version: '3.8'
services:
  test-service:
    image: alpine:latest
    command: echo "Compose test successful"
EOF
    
    # Determine compose command
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    if $COMPOSE_CMD -f /tmp/test-compose.yml up --abort-on-container-exit &> /dev/null; then
        print_status "SUCCESS" "Docker Compose test successful"
        $COMPOSE_CMD -f /tmp/test-compose.yml down &> /dev/null
        rm /tmp/test-compose.yml
        return 0
    else
        print_status "ERROR" "Docker Compose test failed"
        rm /tmp/test-compose.yml
        return 1
    fi
}

# Function to test system resources
test_system_resources() {
    print_status "INFO" "Testing system resources..."
    
    # Check available disk space
    local disk_space=$(df -h / | awk 'NR==2 {print $4}')
    print_status "INFO" "Available disk space: $disk_space"
    
    # Check available memory
    local memory=$(free -h | awk 'NR==2 {print $7}')
    print_status "INFO" "Available memory: $memory"
    
    # Check CPU cores
    local cpu_cores=$(nproc)
    print_status "INFO" "CPU cores: $cpu_cores"
    
    # Check if system has enough resources (minimum requirements)
    local disk_gb=$(df / | awk 'NR==2 {print int($4/1024/1024)}')
    local memory_gb=$(free -g | awk 'NR==2 {print int($7)}')
    
    if [ "$disk_gb" -lt 5 ]; then
        print_status "WARNING" "Low disk space: ${disk_gb}GB available (recommended: 5GB+)"
    else
        print_status "SUCCESS" "Sufficient disk space: ${disk_gb}GB"
    fi
    
    if [ "$memory_gb" -lt 2 ]; then
        print_status "WARNING" "Low memory: ${memory_gb}GB available (recommended: 2GB+)"
    else
        print_status "SUCCESS" "Sufficient memory: ${memory_gb}GB"
    fi
}

# Function to test port availability
test_port_availability() {
    print_status "INFO" "Testing port availability..."
    
    local ports=(3000 3001 27017 27018)
    
    for port in "${ports[@]}"; do
        if netstat -tuln | grep -q ":$port "; then
            print_status "WARNING" "Port $port is already in use"
        else
            print_status "SUCCESS" "Port $port is available"
        fi
    done
}

# Function to test project-specific requirements
test_project_requirements() {
    print_status "INFO" "Testing project-specific requirements..."
    
    # Check if we're in the project directory
    if [ ! -f "docker-compose.yml" ]; then
        print_status "ERROR" "docker-compose.yml not found. Please run this script from the project root."
        return 1
    fi
    
    # Check if environment file exists
    if [ ! -f ".env" ] && [ ! -f "env.production" ]; then
        print_status "WARNING" "No environment file found (.env or env.production)"
        print_status "INFO" "You'll need to create one before deployment"
    else
        print_status "SUCCESS" "Environment file found"
    fi
    
    # Check if backend Dockerfile exists
    if [ -f "backend/Dockerfile" ]; then
        print_status "SUCCESS" "Backend Dockerfile found"
    else
        print_status "ERROR" "Backend Dockerfile not found"
        return 1
    fi
    
    # Check if frontend Dockerfile exists
    if [ -f "frontend/Dockerfile" ]; then
        print_status "SUCCESS" "Frontend Dockerfile found"
    else
        print_status "ERROR" "Frontend Dockerfile not found"
        return 1
    fi
    
    return 0
}

# Main testing function
run_all_tests() {
    local all_tests_passed=true
    
    echo ""
    print_status "INFO" "Starting comprehensive Docker testing..."
    echo ""
    
    # Test 1: Command availability
    print_status "INFO" "=== Testing Command Availability ==="
    test_command "docker" "Docker" || all_tests_passed=false
    test_command "curl" "cURL" || all_tests_passed=false
    test_command "ping" "Ping" || all_tests_passed=false
    test_command "netstat" "Netstat" || all_tests_passed=false
    
    echo ""
    
    # Test 2: Docker service
    print_status "INFO" "=== Testing Docker Service ==="
    test_docker_service || all_tests_passed=false
    
    echo ""
    
    # Test 3: Network connectivity
    print_status "INFO" "=== Testing Network Connectivity ==="
    test_network_connectivity
    
    echo ""
    
    # Test 4: Docker image pulling
    print_status "INFO" "=== Testing Docker Image Pulling ==="
    test_docker_pull || all_tests_passed=false
    
    echo ""
    
    # Test 5: Docker build capabilities
    print_status "INFO" "=== Testing Docker Build Capabilities ==="
    test_docker_build || all_tests_passed=false
    
    echo ""
    
    # Test 6: Docker Compose functionality
    print_status "INFO" "=== Testing Docker Compose Functionality ==="
    test_docker_compose || all_tests_passed=false
    
    echo ""
    
    # Test 7: System resources
    print_status "INFO" "=== Testing System Resources ==="
    test_system_resources
    
    echo ""
    
    # Test 8: Port availability
    print_status "INFO" "=== Testing Port Availability ==="
    test_port_availability
    
    echo ""
    
    # Test 9: Project-specific requirements
    print_status "INFO" "=== Testing Project Requirements ==="
    test_project_requirements || all_tests_passed=false
    
    echo ""
    echo "=========================================================="
    
    if [ "$all_tests_passed" = true ]; then
        print_status "SUCCESS" "🎉 All critical tests passed! Your server is ready for deployment."
        echo ""
        print_status "INFO" "Next steps:"
        echo "  1. Create .env file from env.production"
        echo "  2. Update environment variables for your server"
        echo "  3. Run: docker compose up -d"
        echo "  4. Check logs: docker compose logs -f"
    else
        print_status "ERROR" "❌ Some tests failed. Please fix the issues before deployment."
        echo ""
        print_status "INFO" "Common solutions:"
        echo "  - Install Docker: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
        echo "  - Start Docker service: sudo systemctl start docker"
        echo "  - Add user to docker group: sudo usermod -aG docker \$USER"
        echo "  - Check firewall settings for blocked ports"
    fi
    
    echo ""
}

# Run the tests
run_all_tests
