FROM node:16.15.1-alpine3.15 as base
RUN apk add --no-cache python3 py3-pip

ARG NODE_ENV=production
ARG APP_ENV
ENV NODE_ENV=$NODE_ENV
ENV APP_ENV=$APP_ENV

WORKDIR /app
EXPOSE 3001
COPY ["./package*.json", "./.eslintrc.js", "./tsconfig.json", "/app/"]

# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm ci --only=production --quiet
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm ci --quiet --include=dev

# ---- Build ----
FROM dependencies AS build
COPY ./src /app/src
RUN npm run build

FROM build AS development
CMD npm run dev

#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /app/prod_node_modules ./node_modules
# copy built dist
COPY --from=build /app/dist ./dist

CMD npm start
