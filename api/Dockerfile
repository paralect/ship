FROM --platform=linux/amd64 node:16.13.1-alpine3.13
RUN apk add --no-cache python3 py3-pip

EXPOSE 3001

ARG NODE_ENV
ARG APP_ENV

ENV NODE_ENV=$NODE_ENV
ENV APP_ENV=$APP_ENV

WORKDIR /app
COPY ["./package*.json", "/app/"]

# Disable husky
RUN npm set-script prepare ""

RUN npm ci --quiet

COPY . ./

RUN npm run build-assets

CMD npm start
