# Version: 8
# Stage 1: Install dependencies
FROM node:22-slim AS deps
WORKDIR /app

# Install system dependencies required for native builds (like bcrypt)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for the build)
RUN npm install

# Stage 2: Build the application
FROM node:22-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run the build (This creates the .next folder)
RUN npm run build

# Stage 3: Production Runner
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the necessary files from the builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Copy localization files if they are needed at runtime
COPY --from=builder /app/i18n ./i18n

# CHANGED: Create the 'logs' directory and give the non-root user permission to write to it
RUN mkdir logs && chown nextjs:nodejs logs

# Switch to the non-root user
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]