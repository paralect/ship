FROM node:14.14-alpine as build
WORKDIR /app
COPY ["./package*.json", "/app/"]
RUN npm install --silent
COPY . ./
RUN npm run build

FROM nginx:1.19-alpine
COPY --from=build /app/dist/ /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
