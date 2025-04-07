FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy backend files into container context
COPY backend/package.json backend/package-lock.json ./
RUN npm install --production

# Copy the rest of the backend code
COPY backend/ ./

EXPOSE 8080
CMD ["node", "server.js"]

