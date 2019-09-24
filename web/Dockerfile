FROM node:10.16.0

WORKDIR /app

COPY ./package.json ./
RUN npm i -s
COPY . .
RUN npm run build-client

EXPOSE 3002 8081

CMD npm start
