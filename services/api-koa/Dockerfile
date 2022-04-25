FROM node:16.13.1-alpine3.13 as base
RUN apk add --no-cache python3 py3-pip

ARG NODE_ENV=development
ARG APP_ENV
ENV NODE_ENV=$NODE_ENV
ENV APP_ENV=$APP_ENV

WORKDIR /app
EXPOSE 3001 8082 9229
COPY ["./package.json", "package-lock.json", "./.eslintrc.js", "./tsconfig.json", "/app/"]

# ---- Dependencies ----
FROM base AS dependencies
# Disable husky
RUN npm set-script prepare ""
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm ci --only=production --quiet
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm ci --quiet --include=dev

FROM dependencies AS development
VOLUME "/app/src"
# copy local packages for quick debugging
CMD ["npm", "run", "dev"]

# ---- Build ----
FROM dependencies AS build
COPY ./src /app/src
RUN npm run build

#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /app/prod_node_modules ./node_modules
# copy built dist
COPY --from=build /app/dist ./dist
# expose port and define CMD
CMD ["npm", "start"]
