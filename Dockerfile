FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy the entire backend folder
COPY backend/ ./backend/

# Move into backend directory
WORKDIR /app/backend

# Install only production deps
RUN npm install --production

# Expose app port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]

