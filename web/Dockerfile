FROM node:8.9

EXPOSE 3000
COPY ["./package.json", "./package-lock.json", "./.eslintrc.js", "./.eslintignore", "./.babelrc", "./browserslist", "./.stylelintrc", "/app/"]
COPY ./src /app/src

WORKDIR /app

RUN npm i --quiet
RUN npm run build-client

CMD npm start
