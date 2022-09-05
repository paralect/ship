## Starting application with Turborepo

### Starting infra

1. Start base infra services in Docker containers:

```bash
npm run infra
```

2. Run all apps (`api` and `web`) with Turborepo

```bash
npm start
```

### Using Ship without Turborepo

1. Start base infra services in Docker containers:

```bash
npm run infra
```

2. Replace `apps/api/src/config/environment/development.json` with following content:

```json
{
  "mongo": {
    "connection": "mongodb://root:root@mongo/api-development?authSource=admin&replicaSet=rs",
    "dbName": "api-development"
  },
  "apiUrl": "http://localhost:3001",
  "webUrl": "http://localhost:3002",
  "redis": "redis://:@redis:6379",
  "sendgridApiKey": "",
  "cloudStorage": {
    "endpoint": "fra1.digitaloceanspaces.com",
    "accessKeyId": "yourAccessKeyId",
    "secretAccessKey": "yourSecretAccessKey",
    "bucket": "yourBucket"
  },
  "adminKey": "replaceWithSecureApiKey"
}
```

3. Run services you need:

```j```

## Start application

```shell
npm start
```

## [Documentation](https://ship.paralect.com/docs/intro)
