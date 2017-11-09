FROM node:8.2

EXPOSE 3000
COPY ["./package.json", "./package-lock.json", ".eslintrc.js", ".eslintignore", "/app/"]
RUN cd /app && npm i --quiet

WORKDIR /app
COPY ./src /app/src

RUN npm run build-client
CMD npm start
