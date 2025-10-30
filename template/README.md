# [Documentation](https://ship.paralect.com/docs/introduction)

## Prerequisites

This project requires specific versions of Node.js and pnpm. Please check the `engines` and `packageManager` fields in `package.json` for the required versions.

### Node.js

If you're using [nvm](https://github.com/nvm-sh/nvm), you can automatically switch to the correct Node.js version by running:
```sh
nvm use
```

This will read the version from the `.nvmrc` file and switch to it automatically.

### pnpm

If you have [Corepack](https://nodejs.org/api/corepack.html) enabled (included with Node.js 16.10+), pnpm will automatically use the version specified in the `packageManager` field of `package.json`. You can enable Corepack by running:
```sh
corepack enable
```

## Starting Application with Turborepo 🚀

To run the infrastructure and all services -- just run:
```sh
pnpm start
```

### Running Infra and Services Separately with Turborepo

1. Start base infrastructure services in Docker containers:
    ```sh
    pnpm run infra
    ```
2. Run the services with Turborepo:
    ```sh
    pnpm run turbo-start
    ```

## Using Ship with Docker

To run the infrastructure and all services, execute:
```sh
pnpm run docker
```

### Running Infra and Services Separately with Docker

1. Start base infrastructure services in Docker containers:
    ```sh
    pnpm run infra
    ```
2. Run the services you need:
    ```sh
    ./bin/start.sh api web
    ```

You can also run infrastructure services separately using the `./bin/start.sh` bash script.
