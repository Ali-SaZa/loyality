# Development Dockerfile for Frontend
FROM node:18-alpine

# Install dependencies for health checks
RUN apk add --no-cache wget

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start in development mode with hot reloading
CMD ["npm", "run", "dev"]
