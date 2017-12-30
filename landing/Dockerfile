FROM node:8.9

EXPOSE 3000
COPY ["./package.json", "./package-lock.json", "./.eslintrc.js", "./.babelrc", "./postcss.config.js", "./babel-preset.js", "/app/"]
RUN cd /app && npm i --quiet

COPY ./src /app/src
WORKDIR /app

CMD npm start
