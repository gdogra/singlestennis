FROM node:20-alpine

WORKDIR /app

# Copy everything inside backend/
COPY backend backend
WORKDIR /app/backend

RUN npm install --production

EXPOSE 8080
CMD ["node", "server.js"]

