FROM node:alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

ARG NODE_ENV=production
ARG APP_ENV

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    npm install --global --no-update-notifier --no-fund turbo pnpm
COPY . .
RUN pnpm turbo prune --scope=web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM builder AS installer
WORKDIR /app

# We need it to install dev dependencies such as TS
ENV NODE_ENV=development

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --no-frozen-lockfile --filter ./apps/web

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

ENV NODE_ENV=$NODE_ENV
ENV APP_ENV=$APP_ENV
ENV NEXT_PUBLIC_APP_ENV=$APP_ENV

RUN pnpm turbo run build --filter=web...

FROM installer AS development
CMD turbo run dev --scope=web

FROM node:alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

ENV PORT=3002
EXPOSE $PORT

CMD ["node", "apps/web/server.js"]
