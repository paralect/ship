FROM node:10.16.0

EXPOSE 3002
COPY ["./package.json", "./package-lock.json", "./.eslintrc.js", "./.eslintignore", "./.babelrc", "./browserslist", "./.stylelintrc", "/app/"]
COPY ./src /app/src

WORKDIR /app

RUN npm i --quiet
RUN npm run build-client

CMD npm start
