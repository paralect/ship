FROM node:8.9.4

EXPOSE 3001
COPY ["./package.json", "./package-lock.json", ".eslintrc.js", ".eslintignore", "/app/"]
WORKDIR /app
RUN npm i --quiet

VOLUME "/app/src"

CMD npm run development
