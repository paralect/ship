FROM --platform=linux/amd64 node:16.13.1-alpine3.13

EXPOSE 3002

ARG NODE_ENV=production
ARG APP_ENV
ARG NEXT_PUBLIC_APP_ENV=$APP_ENV

ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV

WORKDIR /app
COPY ["./package*.json", "/app/"]

# Disable husky
RUN npm set-script prepare ""

RUN npm ci --quiet

COPY . ./

RUN npm run build

CMD npm start
