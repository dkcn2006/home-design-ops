# ── Stage 1: Build ──
FROM node:20.18.0-alpine AS builder

WORKDIR /app

# Copy workspace configs
COPY package*.json tsconfig.base.json ./
COPY packages/shared/package*.json packages/shared/
COPY apps/api/package*.json apps/api/
COPY apps/web/package*.json apps/web/

# Install dependencies (monorepo hoisted)
RUN npm ci

# Copy source
COPY packages/shared/src packages/shared/src
COPY packages/shared/tsconfig.json packages/shared/
COPY apps/api/src apps/api/src
COPY apps/api/tsconfig.json apps/api/
COPY apps/api/prisma apps/api/prisma

# Build shared & api
RUN npm run build --workspace @home-design-ops/shared && \
    npm run build --workspace @home-design-ops/api

# ── Stage 2: Production ──
FROM node:20.18.0-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4010
ENV HOST=0.0.0.0

# Copy only production artifacts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/shared/package*.json packages/shared/
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/apps/api/package*.json apps/api/
COPY --from=builder /app/apps/api/dist apps/api/dist
COPY --from=builder /app/apps/api/prisma apps/api/prisma
COPY --from=builder /app/node_modules node_modules

EXPOSE 4010

# Run migrations then start
CMD ["sh", "-c", "cd apps/api && npx prisma migrate deploy && node dist/apps/api/src/main.js"]
