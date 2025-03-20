# [Documentation](https://ship.paralect.com/docs/introduction)

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
