
## Roadmap

1. Landing site & following pages connected to an API:
  - Main landing page
  - Signup
  - Signup success
  - Signin
  - Forgot password
  - Reset password
  - Accept invitation
  - Privacy policy
  - Terms of service
2. [Restful API](https://github.com/paralect/koa-api-starter), connected to the MongoDB that implements landing site functionality.
3. Koa, React.JS based Single Page Application which shows after you login on landing site. Proper build configuration for development and production environments.
4. Application deployment using Ansible.
5. Continuous integration server using Drone CI.
6. MongoDB backups to S3.
7. Monitoring using [Grafana](https://grafana.com/).
8. Common application stats tracking using [Telegraf](https://github.com/influxdata/telegraf).
9. Configured development environment with hot reloading for the web part using webpack and server auto restart using nodemon.

Some common problems which already solved in the Ship.

1. [Error/info logging](https://github.com/startupsummer/product-stack/tree/master/common-logger)
2. [Node MongoDB](https://github.com/paralect/node-mongo).
3. Requests validation
4. [Common code style](https://github.com/paralect/eslint-config)
5. Running tests locally
6. Running tests in CI
