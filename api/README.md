# Koa.JS REST api starter

Fully featured [Koa.JS](http://koajs.com/) restful api starter application.
The goal of this project is to solve all routine tasks and keep your focus on the product and business logic of the application, not on the common things, such logging, configuration, dev/production environments

Out of the box support following features:

1. Config management.
2. Configured console logger based on  [common-logger](https://www.npmjs.com/package/@paralect/common-logger)
3. Automatic application restart when code changes with [Nodemon](https://github.com/remy/nodemon)
4. MongoDB configuration
5. Docker configuration for development and production environments.
6. Code linting based on [paralect/eslint-config](https://github.com/paralect/eslint-config)
7. Simplified request data validation and clean up based on [joi](https://github.com/hapijs/joi) and [koa-validate](https://www.npmjs.com/package/koa-validate)
8. Production ready account API resource (singup, signin, forgot password, reset password functionality)
9. JWT based authentication.
10. Tests for endpoints.

### Starting api

In order to start server in the docker container you can use bash file `./bin/start.sh`:
```bash
$ ./bin/start.sh
```

To start the project not in the docker container just run: `npm run development`. This command will start the application on port `3001` and will automatically restart whenever you change any file in `./src` directory.

### Explanations of the files structure

We try to keep things as simple as possible, so you can focus on building product instead of learning concepts.

There are two main directories within project:

1. [src/config](./src/config) - consist of configuration for the [environment](./src/config/index.js), [koa server](./src/config/koa.js) and [API routes](./src/config/routes).
2. [src/config/routes](./src/config/routes) - consist of [public](./src/config/routes/public.js) (don't require jwt token) and [authenticated](./src/config/routes/authenticated.js) (require jwt token) routes and [middlewares](./src/config/routes/middlewares).    
    - [middlewares](./src/config/routes/middlewares) - koa middlewares which we use on every request (for example, get current user data from the database)

3. [src/resources](./src/resources) - REST api resources and everything related to the resource:
    - [database service](./src/resources/user/user.service.js) - resource service to work with database (MongoDB or other database)
    - [database schema](./src/resources/user/user.schema.js) - database schema for the resource entity.
    - [validators](./src/resources/account/validators/signup.validator.js) - request validation logic. You can use this validators inside of the validation middleware ([example in ./src/resources/account/public.js](./src/resources/account/public.js)) or you can use this validators inside of the controller ([example in ./src/resources/user/user.controller.js](./src/resources/user/user.controller.js))
    - [controllers](./src/resources/account/account.controller.js) - the central place for the request handling and data manipulation.
    - [builders](./src/resource/user/user.builder.js) - creating database documents for testing.
    - [factory](./src/resource/user/user.factory.js) - predefined types of database documents for testing.
    - [tests](./src/resource/user/user.spec.js) - mocha tests for the endpoint.

All other files, that does not fit that structure should be placed straight in the `src` folder. We can always introduce more folders as we need them. Currently root folder consist following:

1. [src/app.constants.js](./src/app.constants.js) - constant variables that are used in the application
2. [src/app.js](./src/app.js) - starting point of the node.js application. It combine application configuration and start Koa http listener.
3. [src/auth.service.js](./src/auth.service.js) - JWT based authentication helper. Consist logic of JWT token encryption/decryption. Can consist other authentication related functions.
4. [src/db.js](./src/db.js) - handles connection to the MongoDB.
5. [src/email.service.js](./src/email.service.js) - fake service for sending application emails.
6. [src/logger.js](./src/logger.js) - application logger.
7. [src/security.util.js](./src/security.util.js) - number of methods for generating secure tokens and comparing passwords with password hash.

### List of improvements

1. Implement email service.
