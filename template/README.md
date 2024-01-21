# [Documentation](https://ship.paralect.com/docs/introduction)

## Starting application with Turborepo

To run infra and all services -- just run: `pnpm start` 🚀

### Turborepo: Running infra and services separately

1. Start base infra services in Docker containers:

```bash
pnpm run infra
```

2. Run services with Turborepo

```bash
pnpm run turbo-start
```

## Using Ship with Docker

To run infra and all services -- just run: `pnpm run docker` 🚀

### Docker: Running infra and services separately

1. Start base infra services in Docker containers:

```bash
pnpm run infra
```

2. Run services you need:

```bash
./bin/start.sh api web
```

You can also run infra services separately with `./bin/start.sh` bash script.
