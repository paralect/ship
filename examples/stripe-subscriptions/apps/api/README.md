# Api Starter

Fully featured [Koa.JS](http://koajs.com/) restful api starter application.
The goal of this project is to solve all routine tasks and keep your focus on the product and business logic of the application, not on the common things, such logging, configuration, dev/production environments

Out of the box support following features:

1. Config management.
2. Configured console logger
3. Automatic application restart when code changes with [Nodemon](https://github.com/remy/nodemon)
4. MongoDB configuration
5. Docker configuration for development and production environments.
6. Code linting based on [ESLint](https://eslint.org/).
7. Simplified request data validation and clean up based on [joi](https://github.com/hapijs/joi) and [koa-validate](https://www.npmjs.com/package/koa-validate)
8. Production ready account API resource (singup, signin, forgot password, reset password functionality)
9. Access token based authentication.
10. WebSocket server (socket.io)
11. Database migrations
12. Scheduler

### Start application.

```bash
docker-compose up --build
```

To start the project not in the docker container just run: `npm run dev`. This command will start the application on port `3001` and will automatically restart whenever you change any file in `./src` directory.


### Important notes

You need to set ```APP_ENV``` variable in build args in a place where you deploy application. It is responsible for the config file from ```environment``` folder that will be taken when building your application


| APP_ENV       | File          |
| ------------- | ------------- |
| development   | development.json  |
| staging       | staging.json  |
| production    | production.json  |
