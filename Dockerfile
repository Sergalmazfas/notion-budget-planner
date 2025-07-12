# Stage 1: Build React frontend
FROM node:20-slim as frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN NODE_OPTIONS=--openssl-legacy-provider npm run build

# Stage 2: Prepare Production Server
FROM node:20-slim
WORKDIR /app

# Copy root package.json and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy server code and the built frontend from the previous stage
COPY server/ ./server/
COPY --from=frontend /app/client/build ./server/public

# Set environment for production
ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

# Start the server
CMD ["npm", "start"] 