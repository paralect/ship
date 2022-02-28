FROM --platform=linux/amd64 node:16.13.1-alpine3.13 as base
RUN apk add --no-cache python3 py3-pip

EXPOSE 3001

ARG NODE_ENV=production
ARG APP_ENV

ENV NODE_ENV=$NODE_ENV
ENV APP_ENV=$APP_ENV

WORKDIR /app
COPY ["./package*.json", "/app/"]

# Disable husky
RUN npm set-script prepare ""

RUN npm ci --quiet

COPY . ./

FROM base as build
RUN npm run build-assets

FROM base as migrator
CMD npm run migrate

FROM build as scheduler
CMD npm run schedule

FROM build as app
CMD npm start
