# Ship
A toolkit for makers to ship better products faster 🚀.

Ship is based on Stack. Stack is an open-source (soon!) toolkit based on Node.JS, React.JS, PostCSS & friends.
The Stack is result of 5 years of hard work on a number of awesome products.

Shipping is crucial part of any new product. The quicker you ship, the more time you have to validate your hypotheses. The quicker you validate your idea, the sooner you know if you're building what people want.

In the rush, developers often ignore quality. Backups, monitoring, proper data validation, etc seems not so important in the beginning. Sometimes you're lucky, sometimes not.

We believe we could ship great products faster, while maintain decent quality and have a plan for scaling when hypotheses where right.

## Getting Started with Ship

Just fork or clone and push repository into your own repo. 

### Deployment Getting Started

1. [Setup Drone continuous integration server](./deploy/drone-ci/README.md)
2. [Setup Staging deployment pipeline](./deploy/app/README.md)

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
