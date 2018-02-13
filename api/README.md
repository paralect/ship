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

To start the project just run: `npm run development`. This command will start application on port `3001` and will automatically restart whenever you change any file in `./src` directory.

### Explanations of the files structure

We try to keep things as simple as possible, so you can focus on building product instead of learning concepts.

There are two main directories within project:
1. [src/config](./src/config) - consist of configuration for the [environment](./src/config/index.js), [koa server](./src/config/koa.js) and [API routes](./src/config/routes.js).
2. [src/resources](./src/resources) - REST api resources and everything related to the resource:
  - [database service](./src/resources/user/user.service.js) - resource service to work with database (MongoDB or other database)
  - [database schema](./src/resources/user/user.schema.js) - database schema for the resource entity.
  - [validators](./src/resources/account/validators/signup.validator.js) - request validation logic.
  - [controllers](./src/resources/account/account.controller.js) - the central place for the request handling and data manipulation.
  - [builders](./src/resource/user/user.builder.js) - creating database documents for testing.
  - [factory](./src/resource/user/user.factory.js) - predefined types of database documents for testing.
  - [tests](./src/resource/account/account.test.js) - mocha tests for the endpoint.

All other files, that does not fit that structure should be placed straight in the `src` folder. We can always introduce more folders as we need them. Currently root folder consist following:

1. [src/app.js](./src/app.js) - starting point of the node.js application. It combine application configuration and start Koa http listener.
2. [src/auth.service.js](./src/auth.service.js) - JWT based authentication helper. Consist logic of JWT token encryption/decryption. Can consist other authentication related functions.
3. [src/db.js](./src/db.js) - handles connection to the MongoDB.
4. [src/email.service.js](./src/email.service.js) - fake service for sending application emails.
5. [src/logger.js](./src/logger.js) - application logger.
6. [src/security.util.js](./src/security.util.js) - number of methods for generating secure tokens and comparing passwords with password hash.
7. [src/tests/app.spect.js](./src/tests/app.spec.js) - starting point for tests.

### List of improvements

1. Implement email service.
