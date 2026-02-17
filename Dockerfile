FROM node:18-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

# Install dependencies
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

# Copy application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Default command (overridden by docker-compose)
CMD ["npm", "run", "dev"]
