FROM node:16.15.1-alpine3.15 as base
RUN apk add --no-cache python3 py3-pip

ARG NODE_ENV=production
ARG APP_ENV
ENV NODE_ENV=$NODE_ENV
ENV APP_ENV=$APP_ENV

WORKDIR /app
EXPOSE 3001
COPY ["./package*.json", "/app/"]
COPY ["./apps/api/package*.json", "./apps/api/.eslintrc.js", "./apps/api/tsconfig.json", "/app/apps/api/"]
RUN npm pkg delete scripts.prepare

# ---- Dependencies ----
FROM base AS dependencies
WORKDIR /app/apps/api
# install node packages
RUN npm config set depth 0
RUN npm ci --only=production --quiet
# copy production node_modules aside
RUN cp -R /app/node_modules /app/prod_node_modules

# Rewrite global node_modules with local ones (if exists)
RUN if [ -e /app/apps/api/node_modules ]; then \
    cp -Rf /app/apps/api/node_modules/* /app/prod_node_modules; \
    fi

# install ALL node_modules, including 'devDependencies'
RUN npm ci --quiet --include=dev

# ---- Build ----
FROM dependencies AS build
COPY ./apps/api/src /app/apps/api/src
RUN npm run build

FROM build AS development
CMD npm run dev

#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /app/prod_node_modules ./node_modules
# copy built dist
COPY --from=build /app/apps/api/dist /app/apps/api/dist

CMD npm --prefix=apps/api start
