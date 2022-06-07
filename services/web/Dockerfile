FROM node:16.15.1-alpine3.15 as base

ARG NODE_ENV=production
ARG APP_ENV
ARG NEXT_PUBLIC_APP_ENV=$APP_ENV
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV

WORKDIR /app
EXPOSE 3002
COPY ["./package*.json", "/app/"]

RUN npm ci --quiet
COPY . ./

FROM base AS development
CMD npm run dev

FROM base AS release
RUN npm run build

CMD npm start
