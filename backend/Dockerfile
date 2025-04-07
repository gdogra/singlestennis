# backend/Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies (separate layer for caching)
COPY package.json package-lock.json ./
RUN npm install --production

# Copy all files to the container
COPY . .

# Expose the port used by your app
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]

