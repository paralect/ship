FROM node:10.16.0

WORKDIR /app
COPY ./package.json ./
RUN npm i -s
COPY . .

EXPOSE 3001

CMD npm start
