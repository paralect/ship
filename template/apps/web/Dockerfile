# BUILDER - Stage 1
FROM node:18-alpine AS builder
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
RUN npm install --global --no-update-notifier --no-fund turbo@1.10.3
COPY . .
RUN turbo prune --scope=web --docker

# INSTALLER - Stage 2
FROM node:18-alpine AS installer
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
RUN npm install --global --no-update-notifier --no-fund pnpm@^8.0.0

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm fetch

# Build the project and its dependencies
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/out/full/ .
RUN pnpm install -r --prefer-offline --ignore-scripts
COPY --from=builder /app/out/full/turbo.json ./turbo.json

# DEVELOPMENT - Stage 3
FROM installer AS development
CMD pnpm turbo run dev --scope=web

# APP_BUILDER - Stage 4
FROM installer AS app_builder

ARG APP_ENV
ENV NEXT_PUBLIC_APP_ENV=$APP_ENV

RUN pnpm turbo run build --filter=web...

# RUNNER - Stage 5
FROM node:18-alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=app_builder /app/apps/web/next.config.js .
COPY --from=app_builder /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=app_builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=app_builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=app_builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

EXPOSE 3002

CMD ["node", "apps/web/server.js"]
