# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package.json ./
COPY package-lock.json ./

# Copy frontend and backend package.json files
COPY frontend/package.json frontend/
COPY frontend/package-lock.json frontend/
COPY backend/package.json backend/
COPY backend/package-lock.json backend/


# Copy all source code
COPY . .

# Install root, frontend, and backend dependencies & build frontend
RUN GENERATE_SOURCEMAP=false NODE_OPTIONS=--openssl-legacy-provider npm run prod-build

# Expose backend port (default: 3001, change if needed)
EXPOSE 3001

# Start backend (serves frontend build)
CMD ["npm", "start"]
