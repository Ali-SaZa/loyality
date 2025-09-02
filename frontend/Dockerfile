# Development Dockerfile for Frontend (Next.js)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm (since the project uses pnpm)
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start in development mode with hot reloading
CMD ["pnpm", "dev"]
