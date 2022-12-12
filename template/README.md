# [Documentation](https://ship.paralect.com/docs/intro)

## Starting application with Turborepo

To run infra and all services -- just run: `npm start` 🚀

### Turborepo: Running infra and services separately

1. Start base infra services in Docker containers:

```bash
npm run infra
```

2. Run services with Turborepo

```bash
npm run turbo-start
```

## Using Ship with Docker

To run infra and all services -- just run: `npm run docker` 🚀

### Docker: Running infra and services separately

1. Start base infra services in Docker containers:

```bash
npm run infra
```

2. Run services you need:

```bash
./bin/start.sh api web
```

You can also run infra services separately with `./bin/start.sh` bash script.
