# ── Stage 1: Build ──
FROM node:20.18.0-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.base.json ./
COPY packages/shared/package*.json packages/shared/
COPY apps/web/package*.json apps/web/
COPY apps/api/package*.json apps/api/

RUN npm ci

COPY packages/shared/src packages/shared/src
COPY packages/shared/tsconfig.json packages/shared/
COPY apps/web apps/web
COPY apps/api/prisma apps/api/prisma

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace @home-design-ops/shared && \
    npm run build --workspace @home-design-ops/web

# ── Stage 2: Production ──
FROM node:20.18.0-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/shared/package*.json packages/shared/
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/apps/web/package*.json apps/web/
COPY --from=builder /app/apps/web/.next apps/web/.next
COPY --from=builder /app/apps/web/public apps/web/public
COPY --from=builder /app/node_modules node_modules

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace", "@home-design-ops/web"]
