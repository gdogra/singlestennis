FROM node:20-alpine

# Set container working directory
WORKDIR /app

# Copy backend code recursively into /app/backend/
COPY backend backend

# Move into backend directory
WORKDIR /app/backend

# Install backend dependencies
RUN npm install --production

# Expose port for Railway
EXPOSE 8080

# Run the server
CMD ["node", "server.js"]

