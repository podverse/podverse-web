FROM node:22-slim AS base
WORKDIR /opt/app

# Stage 1: Install dependencies
FROM base AS deps
# Install libc6-compat if you run into issues with sharp/swc on alpine/slim
# RUN apt-get update && apt-get install -y libc6-compat 

COPY package*.json ./

# Install all dependencies from package.json (includes podverse-helpers: ^5.1.0)
RUN npm install

# Stage 2: Build the app
FROM deps AS builder
COPY . .

# Ensure the source env file actually exists! 
# If you meant to use the example file, change this line.
COPY ./env/alpha-podverse.k.ser.ink.env ./.env.production 

RUN npm run build

# Stage 3: Run the app
FROM node:22-slim AS runner
WORKDIR /opt/app
ENV NODE_ENV=production
ENV PORT=3000

# Create a non-root user for security (Recommended)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the env file for production use
COPY --from=builder /opt/app/.env.production ./.env.production

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /opt/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /opt/app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /opt/app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]