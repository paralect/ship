FROM node:16.15.1-alpine3.15 as base

ARG NODE_ENV=production
ARG APP_ENV
ARG NEXT_PUBLIC_APP_ENV=$APP_ENV
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV

WORKDIR /app
EXPOSE 3002

COPY ["./package*.json", "/app/"]
COPY ["./turbo.json", "/app/"]
COPY ["./apps/web/package*.json", "/app/apps/web/"]

# Copy dependencies' package.lock
# EX: COPY ["./packages/ui/package*.json", "/app/packages/ui/"]

RUN npm pkg delete scripts.prepare
RUN npm ci --include=dev --quiet
# Copy packages (service dependency packages)
# EX: COPY ./packages/ui ./packages/ui
# EX: RUN npm --prefix=packages/ui run build

# Copy web service
COPY ./apps/web ./apps/web


# Install dependencies from root folder

FROM base AS development
CMD npm --prefix=apps/web run dev

FROM base AS release
RUN npm --prefix=apps/web run build

CMD npm --prefix=apps/web start
