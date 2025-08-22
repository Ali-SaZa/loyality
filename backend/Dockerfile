# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies and source code
RUN npm ci --only=production
RUN rm -rf src test dist/.tsbuildinfo

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
