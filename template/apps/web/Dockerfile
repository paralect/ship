# BUILDER - Stage 1
FROM node:22-alpine AS builder
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
RUN npm install --global --no-update-notifier --no-fund turbo@2.5.4
COPY . .
RUN turbo prune --scope=web --docker

# INSTALLER - Stage 2
FROM node:22-alpine AS installer
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
RUN npm install --global --no-update-notifier --no-fund pnpm@9.5.0

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
CMD pnpm turbo run dev --filter=web

# APP_BUILDER - Stage 4
FROM installer AS app_builder

ARG APP_ENV=production
ENV NODE_ENV=production

# turbo prune may not include dotenv files — copy the env-specific file explicitly
COPY --from=builder /app/apps/web/.env.${APP_ENV} apps/web/.env.${APP_ENV}
RUN cp apps/web/.env.${APP_ENV} apps/web/.env

RUN pnpm turbo run build --filter=web

# RUNNER - Stage 5
FROM nginx:alpine AS runner

RUN rm /etc/nginx/conf.d/default.conf

# TanStack Start (SPA mode) emits the prerendered client into dist/client;
# serve it and route everything through index.html for client-side routing.
COPY --from=app_builder /app/apps/web/dist/client /usr/share/nginx/html

RUN printf 'server {\n\
    listen 3002;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 3002

CMD ["nginx", "-g", "daemon off;"]
